import { ComponentProps } from "react";

export interface ICheckboxProps extends ComponentProps<"button"> {
  label?: string;
}

export interface ICheckboxData extends ICheckboxProps {}
