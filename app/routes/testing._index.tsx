import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
    return [
        { title: "Testing - Regex Zone" },
        { name: "description", content: "Testing resources for regular expressions" },
    ];
};

export default function Index() {
    return (
        <>
            <h1 className="py-2">Testing</h1>
            <div className="alert alert-info">
                Coming soon...
            </div>
        </>
    );
}