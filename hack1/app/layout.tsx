import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FarmChain Latina',
  description: 'Blockchain-powered agricultural platform for Latin American farmers',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'FarmChain Latina',
    description: 'Empowering Latin American farmers with blockchain technology',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        {children}
      </body>
    </html>
  )
}