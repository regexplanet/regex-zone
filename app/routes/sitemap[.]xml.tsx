import { getAll, initialize } from "~/components/Patterns";
import { MIN_ARCHIVE_YEAR } from "~/util/constants";

function urlLine(url:string) {
    return `\t<url><loc>https://www.regex.zone${url}</loc></url>`
}

export async function loader() {

    const lines:string[] = [];

    lines.push("<?xml version='1.0' encoding='UTF-8'?>");
    lines.push('<?xml-stylesheet type="text/xsl" href="/sitemap.xslt" ?>');
    lines.push('<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9">');
    lines.push(urlLine('/'));
    lines.push(urlLine('/contact.html'));
    lines.push(urlLine('/patterns/'));
    lines.push(urlLine('/patterns/tags.html'));
    lines.push(urlLine('/search.html'));

    await initialize();
    for (const entry of getAll()) {
        lines.push(urlLine(`/patterns/${entry.handle}/`));
    }

    lines.push(urlLine('/links/'));
    lines.push(urlLine('/links/tags.html'));
    lines.push(urlLine('/links/archive/'));
    const currentYear = new Date().getFullYear();
    for (let year = MIN_ARCHIVE_YEAR; year <= currentYear; year++) {
        if (year == 2010) {
            continue;   // hack since no links in 2010
        }
        lines.push(urlLine(`/links/archive/${year}/`));
    }

    lines.push('</urlset>')

    return new Response(lines.join('\n'), {
        headers: {
            "Content-Type": "text/xml; charset=utf-8",
        },
    });
}
