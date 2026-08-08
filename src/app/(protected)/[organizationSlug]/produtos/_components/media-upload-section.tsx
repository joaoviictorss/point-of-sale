'use client';

import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { FileInput } from '@/components';
import type { FileWithPreview } from '@/components/file-input';
import { Button } from '@/components/shadcn';
import { useUploadMedia } from '@/hooks/media/use-medias';
import type {
  ProductFormInput,
  ProductFormSchema,
} from '@/services/product/schemas';

type UploadedMedia = { id: string; url: string };

type PendingFile = {
  localId: string;
  file: File;
  preview: string;
  status: 'uploading' | 'error';
  error?: string;
};

interface MediaUploadSectionProps {
  form: UseFormReturn<ProductFormInput, unknown, ProductFormSchema>;
  disabled?: boolean;
  initialMedias?: UploadedMedia[];
  onCoverChange?: (url: string | null) => void;
}

export function MediaUploadSection({
  form,
  disabled,
  initialMedias = [],
  onCoverChange,
}: MediaUploadSectionProps) {
  const { upload } = useUploadMedia();
  const [uploadedMedias, setUploadedMedias] =
    useState<UploadedMedia[]>(initialMedias);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const openFileDialogRef = useRef<(() => void) | null>(null);

  const syncFormMedias = useCallback(
    (medias: UploadedMedia[]) => {
      form.setValue(
        'medias',
        medias.map((m) => m.id)
      );
    },
    [form]
  );

  useEffect(() => {
    onCoverChange?.(uploadedMedias[0]?.url ?? null);
  }, [uploadedMedias, onCoverChange]);

  const handleFilesChange = useCallback(
    async (files: FileWithPreview[]) => {
      const newFiles = files.filter(
        (f) => !pendingFiles.some((p) => p.localId === f.id)
      );

      if (newFiles.length === 0) {
        return;
      }

      const newPending: PendingFile[] = newFiles.map((f) => ({
        localId: f.id,
        file: f.file as File,
        preview: f.preview ?? '',
        status: 'uploading',
      }));

      setPendingFiles((prev) => [...prev, ...newPending]);

      await Promise.all(
        newPending.map(async (pending) => {
          try {
            const result = await upload(pending.file);

            setUploadedMedias((prev) => {
              const updated = [...prev, { id: result.id, url: result.url }];
              syncFormMedias(updated);
              return updated;
            });

            setPendingFiles((prev) =>
              prev.filter((p) => p.localId !== pending.localId)
            );

            if (pending.preview) {
              URL.revokeObjectURL(pending.preview);
            }
          } catch (err) {
            const message =
              err instanceof Error ? err.message : 'Erro ao fazer upload';
            setPendingFiles((prev) =>
              prev.map((p) =>
                p.localId === pending.localId
                  ? { ...p, status: 'error', error: message }
                  : p
              )
            );
          }
        })
      );
    },
    [pendingFiles, upload, syncFormMedias]
  );

  const handleRemoveUploaded = useCallback(
    (id: string) => {
      setUploadedMedias((prev) => {
        const updated = prev.filter((m) => m.id !== id);
        syncFormMedias(updated);
        return updated;
      });
    },
    [syncFormMedias]
  );

  const handleRemovePending = useCallback((localId: string) => {
    setPendingFiles((prev) => {
      const file = prev.find((p) => p.localId === localId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((p) => p.localId !== localId);
    });
  }, []);

  const isUploading = pendingFiles.some((p) => p.status === 'uploading');

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {uploadedMedias.map((media) => (
          <div
            className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
            key={media.id}
          >
            <Image
              alt="Mídia do produto"
              className="h-full w-full object-cover"
              height={120}
              src={media.url}
              width={120}
            />
            <button
              className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
              disabled={disabled}
              onClick={() => handleRemoveUploaded(media.id)}
              type="button"
            >
              <XMarkIcon className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
        ))}

        {pendingFiles.map((pending) => (
          <div
            className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
            key={pending.localId}
          >
            {pending.preview && (
              <Image
                alt="Upload em andamento"
                className="h-full w-full object-cover"
                height={120}
                src={pending.preview}
                width={120}
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              {pending.status === 'uploading' ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <div className="flex flex-col items-center gap-1 px-1">
                  <span className="text-center text-white text-xs">Erro</span>
                  <Button
                    className="h-6 px-2 text-xs"
                    onClick={() => handleRemovePending(pending.localId)}
                    size="sm"
                    type="button"
                    variant="destructive"
                  >
                    Remover
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}

        <button
          className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-gray-300 border-dashed bg-gray-50 text-primary transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled || isUploading}
          onClick={() => openFileDialogRef.current?.()}
          type="button"
        >
          <PlusIcon className="size-[18px]" />
          <span className="text-[11px] text-text-muted">Adicionar</span>
        </button>
      </div>

      <FileInput
        accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
        disabled={disabled || isUploading}
        files={[]}
        hint="PNG, JPG ou WEBP até 5 MB cada"
        openRef={openFileDialogRef}
        setFiles={(files) => handleFilesChange(files)}
        variant="compact"
      />
    </div>
  );
}
