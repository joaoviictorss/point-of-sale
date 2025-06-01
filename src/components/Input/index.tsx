import { IInputProps } from "./data";
import { Input as Layout } from "./Layout";

export const Input = (props: IInputProps) => {
  const layoutProps = {
    ...props,
  };

  return <Layout {...layoutProps} />;
};
