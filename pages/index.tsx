import { Box, Heading, Text } from "@chakra-ui/react";
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import Layout from '../components/layout'

const RootIndex: NextPage = () => {

    return (
        <Layout h1="Welcome to the Regex Zone!" home={true} title="Regex Zone: A Catalog of Useful Regular Expressions">
                <Text>
                    A <Link href="/catalog/"><a>catalog</a></Link> of useful <a href="">Regular Expressions</a>.
                </Text>
                <Heading as="h5" size="sm" mt="3">What is a Regular Expression?</Heading>
        </Layout>
    )
  }

export default RootIndex;
