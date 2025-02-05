import { FC, JSX } from "react";
import { useForm, useWatch } from "react-hook-form";

type FormProps = {
  children: (props: { form: any; formData: any }) => JSX.Element;
};

const Form: FC<FormProps> = ({ children }) => {
  const form = useForm();
  const { values: formData } = useWatch();

  return children({ form, formData });
};

export default Form;
