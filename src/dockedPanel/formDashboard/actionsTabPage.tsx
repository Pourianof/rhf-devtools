import { MdCode, MdRefresh, MdCheckCircle, MdCopyAll } from "react-icons/md";
import { ActionButton } from "../../shared/actionButton";
import { useSelectedForm } from "../../contexts/selectedFormProvider";

export function ActionTabPage() {
  const { formContext, formName } = useSelectedForm()!;
  const formState = formContext.formState;
  const errors = formState.errors;
  const isValid = formState.isValid;
  const isDirty = formState.isDirty;
  const isSubmitting = formState.isSubmitting;
  const isSubmitted = formState.isSubmitted;
  const submitCount = formState.submitCount;
  const values = formContext.getValues();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
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
          label="Log to Console"
          icon={MdCode}
          variant="outline"
        />

        <ActionButton
          onClick={() => formContext.reset()}
          label="Reset Form"
          icon={MdRefresh}
          variant="danger"
        />

        <ActionButton
          onClick={() => formContext.trigger()}
          label="Validate All"
          icon={MdCheckCircle}
          variant="primary"
        />

        <ActionButton
          onClick={() => formContext.clearErrors()}
          label="Clear errors"
          icon={MdCheckCircle}
          variant="success"
        />
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3 border border-amber-200 dark:border-amber-900">
        <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2">
          Sample Data
        </h4>
        <p className="text-xs text-amber-600 dark:text-amber-500 mb-3">
          Fill the form with sample data for testing
        </p>
        <ActionButton
          onClick={() => {
            const sampleData = Object.keys(values).reduce((acc, key) => {
              const currentValue = values[key];
              if (typeof currentValue === "string") acc[key] = "Sample text";
              else if (typeof currentValue === "number") acc[key] = 123;
              else if (typeof currentValue === "boolean") acc[key] = true;
              else if (Array.isArray(currentValue))
                acc[key] = ["item1", "item2"];
              else if (currentValue && typeof currentValue === "object")
                acc[key] = { sample: "data" };
              else acc[key] = null;
              return acc;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }, {} as any);

            Object.keys(sampleData).forEach((key) => {
              formContext.setValue(key, sampleData[key]);
            });
          }}
          label="Fill Sample Data"
          icon={MdCopyAll}
          variant="success"
        />
      </div>
    </div>
  );
}
