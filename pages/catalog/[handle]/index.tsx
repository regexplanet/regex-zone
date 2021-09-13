import { useRouter } from 'next/router'
import {
    Heading,
    Text,
    Box
  } from '@chakra-ui/react'
  import { GetStaticProps } from 'next'
  import type { NextPage } from 'next'

import Layout from '../../../components/layout'
import * as Catalog from '../../../src/Catalog';
import { ReactNode } from 'react';

type DetailProps = {
    children?: ReactNode,
    catalogItem: Catalog.CatalogEntry,
}


const CatalogDetail: NextPage = (props) => {

    const detailProps = props as DetailProps;
    const catalogItem = detailProps.catalogItem;
    const router = useRouter()
    const { handle } = router.query

    return (
          <Layout title={catalogItem.title}>
              <Text>Catalog {catalogItem.filename}</Text>
          </Layout>
      );
}

export default CatalogDetail;

export const getStaticProps: GetStaticProps = async (context) => {
    const handle = context.params?.handle;

    if (!handle || Array.isArray(handle)) {
        throw new Error('Invalid handle syntax in CatalogDetail.getStaticProps');
    }

    const catalogItem = await Catalog.get(handle);
    if (!catalogItem) {
        throw new Error(`Unknown handle '${handle}' in CatalogDetail.getStaticProps`);
    }

    return {
        props: { catalogItem }
    }
}

export async function getStaticPaths() {
    const items = await Catalog.getAll();

    return {
      paths: items.map((item) => {
        return {
          params: {
            handle: item.handle,
          },
        }
      }),
      fallback: false,
    }
  }
