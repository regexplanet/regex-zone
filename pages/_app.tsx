import type { AppProps } from 'next/app'
import { ChakraProvider } from "@chakra-ui/react"
import "@fontsource/roboto-slab/700.css"
import "@fontsource/open-sans/400.css"

import theme from "../components/theme"

function RegexZoneApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
        <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default RegexZoneApp
