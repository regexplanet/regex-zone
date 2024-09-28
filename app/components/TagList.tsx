import { Tag } from "./Tag";

type TagListProps = {
    tags: string[],
    urlBuilder: (tag: string) => string,
}

export function TagList({ tags, urlBuilder }: TagListProps) {
    return (
        <>
            {tags.map((tag) => (
                <Tag key={tag} tag={tag} url={urlBuilder(tag)} />
            ))}
        </>
    );
}
