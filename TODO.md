# To Do

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
