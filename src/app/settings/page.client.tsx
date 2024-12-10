'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Key, Trash, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  changeEmail,
  changePassword,
  deleteUser,
  passkey,
  updateUser,
} from '@/lib/auth-client';

const editProfileSchema = z.object({
  name: z.string().min(2),
  image: z.string(),
});

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function EditProfile({
  name,
  image,
}: {
  name: string;
  image: string | null | undefined;
}) {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name,
      image: image ?? '',
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    return file ? await convertImageToBase64(file) : '';
  };

  async function onSubmit(values: z.infer<typeof editProfileSchema>) {
    setLoading(true);
    const { error } = await updateUser({
      name: values.name,
      image: values.image,
    });
    setLoading(false);

    if (error) {
      toast.error('Failed to change email', {
        description: error.message,
      });
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="grid gap-1">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Max Mustermann" {...field} />
              </FormControl>
              <FormDescription>Just to display your name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="grid gap-1">
              <FormLabel>Profile image</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    className="w-full"
                    onChange={async (e) =>
                      field.onChange(await handleImageChange(e))
                    }
                  />
                  {field.value && (
                    <X
                      className="cursor-pointer"
                      onClick={() => {
                        field.onChange('');
                      }}
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={loading} type="submit">
          {loading ? (
            <Spinner className="text-white dark:text-black mr-2 h-4 w-4" />
          ) : null}
          Save changes
        </Button>
      </form>
    </Form>
  );
}

const changeEmailSchema = z.object({
  email: z.string().email(),
});

export function ChangeEmail({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof changeEmailSchema>>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      email,
    },
  });

  async function onSubmit(values: z.infer<typeof changeEmailSchema>) {
    setLoading(true);
    const { error } = await changeEmail({
      newEmail: values.email,
    });
    setLoading(false);

    if (error) {
      toast.error('Failed to change email', {
        description: error.message,
      });
    }

    toast.success('Confirm new email', {
      description:
        'In order to complete this action. Verify your new email by clicking on the link in your verification mail',
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grid gap-1">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="max@mustermann.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit">
          {loading ? (
            <Spinner className="text-white dark:text-black mr-2 h-4 w-4" />
          ) : null}
          Change email
        </Button>
      </form>
    </Form>
  );
}

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(8),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    revokeSessions: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: '',
      revokeSessions: true,
    },
  });

  async function onSubmit(values: z.infer<typeof changePasswordSchema>) {
    setLoading(true);
    const { error } = await changePassword({
      newPassword: values.password,
      currentPassword: values.oldPassword,
      revokeOtherSessions: values.revokeSessions,
    });
    setLoading(false);

    if (error) {
      toast.error('Failed to change the password', {
        description: error.message,
      });
    }

    toast.success('Successfully changed the password');
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem className="grid gap-1">
              <FormLabel>Old Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
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
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="grid gap-1">
              <FormLabel>Confirm new Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="revokeSessions"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox disabled={field.disabled} onChange={field.onChange} />
              </FormControl>
              <FormLabel>Revoke all other sessions</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={loading} type="submit">
          {loading ? (
            <Spinner className="text-white dark:text-black mr-2 h-4 w-4" />
          ) : null}
          Change password
        </Button>
      </form>
    </Form>
  );
}

export function AddPasskey({ existingPasskey }: { existingPasskey: boolean }) {
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    await passkey.addPasskey();
    setLoading(false);
  }
  return (
    <Button
      disabled={existingPasskey || loading}
      onClick={async () => submit()}>
      {loading ? (
        <Spinner className="text-white dark:text-black mr-2 h-4 w-4" />
      ) : (
        <Key className="mr-2 h-4 w-4" />
      )}
      Add Passkey
    </Button>
  );
}

export function DeleteAccount() {
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setLoading(true);
    const { error } = await deleteUser();
    setLoading(false);

    if (error) {
      toast.error('Failed to delete account', {
        description: error.message,
      });
    }

    toast.success('Account deleted');
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash className="mr-2 h-4 w-4" />
          Delete account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your account? This cant be reversed.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="destructive" disabled={loading} onClick={onSubmit}>
            {loading ? <Spinner className="text-white mr-2 h-4 w-4" /> : null}
            Delete account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
