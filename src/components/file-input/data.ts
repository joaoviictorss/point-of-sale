import type { RefObject } from 'react';
import type { FileWithPath } from 'react-dropzone';

export interface FileWithPreview {
  id: string;
  file: FileWithPath;
  preview?: string;
}

export type FileInputVariant = 'default' | 'compact';

export interface FileInputProps {
  files: FileWithPreview[];
  setFiles: (files: FileWithPreview[]) => void;
  disabled?: boolean;
  className?: string;
  error?: string;
  accept?: {
    [key: string]: string[];
  };
  variant?: FileInputVariant;
  openRef?: RefObject<(() => void) | null>;
  hint?: string;
}
