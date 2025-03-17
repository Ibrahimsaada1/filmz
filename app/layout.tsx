import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { QueryProvider } from '@/lib/providers/QueryProvider';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/config.client';
import ClientBody from '@/app/components/ClientBody'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <QueryProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </QueryProvider>
        </Providers>
      </body>
    </html>
  );
} 