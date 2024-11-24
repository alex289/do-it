'use client';

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
      <h1 className="text-3xl font-bold">Do it!</h1>

      <div className="flex gap-4">
        <UserMenu />
        <ThemeToggle />
      </div>
    </header>
  );
}
