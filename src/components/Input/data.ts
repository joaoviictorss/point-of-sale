import type { ComponentProps } from "react";

export interface IInputProps extends ComponentProps<"input"> {
  label?: string;
  error?: string;
}

export interface IInputData extends IInputProps {}
