"use client";

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      position="top-center"
      icons={{
        success: <CheckCircleIcon className="text-success" />,
        warning: <ExclamationTriangleIcon className="text-warning" />,
        error: <ExclamationCircleIcon className="text-error" />,
      }}
      toastOptions={{
        classNames: {},
      }}
      {...props}
    />
  );
};

export { Toaster };
