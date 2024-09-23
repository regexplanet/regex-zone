import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
    return [
        { title: "Links - Regex Zone" },
        { name: "description", content: "Random interesting links vaguely related to regular expressions" },
    ];
};

export default function Index() {
    return (
        <>
            <h1 className="py-2">Links</h1>
            <div className="alert alert-info">
                Coming soon...
            </div>
        </>
    );
}