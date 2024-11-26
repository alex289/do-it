import ChangeEmail from '@/email/change-email';
import ResetPassword from '@/email/reset-password';
import VerifyEmail from '@/email/verify-email';
import { render } from '@react-email/components';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendForgotPasswordEmail(
  email: string,
  username: string,
  url: string,
) {
  const emailHtml = await render(
    <ResetPassword
      url={url}
      username={username}
      baseUrl={process.env.BETTER_AUTH_URL!}
    />,
  );

  const options = {
    from: `"Do-It" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Do-It - Change your password',
    html: emailHtml,
  };

  await transporter.sendMail(options);
}

export async function verifyEmail(
  email: string,
  username: string,
  url: string,
) {
  const emailHtml = await render(
    <VerifyEmail
      url={url}
      username={username}
      baseUrl={process.env.BETTER_AUTH_URL!}
    />,
  );

  const options = {
    from: `"Do-It" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Do-It - Verify your email',
    html: emailHtml,
  };

  await transporter.sendMail(options);
}

export async function changeEmail(
  email: string,
  username: string,
  url: string,
) {
  const emailHtml = await render(
    <ChangeEmail
      url={url}
      username={username}
      baseUrl={process.env.BETTER_AUTH_URL!}
    />,
  );

  const options = {
    from: `"Do-It" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Do-It - Verify your email',
    html: emailHtml,
  };

  await transporter.sendMail(options);
}
