import { MdCode, MdRefresh, MdCheckCircle, MdCopyAll } from "react-icons/md";
import { ActionButton } from "../shared/actionButton";
import { useSelectedForm } from "../contexts/selectedFormProvider";

export function HoverPanelActionButtons() {
  const { formContext, formName } = useSelectedForm()!;
  const values = formContext.getValues();

  const formState = formContext.formState;
  const errors = formState.errors;
  const isValid = formState.isValid;
  const isDirty = formState.isDirty;
  const isSubmitting = formState.isSubmitting;
  const isSubmitted = formState.isSubmitted;
  const submitCount = formState.submitCount;

  return (
    <div className="flex flex-wrap gap-2 pt-2">
      <ActionButton
        onClick={() => {
          console.log(`=== Form: ${formName} ===`);
          console.log("Values:", formContext.getValues());
          console.log("Errors:", errors);
          console.log("Form State:", {
            isValid,
            isDirty,
            isSubmitting,
            isSubmitted,
            submitCount,
          });
        }}
        label="Log"
        icon={MdCode}
        variant="outline"
      />

      <ActionButton
        onClick={() => formContext.reset()}
        label="Reset"
        icon={MdRefresh}
        variant="danger"
      />

      <ActionButton
        onClick={() => formContext.trigger()}
        label="Validate"
        icon={MdCheckCircle}
        variant="primary"
      />

      <ActionButton
        onClick={() => {
          const sampleData = Object.keys(values).reduce((acc, key) => {
            const currentValue = values[key];
            if (typeof currentValue === "string") acc[key] = "Sample text";
            else if (typeof currentValue === "number") acc[key] = 123;
            else if (typeof currentValue === "boolean") acc[key] = true;
            else if (Array.isArray(currentValue)) acc[key] = [];
            else if (currentValue && typeof currentValue === "object")
              acc[key] = {};
            else acc[key] = null;
            return acc;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          }, {} as any);

          Object.keys(sampleData).forEach((key) => {
            formContext.setValue(key, sampleData[key]);
          });
        }}
        label="Sample Data"
        icon={MdCopyAll}
        variant="success"
      />
    </div>
  );
}
