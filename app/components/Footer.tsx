
const links = [
    { link: 'https://github.com/regexplanet/regex-zone/issues', label: 'Feedback' },
    { link: 'https://github.com/regexplanet/regex-zone?tab=readme-ov-file#credits', label: 'Credits'},
    { link: 'https://github.com/regexplanet/regex-zone', label: 'Source' },
    { link: 'https://github.com/regexplanet/regex-zone?tab=readme-ov-file#other-libraries-of-regex-patterns', label: 'Alternatives' },
];

export function Footer() {

    const initial:JSX.Element[] = []
    links.forEach((link, index) => {
        initial.push(<a className="text-body-tertiary text-decoration-none" href={link.link} key={link.label}>
                {link.label}
            </a>);
            if (index < links.length - 1) {
                initial.push(<span className="mx-1">|</span>);
            }
        }
    );

    return (
        <footer className="d-flex justify-content-center text-body-tertiary pt-3"><small>
            { initial }
        </small></footer>
    )
}