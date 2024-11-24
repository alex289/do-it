'use client';

/* eslint-disable @typescript-eslint/no-misused-promises */
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  passkey,
  signOut,
  useListPasskeys,
  useSession,
} from '@/lib/auth-client';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

function getInitials(name: string) {
  const parts = name.split(' ');
  const initials = parts
    .slice(0, 3)
    .map((part) => part.charAt(0).toUpperCase());
  return initials.join('');
}

export default function UserMenu() {
  const [mounted, setMounted] = useState(false);
  const session = useSession();
  const passkeys = useListPasskeys();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (session.isPending) {
    return (
      <Button variant="secondary" size="icon" className="rounded-full">
        <Avatar>
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  if (!session.data) {
    return null;
  }

  async function signOutAndRedirect() {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in');
        },
      },
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <Avatar>
            <AvatarFallback>
              {getInitials(session.data.user.name ?? '')}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{session.data.user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={(passkeys.data && passkeys.data.length > 0) ?? false}
          onClick={async () => await passkey.addPasskey()}>
          Add Passkey
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={async () => await signOutAndRedirect()}>
          Sign-out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
