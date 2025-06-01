import { Label } from "@/components/Shadcn/label";
import { ICheckboxData } from "../data";
import { Checkbox as ShadCheckbox } from "@/components/Shadcn/checkbox";
import { cn } from "@/lib/utils";

export const Checkbox = ({ id, label, className, ...rest }: ICheckboxData) => {
  return (
    <div className="flex items-center gap-1">
      <ShadCheckbox id={id} className={cn(className)} {...rest} />
      {label && (
        <Label htmlFor={id} className="cursor-pointer">
          {label}
        </Label>
      )}
    </div>
  );
};
