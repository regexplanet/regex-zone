import { Authenticator } from "remix-auth";
import { cookieStorage } from "~/services/session.server";
import { GitHubStrategy } from "remix-auth-github";
import { processOrThrow } from "~/util/processOrThrow.server";
import { User } from "~/types/User";



const authenticator = new Authenticator<User>(cookieStorage, {
    sessionErrorKey: "authError",
    throwOnError: true,
});

const gitHubStrategy = new GitHubStrategy<User>(
  {
    clientID: processOrThrow("GITHUB_CLIENT_ID"),
    clientSecret: processOrThrow("GITHUB_CLIENT_SECRET"),
    callbackURL: `${processOrThrow("ORIGIN")}/auth/github/callback`,
  },
  async (loginData): Promise<User> => {
    // Get the user data from your DB or API using the tokens and profile
    console.log("loginData", loginData);
    //return User.findOrCreate({ email: loginData.profile.emails[0].value });
    return {
      displayName: loginData.profile.name.givenName,
      email: loginData.profile.emails[0].value,
      avatar: loginData.profile.photos[0].value,
      provider: "github",
      providerName: loginData.profile.displayName,
      id: `github:${loginData.profile.id}`,
    };
  }
);

authenticator.use(gitHubStrategy);

export { authenticator }