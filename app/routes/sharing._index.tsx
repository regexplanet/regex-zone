import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
    return [
        { title: "Sharing - Regex Zone" },
        { name: "description", content: "Regular expressions shared by the community" },
    ];
};

export default function Index() {
    return (
        <>
            <h1 className="py-2">Sharing</h1>
            <div className="alert alert-info">
                Coming soon...
            </div>
        </>
    );
}