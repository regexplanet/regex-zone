import type { MetaFunction } from "@remix-run/node";
import { Link as RemixLink, useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { desc, arrayContains } from "drizzle-orm";

import { getAll, initialize, PatternEntry } from "~/components/Patterns";
import { TagList } from "~/components/TagList";
import { PatternTagUrlBuilder } from "~/util/PatternTagUrlBuilder";
import LinksTable from "~/components/LinksTable";
import { RootLoaderData } from "~/types/RootLoaderData";
import { dborm } from "~/db/connection.server";
import { regex_link } from "~/db/schema";

export const loader = async () => {
	await initialize();

	const links = await dborm.select()
		.from(regex_link)
		.where(arrayContains(regex_link.rxl_tags, ["patterns"]))
		.orderBy(desc(regex_link.rxl_created_at))
		.limit(100);

	return json({
		patterns: getAll(),
		links,
	});
};

export const meta: MetaFunction = () => {
	return [
		{ title: "Patterns - Regex Zone" },
		{ name: "description", content: "A collection of useful regular expression patterns" },
	];
};

function PatternEntryRow(entry: PatternEntry) {
	return (
		<tr key={entry.handle}>
			<td>
				<RemixLink to={`${entry.handle}/`}>{entry.title}</RemixLink>
			</td>
			<td style={{ 'textAlign': 'right' }}>
				{entry.tags ? <TagList tags={entry.tags} urlBuilder={PatternTagUrlBuilder} /> : null}
				<div className="badge text-bg-secondary">{entry.variations.length}</div>
			</td>
		</tr>
	);
}

export default function Index() {
	const { user } = useRouteLoaderData<RootLoaderData>("root") as unknown as RootLoaderData;
	const data = useLoaderData<typeof loader>();
	const links = data.links as unknown as typeof regex_link.$inferSelect[];

	const entryRows = data.patterns.map((entry) => PatternEntryRow(entry));

	return (
		<>
			<h1 className="py-2">Patterns</h1>
			<table className="table table-striped table-hover">
				<thead>
					<tr>
						<th>Title</th>
						<th>&nbsp;</th>
					</tr>
				</thead>
				<tbody>
					{entryRows}
				</tbody>
			</table>
			<h2 className="pt-3">Links</h2>
			<div className="alert alert-info">Other websites with useful regex patterns</div>
			<LinksTable currentUrl="/links/" links={links} isAdmin={user?.isAdmin} />
			<details><summary>Raw data</summary>
				<pre>{JSON.stringify(data.patterns, null, 4)}</pre>
			</details>
		</>
	);
}
