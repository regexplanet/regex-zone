export function getLinkDomain(url: string): string {
    const urlObj = new URL(url);

    let hostname = urlObj.hostname;

    if (hostname.startsWith("www.")) {
        hostname = hostname.substring(4);
    }

    return hostname;
}