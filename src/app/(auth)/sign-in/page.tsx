'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Key } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { forgetPassword, signIn } from '@/lib/auth-client';

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean(),
});

function ForgotPasswordDialog() {
  const [loading, setLoading] = useState(false);
  async function submit() {
    setLoading(true);
    const { error } = await forgetPassword({
      email: 'me@alexanderkonietzko.com',
      redirectTo: '/reset-password',
    });

    setLoading(false);

    if (error) {
      toast.error('Failed to send reset password email', {
        description: error.message,
      });
      return;
    }

    toast.success('Password reset email sent');
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="text-sm underline cursor-pointer">
          Forgot your password?
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Forgot password?</DialogTitle>
          <DialogDescription>
            Enter your email address and we will send you a password reset link.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              placeholder="max@mustermann.com"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={loading} onClick={submit}>
            {loading ? (
              <Spinner className="dark:text-black text-white" />
            ) : null}
            Request password reset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<'passkey' | 'password' | null>(null);
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  async function passkeySignIn() {
    setLoading('passkey');
    const res = await signIn.passkey();
    setLoading(null);

    if (res?.error) {
      toast.error('Failed to sign-in', {
        description: res.error.message,
      });
      return;
    }

    // Workaround: router.push makes the UserMenu not rendering at all
    window.location.href = '/';
  }

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setLoading('password');
    const res = await signIn.email({
      email: values.email,
      password: values.password,
      rememberMe: values.rememberMe,
    });
    setLoading(null);

    if (res.error) {
      toast.error('Failed to sign-in', {
        description: res.error.message,
      });
      return;
    }

    router.push('/');
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>
          Enter your email and password to sign in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="max@mustermann.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel className="flex justify-between">
                    Password <ForgotPasswordDialog />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="..." type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      disabled={field.disabled}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Remember me</FormLabel>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-4">
              <Button type="submit" disabled={loading === 'password'}>
                {loading === 'password' ? (
                  <Spinner className="dark:text-black text-white" />
                ) : null}
                Sign-in
              </Button>

              <Button
                variant="outline"
                type="button"
                className="gap-2"
                disabled={loading === 'passkey'}
                onClick={async () => await passkeySignIn()}>
                {loading === 'passkey' ? (
                  <Spinner className="mr-2 h-4 w-4" />
                ) : (
                  <Key className="mr-2 h-4 w-4" />
                )}
                Sign-in with Passkey
              </Button>
            </div>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
