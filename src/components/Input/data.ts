import { ComponentProps } from "react";

export interface IInputProps extends ComponentProps<"input"> {
  label?: string;
}

export interface IInputData extends IInputProps {}
