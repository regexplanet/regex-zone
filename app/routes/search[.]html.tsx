import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
    return [
        { title: "Search - Regex Zone" },
        { name: "description", content: "Search for useful regular expression resources" },
    ];
};

export default function Index() {
    return (
        <>
            <h1 className="py-2">Search</h1>
            <div className="alert alert-info">
                Coming soon...
            </div>
        </>
    );
}
