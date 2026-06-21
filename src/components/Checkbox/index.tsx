import type { ICheckboxProps } from './data';
import { Checkbox as Layout } from './layout';

export const Checkbox = (props: ICheckboxProps) => {
  const layoutProps = {
    ...props,
  };

  return <Layout {...layoutProps} />;
};
