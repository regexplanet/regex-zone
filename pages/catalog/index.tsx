import {
    Table,
    Text,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Box
  } from '@chakra-ui/react';
import { GetStaticProps } from 'next'
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import Layout from '../../components/layout'
import * as Catalog from '../../src/Catalog';
import { ReactNode } from 'react';

type IndexProps = {
    children?: ReactNode,
    catalogItems: Catalog.CatalogEntry[],
}

const CatalogIndex: NextPage = (props) => {

    const indexProps = props as IndexProps;

    const rows = [];
    for (const item of indexProps.catalogItems) {
        rows.push(
            <Tr key={item.handle}>
                <Td><Link href={`/catalog/${item.handle}/`}>{item.title}</Link></Td>
            </Tr>
            );
    }
    return (
        <Layout title="Catalog">
            <Text>Catalog</Text>
            <Table variant="striped">
                <Tbody>
                {rows}
                </Tbody>
            </Table>
            <Link href="/catalog/test/">
                <a>{JSON.stringify(props)}</a>
            </Link>

        </Layout>
    );
}

export default CatalogIndex;


export const getStaticProps: GetStaticProps = async (context) => {

    const catalogItems = await Catalog.getAll();

    catalogItems.sort((a, b) => { return a.title.localeCompare(b.title); });

    return {
      props: { catalogItems }, // will be passed to the page component as props
    }
  }
