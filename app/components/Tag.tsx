import { Link as RemixLink } from "@remix-run/react";

type TagProps = {
    tag: string,
    url: string,
    onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
}

export function Tag({ tag, onClick, url }: TagProps) {
    return (
        <RemixLink
            key={tag}
            to={url}
            onClick={onClick}
            preventScrollReset={true}
            className="badge text-bg-primary text-decoration-none me-2"
        >
            {tag.replaceAll('-', ' ')}
        </RemixLink>
    );
}