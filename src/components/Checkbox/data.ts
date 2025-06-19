import { ComponentProps } from "react";
import { Checkbox as ShadCheckbox } from "@/components/Shadcn/checkbox";

export interface ICheckboxProps extends ComponentProps<typeof ShadCheckbox> {
  label?: string;
}

export interface ICheckboxData extends ICheckboxProps {}
