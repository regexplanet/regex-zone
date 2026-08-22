import type { MetaFunction } from "react-router";
import { useLocation } from "react-router";

export const meta: MetaFunction = () => {
    return [
        { title: "Contact - Regex Zone" },
    ];
};

export default function Page() {

    const location = useLocation();

    let fullpath = location.pathname;
    if (location.search) {
        fullpath += '?' + location.search;
    }
    if (typeof window !== 'undefined') {
        fullpath = window.location.href
    }

    return (
        <>
            <iframe height="737" title="Embedded Wufoo Form" style={{ "width": "100%", "border": "none" }} sandbox="allow-popups-to-escape-sandbox allow-top-navigation allow-scripts allow-popups allow-forms allow-same-origin" src={`https://fileformat.wufoo.com/embed/z5yinul1mj3me9/?field14=regexzone&field16=${encodeURIComponent(fullpath)}`}></iframe>
        </>
    );
}
