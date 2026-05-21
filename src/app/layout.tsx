import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Geist_Mono, Inter } from 'next/font/google';
import { cookies, headers } from 'next/headers';
import './globals.css';
import { QueryProvider } from './providers/QueryProvider';
import { SessionProvider } from './providers/SessionProvider';
import { SettingsProvider } from './providers/SettingsProvider';
import { Toaster } from '@/shared/ui/sonner';
import type { User } from '@/entities/session/model/types';

const inter = Inter({ variable: '--font-inter', subsets: ['latin', 'cyrillic'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Plinko',
  description: 'Plinko Game',
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  let accessToken: string | null = null;
  let user: User | null = null;

  const cookieStore = await cookies();
  const hasRefreshToken = Boolean(cookieStore.get('refreshToken')?.value);
  const hasAccessToken = Boolean(cookieStore.get('accessToken')?.value);

  if (hasAccessToken || hasRefreshToken) {
    try {
      const headersList = await headers();
      const host = headersList.get('host') ?? 'localhost:3000';
      const protocol = host.startsWith('localhost') ? 'http' : 'https';
      const cookieHeader = cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join('; ');

      const res = await fetch(`${protocol}://${host}/api/auth/session`, {
        cache: 'no-store',
        headers: { cookie: cookieHeader },
      });

      if (res.ok) {
        const data = (await res.json()) as { accessToken: string; user: User };
        accessToken = data.accessToken;
        user = data.user;
      }
    } catch {}
  }

  const soundEffectsEnabled = cookieStore.get('soundEffectsEnabled')?.value !== 'false';
  const animationsEnabled = cookieStore.get('animationsEnabled')?.value !== 'false';

  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <SettingsProvider
            soundEffectsEnabled={soundEffectsEnabled}
            animationsEnabled={animationsEnabled}
          >
            {accessToken && user ? (
              <SessionProvider accessToken={accessToken} user={user}>
                {children}
              </SessionProvider>
            ) : (
              children
            )}
          </SettingsProvider>
          <Toaster position="bottom-right" />
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
