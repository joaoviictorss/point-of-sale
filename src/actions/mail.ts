'use server';

import { Resend } from 'resend';

export async function sendEmail(email: string, subject: string, body: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject,
      html: body,
    });

    return data;
  } catch (error) {
    return { error };
  }
}
