"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Input } from "@/components/input";
import { Modal } from "@/components/modal";
import { Button } from "@/components/Shadcn/button";
import { useOrganizationModal } from "@/hooks/use-organization-modal";
import { createOrganization } from "@/services/organization";

const formSchema = z.object({
  name: z.string().min(1, "O nome da organização é obrigatório"),
});

export const OrganizationModal = ({ canClose }: { canClose: boolean }) => {
  const organizationModal = useOrganizationModal();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const data = await createOrganization(values);

      window.location.assign(`/${data.slug}/vendas`);
    } catch {
      toast.error("Algo deu errado :(");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      description="Adicionar nova organização para gerenciar suas vendas"
      onOpenChange={
        canClose
          ? organizationModal.onClose
          : () => {
              return;
            }
      }
      open={organizationModal.isOpen}
      title="Criar organização"
    >
      <div className="space-y-4 py-2 pb-4">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <Input
                {...form.register("name")}
                disabled={loading}
                error={form.formState.errors.name?.message}
                label="Nome da organização"
                placeholder="Minha Empresa"
                required
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-end space-x-2 pt-6">
            <Button
              disabled={loading || !canClose}
              onClick={organizationModal.onClose}
              type="button"
              variant="outline"
            >
              Cancelar
            </Button>
            <Button disabled={loading} type="submit">
              Continuar
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
