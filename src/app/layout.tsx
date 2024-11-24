import { ThemeProvider } from '@/components/theme-provider';

import './globals.css';

import { Inter } from 'next/font/google';

import { ThemeToggle } from '@/components/theme-toggle';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Personal Todo App',
  description: 'Manage your tasks efficiently',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
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
