import { Label } from "@/components/Shadcn/label";
import { IInputData } from "../data";
import { Input as ShadInput } from "@/components/Shadcn/input";
import { cn } from "@/lib/utils";

export const Input = ({
  id,
  placeholder,
  required,
  label,
  className,
  ...rest
}: IInputData) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <Label htmlFor={id}>{label}</Label>}

      <ShadInput
        id={id}
        placeholder={placeholder}
        className={cn("", className)}
        {...rest}
      />
    </div>
  );
};
