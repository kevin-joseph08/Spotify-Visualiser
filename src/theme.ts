import { Theme as baseTheme } from '@chakra-ui/react'

export const theme = {
  ...baseTheme,
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
} 