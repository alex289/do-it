import { db } from '@/db';
import * as schema from '@/db/schema';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { passkey } from 'better-auth/plugins';

import { changeEmail, sendForgotPasswordEmail, verifyEmail } from './email';

export const auth = betterAuth({
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, newEmail, url }) => {
        await changeEmail(newEmail, user.name, url);
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendForgotPasswordEmail(user.email, user.name, url);
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await verifyEmail(user.email, user.name, url);
    },
  },
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema,
  }),
  plugins: [passkey()],
});
