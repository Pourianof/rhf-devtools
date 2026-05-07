import { MdCheckCircle, MdErrorOutline, MdWarning } from "react-icons/md";
import { StatusBadge } from "../../shared/statusBadge";
import { useSelectedForm } from "../../contexts/selectedFormProvider";

export function DetailsTabPage() {
  const { formContext } = useSelectedForm()!;
  const formState = formContext.formState;
  const errors = formState.errors;
  const isValid = formState.isValid;
  const isDirty = formState.isDirty;
  const isSubmitting = formState.isSubmitting;
  const isSubmitted = formState.isSubmitted;
  const submitCount = formState.submitCount;
  const isSubmitSuccessful = formState.isSubmitSuccessful;
  const values = formContext.getValues();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getErrorMessage = (error: any): string => {
    if (typeof error === "string") return error;
    if (error?.message) return error.message;
    if (error?.type) return error.type;
    return "Invalid field";
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 border border-green-200 dark:border-green-900">
          <div className="text-xs text-green-600 dark:text-green-400 mb-1">
            Validation Status
          </div>
          <div className="flex items-center gap-2">
            {isValid ? (
              <MdCheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <MdErrorOutline className="w-5 h-5 text-red-500" />
            )}
            <span
              className={`font-semibold ${isValid ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}
            >
              {isValid ? "Valid" : "Invalid"}
            </span>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3 border border-amber-200 dark:border-amber-900">
          <div className="text-xs text-amber-600 dark:text-amber-400 mb-1">
            Form State
          </div>
          <div className="flex items-center gap-2">
            {isDirty ? (
              <MdWarning className="w-5 h-5 text-amber-500" />
            ) : (
              <MdCheckCircle className="w-5 h-5 text-green-500" />
            )}
            <span
              className={`font-semibold ${isDirty ? "text-amber-700 dark:text-amber-300" : "text-green-700 dark:text-green-300"}`}
            >
              {isDirty ? "Dirty" : "Clean"}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 space-y-2">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Statistics
        </h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <StatusBadge label="Submit Count" value={submitCount} />
          <StatusBadge
            label="Submitting"
            value={isSubmitting}
            isGood={!isSubmitting}
          />
          <StatusBadge label="Submitted" value={isSubmitted} />
          <StatusBadge label="Submit Successful" value={isSubmitSuccessful} />
          <StatusBadge
            label="Touched Fields"
            value={Object.keys(formState.touchedFields || {}).length}
          />
          <StatusBadge
            label="Total Fields"
            value={Object.keys(values).length}
          />
        </div>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-3 border border-red-200 dark:border-red-900">
          <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-1">
            <MdErrorOutline className="w-4 h-4" />
            Validation Errors ({Object.keys(errors).length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {Object.entries(errors).map(([field, error]) => (
              <div
                key={field}
                className="bg-white dark:bg-gray-800 rounded p-2 text-xs"
              >
                <div className="font-mono font-semibold text-red-600 dark:text-red-400">
                  {field}
                </div>
                <div className="text-red-500 dark:text-red-300 mt-0.5">
                  {getErrorMessage(error)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
