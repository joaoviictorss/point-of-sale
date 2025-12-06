'use client';

import { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import type { FileInputProps, FileWithPreview } from './data';
import { FileInputLayout } from './Layout';

export const FileInput = ({
  files,
  setFiles,
  disabled = false,
  className,
  error,
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg'],
    'video/*': ['.mp4', '.mov', '.avi'],
    'audio/*': ['.mp3', '.wav', '.ogg'],
    'application/pdf': ['.pdf'],
  },
}: FileInputProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    disabled,
    onDrop: (droppedFiles) => {
      const newFiles: FileWithPreview[] = droppedFiles.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
      }));

      setFiles([...files, ...newFiles]);
    },
  });

  const handleRemoveFile = useCallback(
    (fileId: string) => {
      const fileToRemove = files.find((f) => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      setFiles(files.filter((f) => f.id !== fileId));
    },
    [files, setFiles]
  );

  const handleClear = useCallback(() => {
    for (const file of files) {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    }
    setFiles([]);
  }, [files, setFiles]);

  useEffect(() => {
    return () => {
      for (const file of files) {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      }
    };
  }, [files]);

  return (
    <FileInputLayout
      className={className}
      disabled={disabled}
      error={error}
      files={files}
      getInputProps={getInputProps}
      getRootProps={getRootProps}
      isDragActive={isDragActive}
      onClear={handleClear}
      onRemoveFile={handleRemoveFile}
    />
  );
};

export type { FileInputProps, FileWithPreview } from './data';
