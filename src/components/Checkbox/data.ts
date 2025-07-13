import type { ComponentProps } from "react";
import type { Checkbox as ShadCheckbox } from "@/components/Shadcn/checkbox";

export interface ICheckboxProps extends ComponentProps<typeof ShadCheckbox> {
  label?: string;
}

export interface ICheckboxData extends ICheckboxProps {}
