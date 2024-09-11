import { Link as RemixLink } from "@remix-run/react";

export function TagList(tags: string[]) {
    return (
        <>
            {tags.map((tag) => (
                <RemixLink
                    key={tag}
                    to={`/library/tags.html?tag=${tag}`}
                    className="badge text-bg-primary text-decoration-none me-2"
                >
                    {tag.replace('-', ' ')}
                </RemixLink>
            ))}
        </>
    );
}
