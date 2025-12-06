import type { ISelectProps } from './data';
import { Select as Layout } from './Layout';

export const Select = (props: ISelectProps) => {
  const layoutProps = {
    ...props,
  };

  return <Layout {...layoutProps} />;
};
