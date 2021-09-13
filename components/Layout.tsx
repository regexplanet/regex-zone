import Head from 'next/head'
import Link from 'next/link'
import { Avatar, Box, Center, Flex, Heading, Img, Text, useColorModeValue as mode } from '@chakra-ui/react';
import { useRouter } from 'next/router'


import { Logo } from './pro/Logo'
import { Navbar } from './pro/Navbar'
import { NavLink } from './pro/NavLink'
import { UserProfile } from './pro/UserProfile'

export const siteTitle = 'Regex Zone';
export const name = 'Regex Zone';

const Layout:(x:any)=>JSX.Element  = ({ children, h1, home, title }) => {
    const router = useRouter()

    return (
        <>
            <Head>
                <title>{h1 ? title : `${title} - ${siteTitle}`}</title>
            </Head>
            <Box minH="100vh" bg={mode('gray.50', 'gray.700')}>
            <Navbar>
                <Navbar.Brand>
                    <Center marginEnd="10">
                        <Link href="/">
                            <a>
                                <Img alt="logo" height="36px" css="margin-bottom:10px;display:inline" src="/favicon.svg"/>
                                <Heading as="h3" fontSize="36" marginStart="2" css="display:inline;font-weight:bold;padding:0">Regex Zone</Heading>
                            </a>
                        </Link>
                    </Center>
                </Navbar.Brand>
                <Navbar.Links>
                    <NavLink isActive={router.asPath == '/'}>
                        <Link href="/">
                            <a>Home {router.asPath}</a>
                        </Link>
                    </NavLink>
                    <NavLink isActive={router.asPath.startsWith('/catalog')}>
                        <Link href="/catalog/" passHref>
                            <a>Catalog</a>
                        </Link>
                    </NavLink>
                    <NavLink isActive={router.asPath.startsWith('/tags')}>
                        <Link href="/tags/" passHref>
                            <a>Tagsx</a>
                        </Link>
                    </NavLink>
                </Navbar.Links>
            </Navbar>
            <Box
                as="main"
                justifyContent="center"
                alignItems="flex-start"
                m="0 auto 4rem auto"
                maxWidth="960px"
                px={2}
                >

                <Heading as="h1" my="1.5">{h1 ? h1 : title}</Heading>
                {children}
            {!home && (
                <div className={``}>
                    <Link href="/">
                        <a>← Back to home</a>
                    </Link>
                </div>
            )}
                <Flex as="footer" justify="center" mt="3">
                    <a href="https://github.com/regexplanet/regex-zone"><Img alt="Github" height="1.2rem" mx="2" src="https://www.vectorlogo.zone/logos/github/github-icon.svg"/></a>
                    | <a href="https://twitter.com/RegexZone"><Img alt="Twitter" height="1.2rem" mx="2" src="https://www.vectorlogo.zone/logos/twitter/twitter-icon.svg"/></a>
                    | <a href="https://www.regexplanet.com/"><Img alt="RegexPlanet" height="1.2rem" mx="2" src="https://www.vectorlogo.zone/logos/regexplanet/regexplanet-icon.svg"/></a>
                    <Text>path={router.asPath}</Text>
                </Flex>
            </Box>
            </Box>
        </>
      )
}

export default Layout;
