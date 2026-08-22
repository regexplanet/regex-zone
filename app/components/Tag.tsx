import { Link } from "react-router";

type TagProps = {
    tag: string,
    url: string,
    onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
}

export function Tag({ tag, onClick, url }: TagProps) {
    return (
        <Link
            key={tag}
            to={url}
            onClick={onClick}
            preventScrollReset={true}
            className="badge text-bg-primary text-decoration-none me-2"
        >
            {tag.replaceAll('-', ' ')}
        </Link>
    );
}
