'use client'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    // In Chinese and Japanese the characters are usually larger,
    // so a smaller fontsize may be appropriate.
    fontSize: 24,
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <body className={inter.className}>{children}</body>
    </ThemeProvider>
    </html>
  )
}
