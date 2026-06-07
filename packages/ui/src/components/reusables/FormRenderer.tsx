import { useForm } from "react-hook-form";
import { Form } from "../form";
import FormInput from "./from-input";

interface FieldDef {
  name: string;
  label?: string;
  type?: string;
}

interface Props {
  fields: FieldDef[];
  onSubmit: (data: Record<string, unknown>) => void;
}

export default function DynamicForm({ fields, onSubmit }: Props) {
  const form = useForm();
  const { handleSubmit } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Form {...form}>
        {fields?.map((f) => (
          <FormInput
            key={f.name}
            form={form}
            name={f.name}
            label={f.label}
            input={{ placeholder: "hello" }}
          />
        ))}
      </Form>

      <button type="submit">Submit</button>
    </form>
  );
}
