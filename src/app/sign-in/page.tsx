'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  passkey,
  signIn,
  signOut,
  signUp,
  useSession,
} from '@/lib/auth-client';

export default function SignPage() {
  const router = useRouter();
  const session = useSession();

  async function passkeySignIn() {
    await signIn.passkey({
      fetchOptions: {
        onResponse() {
          router.push('/');
        },
      },
    });
  }

  async function emailSignIn() {
    const res = await signUp.email({
      email: 'test@example.com',
      password: 'password1234',
      name: 'test',
    });

    console.log(res);
  }
  return (
    <div>
      <h1>Sign In</h1>
      <div suppressHydrationWarning>{JSON.stringify(session)}</div>
      <Button
        variant="outline"
        className="gap-2"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={async () => await passkey.addPasskey()}>
        Add passkey
      </Button>
      <Button
        variant="outline"
        className="gap-2"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={async () => await passkeySignIn()}>
        Sign-in with Passkey
      </Button>
      <Button
        variant="outline"
        className="gap-2"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={async () => await emailSignIn()}>
        Sign-up
      </Button>
      <Button
        variant="outline"
        className="gap-2"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={async () => await signOut()}>
        Sign-out
      </Button>
    </div>
  );
}
