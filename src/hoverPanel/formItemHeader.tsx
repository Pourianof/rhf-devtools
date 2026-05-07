import {
  MdErrorOutline,
  MdWarning,
  MdCheck,
  MdExpandMore,
} from "react-icons/md";
import { useSelectedForm } from "../contexts/selectedFormProvider";

export function FormItemHeader({
  onExpandToggled,
  isExpanded,
}: {
  onExpandToggled?: VoidFunction;
  isExpanded: boolean;
}) {
  const { formContext, formName } = useSelectedForm()!;

  const formState = formContext.formState;
  const errors = formState.errors;
  const isValid = formState.isValid;
  const isDirty = formState.isDirty;
  const isSubmitting = formState.isSubmitting;
  const isSubmitted = formState.isSubmitted;

  return (
    <div
      className="flex items-center justify-between px-4 py-3 cursor-pointer transition-colors duration-150
                   hover:bg-indigo-50 dark:hover:bg-indigo-950/30
                   active:bg-indigo-100 dark:active:bg-indigo-950/50"
      onClick={onExpandToggled}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div
          className={`w-2 h-2 rounded-full flex-shrink-0 ${isValid ? "bg-green-500" : "bg-red-500"}`}
        />
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
          {formName}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {Object.keys(errors).length > 0 && (
          <div className="flex items-center gap-1 text-red-500 text-xs">
            <MdErrorOutline className="w-3.5 h-3.5" />
            <span className="font-medium">{Object.keys(errors).length}</span>
          </div>
        )}

        {isDirty && !isSubmitting && (
          <div
            className="text-amber-500 text-xs"
            title="Form has unsaved changes"
          >
            <MdWarning className="w-3.5 h-3.5" />
          </div>
        )}

        {isSubmitted && !isSubmitting && (
          <div
            className="text-green-500 text-xs"
            title="Form has been submitted"
          >
            <MdCheck className="w-3.5 h-3.5" />
          </div>
        )}

        <MdExpandMore
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
        />
      </div>
    </div>
  );
}
