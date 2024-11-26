import { db } from '@/db';
import { passkey } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ArrowLeft } from 'lucide-react';
import { headers } from 'next/headers';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { auth } from '@/lib/auth';
import {
  AddPasskey,
  ChangeEmail,
  ChangePassword,
  DeleteAccount,
  EditProfile,
} from './page.client';

export default async function Settings() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const existingPasskey = await db.query.passkey.findFirst({
    where: eq(passkey.userId, session.user.id),
    columns: {
      id: true,
    },
  });
  return (
    <div className="mx-auto w-[50%]">
      <Button variant="link" asChild className="mb-2">
        <Link href="/">
          <ArrowLeft className="mr-1" />
          Back
        </Link>
      </Button>
      <EditProfile name={session.user.name} image={session.user.image} />
      <Separator className="my-6" />
      <ChangeEmail email={session.user.email} />
      <Separator className="my-6" />
      <ChangePassword />
      <Separator className="my-6" />
      <AddPasskey existingPasskey={!!existingPasskey} />
      <Separator className="my-6" />
      <DeleteAccount />
    </div>
  );
}
