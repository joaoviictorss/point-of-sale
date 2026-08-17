'use client';

import {
  ArrowLeftIcon,
  ArrowUpTrayIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FileInput } from '@/components';
import type { FileWithPreview } from '@/components/file-input/data';
import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { useOrganization } from '@/contexts/organization-context';
import { useValidateImportRows } from '@/hooks/product/use-products';
import { cn } from '@/lib/utils';
import type { ImportRowResult } from '@/services/product/import-schemas';

const PREVIEW_ROWS = [
  { status: 'valid', nameWidth: '100%' },
  { status: 'valid', nameWidth: '80%' },
  { status: 'invalid', nameWidth: '90%' },
  { status: 'valid', nameWidth: '70%' },
] as const;

function ImportPreviewIllustration() {
  return (
    <div className="relative mt-3 shrink-0">
      <div className="-rotate-3">
        <div className="w-[236px] overflow-hidden rounded-[14px] border border-[#eef1f5] bg-white shadow-[0_22px_50px_-18px_rgba(17,24,39,0.35)]">
          <div className="flex h-[34px] items-center gap-2 border-[#dbe6fb] border-b bg-blue-50 px-3.5">
            <span className="size-2.5 rounded-[3px] bg-primary" />
            <span className="h-[7px] w-[88px] rounded-full bg-[#bcd3fb]" />
          </div>
          <div>
            {PREVIEW_ROWS.map((row, index) => (
              <div
                className={cn(
                  'grid h-9 grid-cols-[22px_1fr_52px_22px] items-center gap-2.5 px-3.5',
                  index < PREVIEW_ROWS.length - 1 && 'border-[#f1f3f7] border-b'
                )}
                key={`${index}-${row.status}`}
              >
                <span className="font-mono text-[#c4c9d4] text-[10px]">
                  {index + 1}
                </span>
                <span
                  className="h-[7px] rounded-full bg-gray-200"
                  style={{ width: row.nameWidth }}
                />
                <span className="h-[7px] w-full rounded-full bg-[#eef1f5]" />
                <span
                  className={cn(
                    'flex size-4 items-center justify-center rounded-full',
                    row.status === 'valid' ? 'bg-green-100' : 'bg-red-100'
                  )}
                >
                  {row.status === 'valid' ? (
                    <CheckIcon
                      className="size-2.5 text-green-600"
                      strokeWidth={3.5}
                    />
                  ) : (
                    <XMarkIcon
                      className="size-2.5 text-red-600"
                      strokeWidth={3.5}
                    />
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="-top-4 -right-4 absolute flex size-11 items-center justify-center rounded-full border-[3px] border-white bg-primary text-white shadow-[0_8px_20px_-4px_rgba(37,99,235,0.55)]">
        <ArrowUpTrayIcon className="size-[21px]" strokeWidth={2.2} />
      </div>
    </div>
  );
}

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPT = {
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
    '.xlsx',
  ],
  'text/csv': ['.csv'],
};

async function parseSpreadsheetFile(
  file: File
): Promise<Record<string, unknown>[]> {
  const XLSX = await import('xlsx');
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    return [];
  }
  const sheet = workbook.Sheets[sheetName];

  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: null,
    raw: false,
  });
}

interface UploadStepProps {
  onValidated: (rows: ImportRowResult[], fileName: string) => void;
}

export function UploadStep({ onValidated }: UploadStepProps) {
  const router = useRouter();
  const { slug: organizationSlug } = useOrganization();
  const validateImportRows = useValidateImportRows();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [error, setError] = useState<string>();
  const [isParsing, setIsParsing] = useState(false);

  const handleFilesChange = async (updated: FileWithPreview[]) => {
    const selected = updated.at(-1);
    setError(undefined);

    if (!selected) {
      setFiles([]);
      return;
    }

    if (selected.file.size > MAX_FILE_SIZE_BYTES) {
      setError(`O arquivo deve ter no máximo ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    setFiles([selected]);
    setIsParsing(true);

    try {
      const rawRows = await parseSpreadsheetFile(selected.file);

      if (rawRows.length === 0) {
        setError('A planilha está vazia ou não tem linhas de dados.');
        setFiles([]);
        setIsParsing(false);
        return;
      }

      const rows = await validateImportRows.mutateAsync({
        organizationSlug,
        rows: rawRows,
      });

      onValidated(rows, selected.file.name);
    } catch {
      setError(
        'Não foi possível ler o arquivo. Verifique se é uma planilha .xlsx ou .csv válida.'
      );
      setFiles([]);
      setIsParsing(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-5 bg-gray-50 p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <Button
          aria-label="Voltar"
          onClick={() => router.push(`/${organizationSlug}/produtos`)}
          size="icon"
          variant="outline"
        >
          <ArrowLeftIcon />
        </Button>
        <h1 className="font-semibold text-foreground text-xl tracking-tight sm:text-2xl">
          Cadastro em lote
        </h1>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 text-center">
          <ImportPreviewIllustration />

          <Badge variant="primary-soft">Importação</Badge>

          <div className="flex flex-col gap-2">
            <h2 className="font-semibold text-2xl text-foreground tracking-tight">
              Cadastre seus produtos em lote
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Envie uma planilha .xlsx ou .csv com seus produtos. O VNS confere
              os dados, mostra o que precisa de ajuste e cadastra tudo de uma
              vez.
            </p>
          </div>

          <a
            className="font-medium text-primary text-sm underline underline-offset-4"
            download
            href="/modelo-produtos.csv"
          >
            Baixar exemplo da planilha
          </a>

          <div className="w-full">
            {isParsing || validateImportRows.isPending ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-border border-dashed p-10">
                <div className="size-8 animate-spin rounded-full border-2 border-primary border-b-transparent" />
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-foreground text-sm">
                    Analisando produtos...
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Estamos validando os dados da sua planilha.
                  </p>
                </div>
              </div>
            ) : (
              <FileInput
                accept={ACCEPT}
                error={error}
                files={files}
                hint={`.xlsx ou .csv · até ${MAX_FILE_SIZE_MB} MB`}
                setFiles={handleFilesChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
