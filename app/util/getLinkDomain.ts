
const domainsWithPath:Set<string> = new Set([
    "github.com",
    "gitlab.com",
    "wikis.world",
    "en.wikipedia.org",
]);

export function getLinkDomain(url: string): string {
    const urlObj = new URL(url);

    let hostname = urlObj.hostname;

    if (hostname.startsWith("www.")) {
        hostname = hostname.substring(4);
    }

    if (domainsWithPath.has(hostname)) {
        const pathParts = urlObj.pathname.split("/");
        if (pathParts.length >= 1) {
            hostname = hostname + "/" + pathParts[1];
        }
    }

    return hostname;
}