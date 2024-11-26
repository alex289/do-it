'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ThemeToggle } from './theme-toggle';
import UserMenu from './user-menu';

export default function Header() {
  const pathname = usePathname();

  if (pathname === '/display') {
    return null;
  }
  return (
    <header className="mb-8 flex justify-between">
      <Link href="/" className="text-3xl font-bold">
        Do it!
      </Link>

      <div className="flex gap-4">
        <UserMenu />
        <ThemeToggle />
      </div>
    </header>
  );
}
