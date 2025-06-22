import { ResetPasswordEmailTemplate } from "@/components/EmailTemplates/reset-password-template";
import { Resend } from "resend";

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
      console.error("Erro do Resend:", error);
      throw new Error(`Falha ao enviar email: ${error.message}`);
    }

    if (!data) {
      throw new Error("Resend retornou dados vazios");
    }

    console.log("Email enviado com sucesso:", data);
    return data;
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    throw error;
  }
};
