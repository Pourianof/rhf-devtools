import { useSelectedForm } from "../../contexts/selectedFormProvider";
import { FormSamplesManager } from "../formSampleManager/formSamplesManager";

export function FormSampleManagerTabPage() {
  const { formContext, formName } = useSelectedForm()!;

  const handleLoadSample = (data: object) => {
    // formContext.reset(data, { keepDefaultValues: true, keepValues: false });
    Object.entries(data).forEach(([key, value]) =>
      formContext.setValue(key, value),
    );
  };

  return (
    <div className="h-full">
      <FormSamplesManager
        getCurrentData={() => formContext.getValues()}
        formId={formName}
        formName={formName}
        onLoadSample={handleLoadSample}
      />
    </div>
  );
}
