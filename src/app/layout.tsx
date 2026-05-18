import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter, Geist_Mono } from 'next/font/google'
import { headers, cookies } from 'next/headers'
import './globals.css'
import { QueryProvider } from './providers/QueryProvider'
import { SessionProvider } from './providers/SessionProvider'
import type { User } from '@/entities/session/model/types'

const inter = Inter({ variable: '--font-inter', subsets: ['latin', 'cyrillic'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Plinko',
  description: 'Plinko Game',
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  let accessToken: string | null = null
  let user: User | null = null

  const cookieStore = await cookies()
  const hasRefreshToken = !!cookieStore.get('refreshToken')?.value

  if (hasRefreshToken) {
    try {
      const headersList = await headers()
      const host = headersList.get('host') ?? 'localhost:3000'
      const protocol = host.startsWith('localhost') ? 'http' : 'https'
      const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join('; ')

      const res = await fetch(`${protocol}://${host}/api/auth/session`, {
        cache: 'no-store',
        headers: { cookie: cookieHeader },
      })

      if (res.ok) {
        const data = (await res.json()) as { accessToken: string; user: User }
        accessToken = data.accessToken
        user = data.user
      }
    } catch {
      // мережева помилка — продовжуємо без сесії
    }
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          {accessToken && user ? (
            <SessionProvider accessToken={accessToken} user={user}>
              {children}
            </SessionProvider>
          ) : (
            children
          )}
        </QueryProvider>
      </body>
    </html>
  )
}
