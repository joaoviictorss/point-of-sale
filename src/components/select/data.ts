export interface SelectOption {
  value: string;
  label: string;
}

export interface ISelectProps {
  id?: string;
  label?: string;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
}

export interface ISelectData extends ISelectProps {}
