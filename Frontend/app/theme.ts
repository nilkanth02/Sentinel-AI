import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  colors: {
    brand: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    risk: {
      low: '#48bb78',
      medium: '#ed8936',
      high: '#f56565',
      critical: '#e53e3e',
    },
    gray: {
      50: '#f7fafc',
      100: '#edf2f7',
      200: '#e2e8f0',
      300: '#cbd5e0',
      400: '#a0aec0',
      500: '#718096',
      600: '#4a5568',
      700: '#2d3748',
      800: '#1a202c',
      900: '#171923',
    },
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  components: {
    Card: {
      baseStyle: {
        borderRadius: '8px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      },
    },
    Button: {
      baseStyle: {
        fontWeight: 'medium',
      },
    },
  },
})
