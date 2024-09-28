import { Link as RemixLink } from "@remix-run/react";
import { AdminIcon } from "./AdminIcon";

type ItemType = "pattern" | "link";

type ItemTypeInfo = {
    baseUrl: string;
    column_prefix: string;
};

const itemTypeMap: Record<ItemType, ItemTypeInfo> = 
{
    "pattern": {
        baseUrl: "/patterns/",
        column_prefix: "rxp_",
    },
    "link": {
        baseUrl: "/links/",
        column_prefix: "rxl_",
    },
};

type ItemLinksProps = {
    type: ItemType;
    id: string;
    adminOnly?: boolean;
}

export function ItemLinks({ id, type, adminOnly }: ItemLinksProps) {
    const typeInfo = itemTypeMap[type];
    return (
        <>
            <RemixLink to={`${typeInfo.baseUrl}edit.html?${typeInfo.column_prefix}id=${id}`} className="btn btn-sm btn-secondary mx-1">{ adminOnly ? <AdminIcon /> : null } Edit</RemixLink>
            <RemixLink to={`${typeInfo.baseUrl}delete.html?${typeInfo.column_prefix}id=${id}`} className="btn btn-sm btn-secondary mx-1">{adminOnly ? <AdminIcon /> : null} Delete</RemixLink>
        </>
    );
}