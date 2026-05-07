import { MdErrorOutline, MdWarning } from "react-icons/md";
import { FormState } from "../rhfDevTools";

export function FormListItem({
  form,
  isSelected,
  onSelect,
}: {
  form: FormState;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { formContext, formName } = form;
  const errors = formContext.formState.errors;
  const isValid = formContext.formState.isValid;
  const isDirty = formContext.formState.isDirty;

  return (
    <div
      onClick={onSelect}
      className={`
        flex items-center justify-between px-3 py-2 cursor-pointer transition-all duration-150
        ${
          isSelected
            ? "bg-indigo-100 dark:bg-indigo-950/50 border-l-4 border-indigo-500"
            : "hover:bg-gray-100 dark:hover:bg-gray-800 border-l-4 border-transparent"
        }
      `}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div
          className={`w-2 h-2 rounded-full flex-shrink-0 ${isValid ? "bg-green-500" : "bg-red-500"}`}
        />
        <span
          className={`text-sm truncate ${isSelected ? "font-semibold text-indigo-700 dark:text-indigo-300" : "text-gray-700 dark:text-gray-300"}`}
        >
          {formName}
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        {Object.keys(errors).length > 0 && (
          <div className="flex items-center gap-0.5 text-red-500 text-xs">
            <MdErrorOutline className="w-3 h-3" />
            <span className="text-xs">{Object.keys(errors).length}</span>
          </div>
        )}

        {isDirty && (
          <div className="text-amber-500 text-xs">
            <MdWarning className="w-3 h-3" />
          </div>
        )}
      </div>
    </div>
  );
}
