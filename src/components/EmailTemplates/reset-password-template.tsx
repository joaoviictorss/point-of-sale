import * as React from "react";

interface IResetPasswordEmailTemplateProps {
  firstName?: string;
  resetPasswordUrl: string;
  supportEmail?: string;
  companyName?: string;
}

export const ResetPasswordEmailTemplate = ({
  firstName,
  resetPasswordUrl,
  supportEmail = "suporte@vns.com",
  companyName = "VNS - Admin",
}: IResetPasswordEmailTemplateProps) => {
  const currentYear = new Date().getFullYear();
  const userName = firstName?.trim() || "Usuário";
  const logoUrl = process.env.NEXT_PUBLIC_APP_URL + "/logo.png";

  const styles = {
    container: {
      maxWidth: "500px",
      margin: "0",
      backgroundColor: "#ffffff",
      border: "1px solid #e5e7eb",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      overflow: "hidden",
      fontFamily: "Arial, sans-serif",
    },
    header: {
      borderBottom: "1px solid #e5e7eb",
      padding: "32px",
      backgroundColor: "#f9fafb",
      textAlign: "center" as const,
    },
    logoContainer: {
      display: "inline-block",
      padding: "8px",
      backgroundColor: "#ffffff",
      borderRadius: "50%",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      marginBottom: "8px",
    },
    logo: {
      width: "48px",
      height: "48px",
      borderRadius: "4px",
      display: "block",
    },
    companyName: {
      color: "#1f2937",
      fontWeight: "bold",
      fontSize: "18px",
      letterSpacing: "0.025em",
      margin: "4px 0",
    },
    emailTitle: {
      color: "#4b5563",
      fontWeight: "600",
      fontSize: "20px",
      margin: "4px 0 0 0",
    },
    main: {
      padding: "32px",
    },
    greeting: {
      color: "#1f2937",
      fontWeight: "500",
      fontSize: "18px",
      marginBottom: "16px",
    },
    content: {
      color: "#4b5563",
      fontSize: "14px",
      lineHeight: "1.6",
      marginBottom: "24px",
    },
    paragraph: {
      margin: "12px 0",
    },
    buttonContainer: {
      textAlign: "center" as const,
      width: "436px",
    },
    button: {
      display: "inline-block",
      padding: "12px 24px",
      backgroundColor: "#3B82F6",
      color: "#ffffff",
      textDecoration: "none",
      borderRadius: "6px",
      fontWeight: "500",
      fontSize: "16px",
      textAlign: "center" as const,
      border: "none",
      cursor: "pointer",
    },
    footer: {
      backgroundColor: "#f9fafb",
      borderTop: "1px solid #f3f4f6",
      padding: "24px",
      textAlign: "center" as const,
      fontSize: "12px",
      color: "#6b7280",
    },
    footerParagraph: {
      margin: "8px 0",
    },
    supportLink: {
      color: "#2563eb",
      textDecoration: "none",
    },
    copyright: {
      color: "#9ca3af",
    },
  };

  return (
    <div
      style={styles.container}
      role="main"
      aria-label="Email de redefinição de senha"
    >
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img
            src={logoUrl}
            alt={`Logo da ${companyName}`}
            style={styles.logo}
          />
        </div>
        <h1 style={styles.companyName}>{companyName}</h1>
        <h2 style={styles.emailTitle}>Redefinir Senha</h2>
      </header>

      {/* Main Content */}
      <div style={styles.main}>
        <p style={styles.greeting}>Olá, {userName}!</p>

        <div style={styles.content}>
          <p style={styles.paragraph}>
            Precisa resetar sua senha? Sem problemas! Apenas clique no botão
            abaixo e você será redirecionado para um link para resetar sua
            senha. Se você não solicitou isso, por favor ignore este email.
          </p>
        </div>

        {/* Call to Action */}
        <div style={styles.buttonContainer}>
          <a
            href={resetPasswordUrl}
            style={styles.button}
            role="button"
            aria-label="Redefinir minha senha"
          >
            Redefinir Minha Senha
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerParagraph}>
          Este é um email automático. Por favor, não responda a esta mensagem.
        </p>
        <p style={styles.footerParagraph}>
          Precisa de ajuda? Entre em contato:{" "}
          <a href={`mailto:${supportEmail}`} style={styles.supportLink}>
            {supportEmail}
          </a>
        </p>
        <p style={{ ...styles.footerParagraph, ...styles.copyright }}>
          © {currentYear} {companyName}. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};
