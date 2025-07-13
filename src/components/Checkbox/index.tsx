import type { ICheckboxProps } from "./data";
import { Checkbox as Layout } from "./Layout";

export const Checkbox = (props: ICheckboxProps) => {
  const layoutProps = {
    ...props,
  };

  return <Layout {...layoutProps} />;
};
