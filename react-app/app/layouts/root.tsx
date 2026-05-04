import { Outlet } from 'react-router'
import { ThemeProvider } from '../../src/providers/ThemeProvider'
import { Helmet, HelmetProvider } from 'react-helmet-async'

export default function RootLayout() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <Helmet>
          <html lang="en" className="h-full antialiased" />
          <body className="min-h-full flex flex-col font-sans bg-black text-white" />
        </Helmet>
        <Outlet />
      </ThemeProvider>
    </HelmetProvider>
  )
}
