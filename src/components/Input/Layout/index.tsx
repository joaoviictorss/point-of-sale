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
  error,
  ...rest
}: IInputData) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <Label
          htmlFor={id}
          className={`${error && "text-error"} flex flex-row gap-1`}
        >
          {label}
          {required && <span className="text-error">*</span>}
        </Label>
      )}

      <ShadInput
        id={id}
        placeholder={placeholder}
        className={cn(`${error && "border-error"}`, className)}
        {...rest}
      />

      <span
        className={`h-0 overflow-hidden transition-all duration-150 ${error && "h-[1rem]"}`}
      >
        <div
          className={`opacity-0 text-xs ${error && "text-error opacity-100"}`}
        >
          {error}
        </div>
      </span>
    </div>
  );
};
