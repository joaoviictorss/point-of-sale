import type { ChangeEvent, ComponentProps, DragEvent, ReactNode } from "react";

export interface FileWithProgress {
  id: string;
  file: File;
  progress: number;
  uploaded: boolean;
  preview?: string;
}

export interface IFileInputProps extends ComponentProps<"input"> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  files: FileWithProgress[];
  onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (id: string) => void;
  onUpload: () => void;
  onClear: () => void;
  uploading?: boolean;
  disabled?: boolean;
  isDragging?: boolean;
  onDragEnter?: (e: DragEvent) => void;
  onDragLeave?: (e: DragEvent) => void;
  onDragOver?: (e: DragEvent) => void;
  onDrop?: (e: DragEvent) => void;
}

export interface IFileInputData extends IFileInputProps {}
