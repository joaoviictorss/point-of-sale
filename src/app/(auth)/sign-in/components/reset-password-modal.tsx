import { ClockIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Input, Modal } from "@/components";

import type { UseDialogReturn } from "@/hooks/use-dialog";
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
  };

  const onSubmit = async (data: ResetPasswordSchema) => {
    try {
      setIsSubmitting(true);

      await requestPasswordReset(data.email);

      setModalState("success");
    } catch {
      toast.error(
        "Pedido de redefinição de senha já foi enviado recentemente. Aguarde e tente novamente mais tarde."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTryAgain = () => {
    setModalState("form");
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
              <div className="flex size-20 items-center justify-center rounded-full bg-success/10 text-success">
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
          description:
            "Você ja fez um pedido de recuperação de senha. Aguarde alguns minutos antes de tentar novamente.",
          content: (
            <div className="mb-4 flex flex-col items-center justify-center space-y-4">
              <div className="flex size-20 items-center justify-center rounded-full bg-error/10 text-error">
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
                disabled={isSubmitting}
                error={errors.email?.message}
                id="email"
                label="E-mail"
                placeholder="Digite seu e-mail"
                type="email"
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
      actions={actions}
      description={description}
      headerClassName="w-full flex"
      onClose={onClose}
      onOpenChange={setOpen}
      open={open}
      size="md"
      title={title}
    >
      {content}
    </Modal>
  );
};
