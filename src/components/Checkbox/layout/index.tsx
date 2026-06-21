import { Checkbox as ShadCheckbox } from '@/components/shadcn/checkbox';
import { Label } from '@/components/shadcn/label';
import { cn } from '@/lib/utils';
import type { ICheckboxData } from '../data';

export const Checkbox = ({ id, label, className, ...rest }: ICheckboxData) => {
  return (
    <div className="flex items-center gap-1">
      <ShadCheckbox className={cn(className)} id={id} {...rest} />
      {label && (
        <Label className="cursor-pointer" htmlFor={id}>
          {label}
        </Label>
      )}
    </div>
  );
};
