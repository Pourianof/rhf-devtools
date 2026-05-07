import { useWatch } from "react-hook-form";
import { useSelectedForm } from "../../contexts/selectedFormProvider";
import {
  JsonSimpleField,
  SimpleRowProps,
} from "../../jsonTreeViewer/jsonSimpleField";
import {
  ComplexFieldProps,
  JsonComplexField,
} from "../../jsonTreeViewer/jsonComplexField";

export function FormSimpleField(props: SimpleRowProps) {
  const activeForm = useSelectedForm();
  const updateValue = useWatch({
    control: activeForm!.formContext.control,
    name: props.fullPath!,
  });

  function handleEdit(fullPath: string, newValue: string) {
    if (!props.fullPath) return;

    activeForm?.formContext.setValue(props.fullPath, newValue);
  }

  return <JsonSimpleField {...props} value={updateValue} onEdit={handleEdit} />;
}

export function FormComplexField(props: ComplexFieldProps) {
  const value = useWatch({
    control: useSelectedForm()?.formContext.control,
    name: props.fullPath,
  }) as object;

  return <JsonComplexField {...props} value={value} />;
}
