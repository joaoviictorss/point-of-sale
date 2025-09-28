import { Resend } from "resend";
import { ResetPasswordEmailTemplate } from "@/components/email-templates/reset-password-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export const requestPasswordReset = async (
  email: string,
  resetToken: string,
  firstName?: string
) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [email],
      subject: "Recuperação de Senha",
      react: ResetPasswordEmailTemplate({
        firstName,
        resetPasswordUrl: resetUrl,
      }) as React.ReactElement,
    });

    if (error) {
      throw new Error(`Falha ao enviar email: ${error.message}`);
    }

    if (!data) {
      throw new Error("Resend retornou dados vazios");
    }

    return data;
  } catch (error) {
    throw new Error(`Falha ao enviar email: ${error}`);
  }
};
