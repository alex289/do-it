import { ThemeProvider } from '@/components/theme-provider';

import './globals.css';

import { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';

import { ThemeToggle } from '@/components/theme-toggle';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Personal Todo App',
  description: 'Manage your tasks efficiently',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f9fafb' },
    { media: '(prefers-color-scheme: dark)', color: '#222222' },
  ],
  initialScale: 1,
  width: 'device-width',
  colorScheme: 'light dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>
        <div className="container mx-auto p-4">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <header className="mb-8 flex justify-between">
              <h1 className="text-3xl font-bold">Personal Todo App</h1>
              <ThemeToggle />
            </header>
            {children}
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
