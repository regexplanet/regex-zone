import { Link as RemixLink } from "@remix-run/react";

type TagListProps = {
    tags: string[],
    urlBuilder: (tag: string) => string,
}

export function TagList( {tags, urlBuilder }: TagListProps)  {
    return (
        <>
            {tags.map((tag) => (
                <RemixLink
                    key={tag}
                    to={urlBuilder(tag)}
                    className="badge text-bg-primary text-decoration-none me-2"
                >
                    {tag.replace('-', ' ')}
                </RemixLink>
            ))}
        </>
    );
}
