
import { LinkTagUrlBuilder } from "~/util/LinkTagUrlBuilder";
import { TagList } from "~/components/TagList";
import { getLinkDomain } from "~/util/getLinkDomain";
import { ItemLinks } from "~/components/ItemLinks";
import { regex_link } from "~/db/schema";

type LinkTableProps = {
    links: typeof regex_link.$inferSelect[],
    currentUrl: string,
    isAdmin?: boolean,
};

export default function LinksTable({ links, currentUrl, isAdmin }: LinkTableProps) {

    return (
        <>
            <table className="table table-striped table-hover border-top">
                <tbody>
                    {links.map(link => (
                        <tr key={link.rxl_id}>
                            <td>
                                <a className="me-2" href={link.rxl_url}>{link.rxl_title}</a>
                                ({getLinkDomain(link.rxl_url)})
                            </td>
                            <td className="text-end">
                                <TagList tags={link.rxl_tags.sort()} urlBuilder={LinkTagUrlBuilder} />
                                {isAdmin ? <ItemLinks adminOnly={true} currentUrl={currentUrl} type="link" id={link.rxl_id} /> : null}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}