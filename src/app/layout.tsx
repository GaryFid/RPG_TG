import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'tgRPG - Fantasy Strategy Game',
  description: 'Strategic fantasy RPG game for Telegram WebApp with Web3 integration',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#1e3a8a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-fantasy-dark-red via-fantasy-blood-red to-fantasy-emerald-dark`}>
        <Script 
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <div className="min-h-screen text-white">
          {children}
        </div>
      </body>
    </html>
  )
}
