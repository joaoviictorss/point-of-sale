import type { ISelectProps } from './data';
import { Select as Layout } from './layout';

export const Select = (props: ISelectProps) => {
  const layoutProps = {
    ...props,
  };

  return <Layout {...layoutProps} />;
};
