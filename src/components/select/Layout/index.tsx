import { Label } from "@/components/Shadcn/label";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select as ShadSelect,
} from "@/components/Shadcn/select";
import { cn } from "@/lib/utils";
import type { ISelectData } from "../data";

export const Select = ({
  id,
  placeholder,
  required,
  label,
  className,
  error,
  options,
  value,
  onValueChange,
  disabled,
  ...rest
}: ISelectData) => {
  return (
    <div className="flex flex-col items-start">
      {label && (
        <Label
          className={`${error && "text-error"} mb-1 flex flex-row gap-1`}
          htmlFor={id}
        >
          {label}
          {required && <span className="text-error">*</span>}
        </Label>
      )}

      <div className="relative w-full">
        <ShadSelect
          disabled={disabled}
          onValueChange={onValueChange}
          value={value}
          {...rest}
        >
          <SelectTrigger
            className={cn("w-full", error && "border-error", className)}
            id={id}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </ShadSelect>
      </div>

      <span
        className={`h-0 overflow-hidden transition-all duration-150 ${error && "mt-1 h-[1rem]"}`}
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
