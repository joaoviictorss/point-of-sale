import {
  ChartPieIcon,
  CircleStackIcon,
  ClipboardDocumentListIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import {
  FileAudio,
  FileIcon,
  FileImage,
  FileText,
  FileVideo,
} from "lucide-react";

export const navigationItems = [
  {
    title: "Vendas",
    url: "/vendas",
    headerTitle: "Suas vendas",
    icon: ShoppingBagIcon,
  },
  {
    title: "Produtos",
    url: "/produtos",
    headerTitle: "Seus produtos",
    icon: ClipboardDocumentListIcon,
  },
  {
    title: "Estoque",
    url: "/estoque",
    headerTitle: "Seu estoque",
    icon: CircleStackIcon,
  },
  {
    title: "Relatórios",
    url: "/relatorios",
    headerTitle: "Relatórios",
    icon: ChartPieIcon,
  },
] as const;

export type NavigationItem = (typeof navigationItems)[number];

export const stockUnitOptions = [
  { label: "Unidades", value: "UNITS" },
  { label: "Gramas", value: "GRAMS" },
  { label: "Quilogramas", value: "KILOGRAMS" },
  { label: "Litros", value: "LITERS" },
  { label: "Mililitros", value: "MILLILITERS" },
];

export const productTypeOptions = [
  { label: "Unidade", value: "UNIT" },
  { label: "Peso", value: "WEIGHT" },
  { label: "Volume", value: "VOLUME" },
];

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
