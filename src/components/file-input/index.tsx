"use client";

import axios from "axios";
import {
  FileAudio,
  FileIcon,
  FileImage,
  FileText,
  FileVideo,
} from "lucide-react";
import { type ChangeEvent, type DragEvent, useRef, useState } from "react";
import type { FileWithProgress, IFileInputData } from "./data";
import { FileInput as Layout } from "./Layout";

export const FileUpload = (props: Partial<IFileInputData>) => {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) {
      return;
    }

    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const processFiles = (newFiles: File[]) => {
    const filesWithPreview: FileWithProgress[] = newFiles.map((file) => {
      const fileWithPreview: FileWithProgress = {
        file,
        progress: 0,
        uploaded: false,
        id: file.name,
      };

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const preview = e.target?.result as string;
          setFiles((prev) =>
            prev.map((f) => (f.file === file ? { ...f, preview } : f))
          );
        };
        reader.readAsDataURL(file);
      }

      return fileWithPreview;
    });

    setFiles((prev) => [...prev, ...filesWithPreview]);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (files.length === 0 || uploading) {
      return;
    }

    setUploading(true);

    const uploadPromises = files.map(async (fileWithProgress) => {
      const formData = new FormData();
      formData.append("file", fileWithProgress.file);

      try {
        await axios.post("https://httpbin.org/post", formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setFiles((prevFiles) =>
              prevFiles.map((file) =>
                file.id === fileWithProgress.id ? { ...file, progress } : file
              )
            );
          },
        });

        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.id === fileWithProgress.id ? { ...file, uploaded: true } : file
          )
        );
      } catch (error) {
        // Handle error appropriately - could show toast notification
        // For now, we'll just log it
        if (process.env.NODE_ENV === "development") {
          // biome-ignore lint/suspicious/noConsole: Development logging
          console.error("Upload error:", error);
        }
      }
    });

    await Promise.all(uploadPromises);
    setUploading(false);
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  const handleClear = () => {
    setFiles([]);
  };

  const layoutProps: IFileInputData = {
    files,
    onFileSelect: handleFileSelect,
    onRemoveFile: handleRemoveFile,
    onUpload: handleUpload,
    onClear: handleClear,
    uploading,
    disabled: uploading,
    isDragging,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
    ref: inputRef,
    ...props,
  };

  return <Layout {...layoutProps} />;
};

export const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/")) {
    return FileImage;
  }
  if (mimeType.startsWith("video/")) {
    return FileVideo;
  }
  if (mimeType.startsWith("audio/")) {
    return FileAudio;
  }
  if (mimeType === "application/pdf") {
    return FileText;
  }
  return FileIcon;
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) {
    return "0 B";
  }
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
};
