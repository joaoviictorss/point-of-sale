import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { Trash2, X } from 'lucide-react';
import Image from 'next/image';
import type { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';
import { Input } from '@/components/input';
import { Button } from '@/components/Shadcn/button';
import { cn } from '@/lib/utils';
import { formatFileSize, getFileIcon } from '@/utils/constants';
import type { FileWithPreview } from '../data';

interface FileInputLayoutProps {
  files: FileWithPreview[];
  getRootProps: <T extends DropzoneRootProps = DropzoneRootProps>(
    props?: T
  ) => T;
  getInputProps: () => DropzoneInputProps;
  isDragActive: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  onRemoveFile: (fileId: string) => void;
  onClear: () => void;
}

export const FileInputLayout = ({
  files,
  getRootProps,
  getInputProps,
  isDragActive,
  disabled = false,
  className,
  error,
  onRemoveFile,
  onClear,
}: FileInputLayoutProps) => {
  const rootProps = getRootProps();
  const inputProps = getInputProps();

  return (
    <div className={cn('flex flex-col', className)}>
      <Input
        className="hidden"
        disabled={disabled}
        id="input-file"
        multiple
        type="file"
        {...inputProps}
      />

      <div className="flex flex-col gap-4">
        <button
          {...rootProps}
          className={cn(
            'group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300',
            isDragActive
              ? 'scale-[1.02] border-primary bg-gradient-to-br from-primary/15 to-primary/5 shadow-lg shadow-primary/20'
              : 'border-border bg-gradient-to-br from-background to-muted/20 hover:border-primary hover:bg-gradient-to-br hover:from-primary/10 hover:to-primary/5 hover:shadow-md',
            disabled && 'cursor-not-allowed opacity-50',
            error && 'border-destructive'
          )}
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            document.getElementById('input-file')?.click();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              document.getElementById('input-file')?.click();
            }
          }}
          tabIndex={0}
          type="button"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-10" />

          <div className="relative flex flex-col items-center gap-4">
            <div
              className={cn(
                'flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 transition-all duration-300'
              )}
            >
              <ArrowUpTrayIcon
                className={cn(
                  'h-8 w-8 text-primary transition-all duration-300'
                )}
              />
            </div>
            <div className="space-y-2">
              <p className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text font-semibold text-lg text-transparent">
                {isDragActive
                  ? 'Solte os arquivos aqui'
                  : 'Arraste e solte seus arquivos'}
              </p>
              <p className="text-muted-foreground text-sm transition-colors group-hover:text-foreground/60">
                ou clique para selecionar
              </p>
            </div>
          </div>
        </button>

        {error && <p className="text-destructive text-sm">{error}</p>}

        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-semibold text-base text-foreground">
                <div className="h-1 w-1 rounded-full bg-primary" />
                Arquivos ({files.length})
              </span>
              <div className="flex items-center gap-2">
                <Button
                  disabled={files.length === 0 || disabled}
                  onClick={onClear}
                  type="button"
                  variant="outline"
                >
                  <Trash2 size={20} />
                  Remover tudo
                </Button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {files.map((file) => {
                const Icon = getFileIcon(file.file.type);

                return (
                  <div
                    className="space-y-3 rounded-lg border border-border bg-card p-4 transition-shadow duration-200 hover:shadow-md"
                    key={file.id}
                  >
                    <div className="flex items-start gap-3">
                      {/* Preview or Icon */}
                      <div className="flex-shrink-0">
                        {file.preview ? (
                          <Image
                            alt={file.file.name}
                            className="h-14 w-14 rounded-md border border-border object-cover"
                            height={56}
                            src={file.preview}
                            width={56}
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-md border border-border bg-muted">
                            <Icon className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      {/* File Info */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-foreground text-sm">
                          {file.file.name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {formatFileSize(file.file.size)}
                        </p>
                      </div>
                      {/* Remove Button */}
                      <div className="flex items-center gap-1">
                        <Button
                          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                          disabled={disabled}
                          onClick={() => onRemoveFile(file.id)}
                          size="icon"
                          variant="ghost"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
