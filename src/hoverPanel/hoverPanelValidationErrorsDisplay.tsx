import { MdErrorOutline } from "react-icons/md";
import { useSelectedForm } from "../contexts/selectedFormProvider";

export function HoverPanelValidationErrorsDisplay() {
  const { formContext } = useSelectedForm()!;

  const formState = formContext.formState;
  const errors = formState.errors;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getErrorMessage = (error: any): string => {
    if (typeof error === "string") return error;
    if (error?.message) return error.message;
    if (error?.type) return error.type;
    return "Invalid field";
  };

  return (
    <>
      {Object.keys(errors).length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold text-xs">
            <MdErrorOutline className="w-3.5 h-3.5" />
            <span>Validation Errors</span>
            <span className="text-red-500 dark:text-red-500 text-xs ml-1">
              ({Object.keys(errors).length})
            </span>
          </div>
          <div className="space-y-1.5 max-h-32 overflow-y-auto bg-red-50 dark:bg-red-950/20 rounded-md p-2 border border-red-100 dark:border-red-900/30">
            {Object.entries(errors).map(([field, error]) => (
              <div
                key={field}
                className="flex items-start gap-1.5 text-red-700 dark:text-red-300 text-xs"
              >
                <MdErrorOutline className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <div className="break-all">
                  <span className="font-mono font-medium">{field}</span>
                  <span className="text-red-600 dark:text-red-400">: </span>
                  <span>{getErrorMessage(error)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
