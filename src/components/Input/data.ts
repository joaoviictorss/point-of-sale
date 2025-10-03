import type { ComponentProps, ReactNode } from "react";

export interface IInputProps extends ComponentProps<"input"> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}
export interface IInputData extends IInputProps {}
