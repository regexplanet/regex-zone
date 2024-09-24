import { PiBlueprint, PiBlueprintBold, PiLink, PiMagnifyingGlass, PiMagnifyingGlassBold, PiPlay, PiPlayBold, PiUsersThree, PiUsersThreeBold } from 'react-icons/pi';
import { Link as RemixLink } from "@remix-run/react";

import RegexZoneSvg from './RegexZoneSvg';
import { NavbarLink, NavbarLinkItem } from './NavbarLink';
import { AuthButton } from './AuthButton';

const links:NavbarLinkItem[] = [
    { link: '/patterns/', label: 'Patterns', icon: <PiBlueprint />, icon_bold: <PiBlueprintBold /> },
    { link: '/links/', label: 'Links', icon: <PiLink />, icon_bold: <PiLink /> },
    { link: '/testing/', label: 'Testing', icon: <PiPlay />, icon_bold: <PiPlayBold /> },
    { link: '/sharing/', label: 'Sharing', icon: <PiUsersThree />, icon_bold: <PiUsersThreeBold /> },
    { link: '/search.html', label: 'Search', icon: <PiMagnifyingGlass />, icon_bold: <PiMagnifyingGlassBold /> },
];

export function Navbar() {

    const items = links.map((link, index) => (<NavbarLink key={`key${index}`} link={link} />));

    return (
        <>
            <nav className="navbar navbar-expand bg-body-tertiary border-bottom">
                <div className="container-lg d-flex">
                    <RemixLink className="navbar-brand fs-4 fw-bold flex-grow-1" to="/">
                        <RegexZoneSvg height={'2rem'} className="pe-2 d-none d-md-inline" />
                        Regex Zone
                    </RemixLink>
                    <ul className="navbar-nav mt-1">
                    {items}
                    </ul>
                    <AuthButton />
                </div>
            </nav>
        </>
    );
}