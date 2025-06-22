import { useEffect, useState } from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { EnvelopeIcon, ClockIcon } from "@heroicons/react/24/solid";

import { toast } from "sonner";

import { Input, Modal } from "@/components";

import { UseDialogReturn } from "@/hooks/useDialog";
import { requestPasswordReset } from "@/services/reset-password";

const ResetPasswordSchema = z.object({
  email: z.string().email({ message: "Email inválido" }).trim(),
});

type ResetPasswordSchema = z.infer<typeof ResetPasswordSchema>;

type ModalState = "form" | "success" | "rate-limited";

export const ResetPasswordModal = ({
  dialog: { closeDialog, open, setOpen },
  email,
}: {
  dialog: UseDialogReturn;
  email?: string;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState<ModalState>("form");
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    email?: string;
    retryAfter?: number;
  }>({});

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email,
    },
  });

  const onClose = () => {
    closeDialog();
    reset();
    setModalState("form");
    setRateLimitInfo({});
  };

  const onSubmit = async (data: ResetPasswordSchema) => {
    try {
      setIsSubmitting(true);

      await requestPasswordReset(data.email);

      setModalState("success");
    } catch (error: any) {
      if (error.status === 429) {
        setModalState("rate-limited");
        setRateLimitInfo({
          email: data.email,
          retryAfter: error.retryAfter || 5,
        });
        toast.error(
          "Pedido de redefinição de senha já foi enviado recentemente. Aguarde e tente novamente mais tarde."
        );
      } else {
        toast.error("Erro ao enviar email de recuperação, tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTryAgain = () => {
    setModalState("form");
    setRateLimitInfo({});
  };

  const getModalContent = () => {
    switch (modalState) {
      case "success":
        return {
          title: "Abra seu email",
          description:
            "Verifique seu e-mail para redefinir sua senha. Se não encontrar o email, verifique sua caixa de spam.",
          content: (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center justify-center size-20 rounded-full bg-success/10 text-success">
                <EnvelopeIcon className="size-10" />
              </div>
            </div>
          ),
          actions: [
            {
              label: "Fechar",
              onClick: onClose,
              variant: "default" as const,
              disabled: false,
            },
          ],
          subtitleClassName: "text-center",
          headerClassName: "text-center w-full flex items-center",
        };

      case "rate-limited":
        return {
          title: "Muitas tentativas",
          description: `Você ja fez um pedido de recuperação de senha. Aguarde ${rateLimitInfo.retryAfter} minutos antes de tentar novamente.`,
          content: (
            <div className="flex flex-col items-center justify-center space-y-4 mb-4">
              <div className="flex items-center justify-center size-20 rounded-full bg-error/10 text-error">
                <ClockIcon className="size-10" />
              </div>
            </div>
          ),
          actions: [
            {
              label: "Fechar",
              onClick: onClose,
              variant: "outline" as const,
              disabled: false,
            },
            {
              label: "Tentar novamente",
              onClick: handleTryAgain,
              variant: "default" as const,
              disabled: false,
            },
          ],
        };

      default:
        return {
          title: "Esqueceu a senha?",
          description:
            "Digite seu e-mail e te enviaremos as instruções para redefinir a senha.",
          content: (
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="E-mail"
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
                error={errors.email?.message}
                disabled={isSubmitting}
                {...register("email")}
              />
            </form>
          ),
          actions: [
            {
              label: "Fechar",
              onClick: onClose,
              variant: "outline" as const,
              disabled: isSubmitting,
            },
            {
              label: isSubmitting ? "Enviando..." : "Enviar",
              onClick: () => {
                handleSubmit(onSubmit)();
              },
              variant: "default" as const,
              loading: isSubmitting,
              disabled: isSubmitting,
            },
          ],
        };
    }
  };

  useEffect(() => {
    reset({ email });
  }, [email, reset]);

  const { title, description, content, actions } = getModalContent();

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title={title}
      description={description}
      size="md"
      actions={actions}
      onClose={onClose}
      headerClassName="w-full flex"
    >
      {content}
    </Modal>
  );
};
