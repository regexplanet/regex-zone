import React from 'react'
import {
    Button,
    Image,
    Stack,
    Box
} from '@chakra-ui/react'
import NextLink from 'next/link'


const Container:(x:any)=>JSX.Element  = ({ children, home, title }) => {

    //const { colorMode } = useColorMode()

    const bgColor = {
        light: 'white',
        dark: '#171717'
    }

    const color = {
        light: 'black',
        dark: 'white'
    }

    const navHoverBg = {
        light: 'gray.600',
        dark: 'gray.300',
    }


    return (
        <>
            <Box display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                maxWidth="960px"
                minWidth="356px"
                width="100%"
                as="nav"
                px={[2, 6, 6]}
                py={2}
                mt={8}
                mb={[0, 0, 8]}
                mx="auto"
            >
                <Stack direction="row">
                    <NextLink href="/" passHref>
                        <Image alt="RegexZone Logo" boxSize="24px" src="/favicon.svg" />
                    </NextLink>
                    <NextLink href="/" passHref>
                        <Button as="a">
                            Regex Zone
                        </Button>
                    </NextLink>
                </Stack>
                <Box>
                    <NextLink href="/catalog" passHref>
                        <Button as="a">
                            Catalog
                        </Button>
                    </NextLink>
                    <NextLink href="/tags" passHref>
                        <Button as="a">
                            Tags
                        </Button>
                    </NextLink>
                </Box>
            </Box >
            <Box display="flex"
                as="main"
                justifyContent="center"
                flexDirection="column"
                px={[0, 4, 4]}
                mt={[4, 8, 8]}
            >
                {children}
            </Box>
        </>
    )
}

export default Container;