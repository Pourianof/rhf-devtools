import { FaArrowLeft } from "react-icons/fa";
import { useSelectedForm } from "../contexts/selectedFormProvider";
import { FormSamplesManager } from "../dockedPanel/formSampleManager/formSamplesManager";

export function FormSampleManagerPage({ onBack }: { onBack: VoidFunction }) {
  const { formContext, formName } = useSelectedForm()!;

  const handleLoadSample = (data: object) => {
    formContext.reset(data, { keepDefaultValues: true });
  };

  return (
    <div className="h-full flex flex-col">
      <button
        className="text-blue-200 flex gap-1 items-center hover:cursor-pointer p-2 pb-0 hover:text-blue-500"
        onClick={(e) => {
          e.preventDefault();
          onBack();
        }}
      >
        <FaArrowLeft />
        <span>Back</span>
      </button>
      <FormSamplesManager
        getCurrentData={() => formContext.getValues()}
        formId={formName}
        formName={formName}
        onLoadSample={handleLoadSample}
      />
    </div>
  );
}
