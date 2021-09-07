import {
    Text,
  } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import Layout from '../../components/layout';

const TagIndex: NextPage = () => {
    return (
        <Layout title="Tags">
            <Text>Tagzs go here</Text>
        </Layout>
    );
}

export default TagIndex;
