import { Link as RemixLink } from "@remix-run/react";

type TagProps = {
    tag: string,
    url: string,
}

export function Tag({ tag, url }: TagProps) {
    return (
        <RemixLink
            key={tag}
            to={url}
            className="badge text-bg-primary text-decoration-none me-2"
        >
            {tag.replace('-', ' ')}
        </RemixLink>
    );
}