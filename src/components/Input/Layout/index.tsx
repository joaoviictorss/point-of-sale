import { Input as ShadInput } from "@/components/Shadcn/input";
import { Label } from "@/components/Shadcn/label";
import { cn } from "@/lib/utils";
import type { IInputData } from "../data";

export const Input = ({
  id,
  placeholder,
  required,
  label,
  className,
  error,
  ...rest
}: IInputData) => {
  return (
    <div className="flex flex-col items-start gap-1">
      {label && (
        <Label
          className={`${error && "text-error"} flex flex-row gap-1`}
          htmlFor={id}
        >
          {label}
          {required && <span className="text-error">*</span>}
        </Label>
      )}

      <ShadInput
        className={cn(`${error && "border-error"}`, className)}
        id={id}
        placeholder={placeholder}
        {...rest}
      />

      <span
        className={`h-0 overflow-hidden transition-all duration-150 ${error && "h-[1rem]"}`}
      >
        <div
          className={`text-xs opacity-0 ${error && "text-error opacity-100"}`}
        >
          {error}
        </div>
      </span>
    </div>
  );
};
