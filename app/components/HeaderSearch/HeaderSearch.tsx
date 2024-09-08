import { Autocomplete, Group, Burger, rem, Anchor } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PiMagnifyingGlass } from 'react-icons/pi';
import { Link as RemixLink } from "@remix-run/react";

import classes from './HeaderSearch.module.css';
import RegexZoneSvg from '../Logos/RegexZoneSvg';

const links = [
    { link: '/library/', label: 'Library' },
    { link: '/docs/', label: 'Docs' },
    { link: 'https://www.regexplanet.com/', label: 'Testing' },
    { link: 'https://github.com/regexplanet/regex-zone/discussions', label: 'Community' },
];

export function HeaderSearch() {
    const [opened, { toggle }] = useDisclosure(false);

    const items = links.map((link) => (
        <RemixLink
            key={link.label}
            to={link.link}
            className={classes.link}
        >
            {link.label}
        </RemixLink>
    ));

    return (
        <header className={classes.header}>
            <div className={classes.inner}>
                <Group>
                    <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
                    <RegexZoneSvg style={{ width: rem(32), height: rem(32) }} />
                    <Anchor
                        className={classes.sitename}
                        href="/"
                        visibleFrom="md"
                    >Regex Zone</Anchor>
                </Group>

                <Group>
                    <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
                        {items}
                    </Group>
                    <Autocomplete
                        className={classes.search}
                        placeholder="Search"
                        leftSection={<PiMagnifyingGlass style={{ width: rem(16), height: rem(16) }} />}
                        data={['React', 'Angular', 'Vue', 'Next.js', 'Riot.js', 'Svelte', 'Blitz.js']}
                    />
                </Group>
            </div>
        </header>
    );
}