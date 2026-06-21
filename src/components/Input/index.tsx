import type { IInputProps } from "./data";
import { Input as Layout } from "./layout";

export const Input = (props: IInputProps) => {
  const layoutProps = {
    ...props,
  };

  return <Layout {...layoutProps} />;
};
