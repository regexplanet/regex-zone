import { randomUUID } from "node:crypto";

import { cookieStorage } from "~/services/session.server";
import { User } from "~/types/User";
import { processEnvOrThrow } from "~/util/processEnvOrThrow.server";

type OAuthProvider = "github" | "gitlab" | "hello";

type ProviderConfig = {
  authorizationUrl: string;
  clientId: string;
  clientSecret: string;
  name: string;
  profileFn: (accessToken: string) => Promise<ProviderProfile>;
  scopes: string[];
  tokenUrl: string;
};

type ProviderProfile = {
  avatar?: string;
  email?: string;
  id: string | number;
  name?: string;
  username?: string;
};

const providers: Record<OAuthProvider, ProviderConfig> = {
	github: {
		authorizationUrl: "https://github.com/login/oauth/authorize",
		clientId: processEnvOrThrow("GITHUB_CLIENT_ID"),
		clientSecret: processEnvOrThrow("GITHUB_CLIENT_SECRET"),
		name: "GitHub",
		profileFn: getGithubProfile,
		scopes: ["read:user", "user:email"],
		tokenUrl: "https://github.com/login/oauth/access_token",
	},
	gitlab: {
		authorizationUrl: "https://gitlab.com/oauth/authorize",
		clientId: processEnvOrThrow("GITLAB_CLIENT_ID"),
		clientSecret: processEnvOrThrow("GITLAB_CLIENT_SECRET"),
		name: "GitLab",
		profileFn: getGitLabProfile,
		scopes: ["read_user"],
		tokenUrl: "https://gitlab.com/oauth/token",
	},
	hello: {
		authorizationUrl: "https://wallet.hello.coop/authorize",
		clientId: processEnvOrThrow("HELLO_CLIENT_ID"),
		clientSecret: processEnvOrThrow("HELLO_CLIENT_SECRET"),
		name: "Hello.coop",
		profileFn: getHelloProfile,
		scopes: ["openid", "profile", "nickname"],
		tokenUrl: "https://wallet.hello.coop/oauth/token",
	},
};

function isProvider(value: string): value is OAuthProvider {
  return value in providers;
}

function callbackUrl(provider: OAuthProvider): string {
  return `${processEnvOrThrow("ORIGIN")}/auth/${provider}/callback`;
}

async function fetchJson<T>(url: string, accessToken: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Response("Unable to retrieve OAuth profile", { status: 502 });
  }

  return response.json() as Promise<T>;
}

async function getGitLabProfile(accessToken: string): Promise<ProviderProfile> {
  const profile = await fetchJson<{
    avatar_url?: string;
    email?: string;
    id: number;
    name?: string;
    username?: string;
  }>("https://gitlab.com/api/v4/user", accessToken);
  return {
    avatar: profile.avatar_url,
    email: profile.email,
    id: profile.id,
    name: profile.name,
    username: profile.username,
  };
}

async function getHelloProfile(accessToken: string): Promise<ProviderProfile> {
  const profile = await fetchJson<{
    picture?: string;
    email?: string;
    sub: string;
    name?: string;
	nickname?: string;
    username?: string;
  }>("https://wallet.hello.coop/oauth/userinfo", accessToken);

  console.log(profile);

  return {
    avatar: profile.picture,
    email: profile.email,
    id: profile.sub,
    name: profile.name,
    username: profile.nickname ?? profile.name,
  };
}

async function getGithubProfile(
  accessToken: string
): Promise<ProviderProfile> {
  const profile = await fetchJson<{
    avatar_url?: string;
    email?: string;
    id: number;
    login?: string;
    name?: string;
  }>("https://api.github.com/user", accessToken);
  let email = profile.email;

  if (!email) {
    const emails = await fetchJson<Array<{
      email: string;
      primary: boolean;
      verified: boolean;
    }>>("https://api.github.com/user/emails", accessToken);
    email = emails.find((entry) => entry.primary && entry.verified)?.email;
  }

  return {
    avatar: profile.avatar_url,
    email,
    id: profile.id,
    name: profile.name,
    username: profile.login,
  };
}

async function getProfile(provider: OAuthProvider, accessToken: string): Promise<ProviderProfile> {
  const config = providers[provider];
  return config.profileFn(accessToken);
}

const authenticator = {
  async isAuthenticated(request: Request): Promise<User | null> {
    const session = await cookieStorage.getSession(request.headers.get("Cookie"));
    return (session.get("user") as User | undefined) ?? null;
  },

  async beginAuthentication(request: Request, provider: string) {
    if (!isProvider(provider)) {
      throw new Response("Unsupported OAuth provider", { status: 404 });
    }

    const config = providers[provider];
    const state = randomUUID();
    const session = await cookieStorage.getSession(request.headers.get("Cookie"));
    session.set(`oauth_state:${provider}`, state);

    const url = new URL(config.authorizationUrl);
    url.search = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: callbackUrl(provider),
      response_type: "code",
      scope: config.scopes.join(" "),
      state,
    }).toString();

    return { session, url: url.toString() };
  },

  async completeAuthentication(request: Request, provider: string) {
    if (!isProvider(provider)) {
      throw new Response("Unsupported OAuth provider", { status: 404 });
    }

    const callback = new URL(request.url);
    const code = callback.searchParams.get("code");
    const state = callback.searchParams.get("state");
    const session = await cookieStorage.getSession(request.headers.get("Cookie"));
    const stateKey = `oauth_state:${provider}`;

    if (!code || !state || state !== session.get(stateKey)) {
      throw new Response("Invalid OAuth callback", { status: 400 });
    }

    const config = providers[provider];
    const tokenResponse = await fetch(config.tokenUrl, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: callbackUrl(provider),
      }),
    });
    const token = (await tokenResponse.json()) as { access_token?: string };

    if (!tokenResponse.ok || !token.access_token) {
      throw new Response("OAuth token exchange failed", { status: 502 });
    }

    const profile = await getProfile(provider, token.access_token);
    if (!profile.email) {
      throw new Response("OAuth provider did not return an email address", {
        status: 422,
      });
    }

	const id = `${provider}:${profile.id}`;
	const adminList = process.env.ADMINS?.split(",") ?? [];
	const isAdmin = adminList.includes(id);

    session.unset(stateKey);
    session.set("user", {
      avatar: profile.avatar,
      displayName: profile.name ?? profile.username ?? profile.email,
      email: profile.email,
      id,
      isAdmin,
      provider,
      providerName: config.name,
	  providerId: profile.id,
    } satisfies User);

    return session;
  },
};

export { authenticator };
