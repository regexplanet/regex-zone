import { PiMagnifyingGlass } from 'react-icons/pi';
import { Link as RemixLink, useLocation } from "@remix-run/react";
import { Container, Navbar } from 'react-bootstrap';

import RegexZoneSvg from '../Logos/RegexZoneSvg';

const links = [
    { link: '/library/', label: 'Library' },
    //{ link: '/docs/', label: 'Docs' },
    { link: 'https://www.regexplanet.com/', label: 'Testing' },
    //{ link: 'https://github.com/regexplanet/regex-zone/discussions', label: 'Community' },
    { link: '/search.html', label: 'Search' },
    { link: '/404', label: '404' },
];

export function HeaderSearch() {
    const { pathname } = useLocation();

    const items = links.map((link) => (
        <li className="nav-item" key = {link.label} >
        <RemixLink
            className={pathname.startsWith(link.link) ? 'nav-link active fw-bold' : 'nav-link'}
            to={link.link}
        >
            {link.label}
        </RemixLink>
        </li>
    ));

    return (
        <>
            <Navbar className="bg-body-tertiary border-bottom">
                <Container>
                    <Navbar.Brand as={RemixLink} className="fw-bold" to="/">
                        <RegexZoneSvg height={'2rem'} className="pe-2" />
                        Regex Zone
                    </Navbar.Brand>
                    <ul className="navbar-nav">
                    {items}
                    </ul>
                </Container>
            </Navbar>
        </>
    );
}