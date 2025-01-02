# To Do

- [ ] Redos check
- [ ] Diagram 
- [ ] Glossary
- [ ] Tools page w/above
- [ ] copy to clipboard for variations
- [ ] patterns into database
- [ ] search.html
- [ ] test button for variations
- [ ] homepage: search
- [ ] homepage: featured
- [ ] homepage: latest
- [ ] notes for variations
- [ ] tags for variations
- [ ] post to RegexPlanet
- [ ] JSON schema for patterns
- [ ] CI for yaml validated via json schema
- [ ] more regex in the catalog
- [ ] post to places besides RXP
- [ ] 404 page

## Patterns

- [ ] URL: https://mathiasbynens.be/demo/url-regex
- [ ] Semver: https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
- [ ] RFC 3339 dates: https://datatracker.ietf.org/doc/html/rfc3339
- [ ] RFC 822 dates: https://datatracker.ietf.org/doc/html/rfc822#section-5
- [ ] IPv4
- [ ] IPv6
- [ ] SWIFT
- [ ] NANP phone number
- [ ] USA social security numbers
- [ ] Other national numbers
- [ ] Other postal codes
- [ ] 


## Data Model

all:
	- owner
	- created
	- updated

PatternBase (rpb)
	- handle
	- title
	- details_md
	- featured
	- public
	- tags (array)

PatternVariation (rpv)
	- title
	- engines (array)
	- pattern
	- flags
	- replacement

PatternVariationTest (rpt)
	- haystack
	- results (JSONB, per POSIX)


## POSIX API

- [GNU](https://www.gnu.org/software/libc/manual/html_node/Regexp-Subexpressions.html)

## Fonts

- Roboto Slab for headings
- OpenSans for body
- Nimbus Mono for code
