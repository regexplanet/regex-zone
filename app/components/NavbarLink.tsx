import { Link, useLocation } from "react-router";

export type NavbarLinkProps = {
    link: NavbarLinkItem;
};

export type NavbarLinkItem = {
    link: string;
    label: string;
    icon: JSX.Element;
    icon_bold: JSX.Element;
};

export function NavbarLink({ link }: NavbarLinkProps) {
    const { pathname } = useLocation();
    const isActive = pathname.startsWith(link.link)

    return (
        <li className="nav-item" key={link.label} >
            <Link
                className={`nav-link px-3 py-0 py-lg-2 ${isActive ? ' active fw-bold' : ''}`}
                to={link.link}
            >
                <span className="d-lg-none" style={{"fontSize": "1.5rem"}}>{isActive ? link.icon_bold : link.icon}</span>
                <span className="d-none d-lg-inline">{link.label}</span>
            </Link>
        </li>
    );
}
