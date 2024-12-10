import { passkeyClient } from 'better-auth/plugins';
import { createAuthClient } from 'better-auth/react';

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_URL as string,
  plugins: [passkeyClient()],
});

export const {
  signUp,
  signIn,
  signOut,
  useSession,
  passkey,
  useListPasskeys,
  forgetPassword,
  resetPassword,
  deleteUser,
  updateUser,
  changeEmail,
  changePassword,
} = authClient;
