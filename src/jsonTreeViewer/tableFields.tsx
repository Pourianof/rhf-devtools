import { ReactNode, useState } from "react";
import { MdCheckCircle, MdDeleteOutline, MdVerified } from "react-icons/md";
import { useSelectedForm } from "../contexts/selectedFormProvider";
import {
  FieldsTableAvailableComuns,
  useShouldColumnDisplay,
} from "./displayingColumnsContext";

type FieldProps = { children: ReactNode };

function DisplayColumnOrNull({
  children,
  name,
}: {
  children: ReactNode;
  name: FieldsTableAvailableComuns;
}) {
  const shouldDisplay = useShouldColumnDisplay(name);
  if (!shouldDisplay) {
    return null;
  }

  return children;
}

export function TableHead({
  children,
  className,
  columnName,
}: FieldProps & {
  className?: string;
  columnName: FieldsTableAvailableComuns;
}) {
  return (
    <DisplayColumnOrNull name={columnName}>
      <th className={"font-light text-sm py-2 " + className}>{children}</th>
    </DisplayColumnOrNull>
  );
}

export function FieldValue({ children }: FieldProps) {
  return (
    <DisplayColumnOrNull name="value">
      <td>{children}</td>
    </DisplayColumnOrNull>
  );
}

export function FieldName({ children }: FieldProps) {
  return (
    <DisplayColumnOrNull name="fieldname">
      <td>{children}</td>
    </DisplayColumnOrNull>
  );
}

export function FieldType({ children }: FieldProps) {
  return (
    <DisplayColumnOrNull name="type">
      <td>{children}</td>
    </DisplayColumnOrNull>
  );
}

export function FieldActions(props: HoverButtonsProps) {
  return (
    <DisplayColumnOrNull name="actions">
      <td className="w-10">
        <div className="flex justify-center">
          <HoverButtons {...props} />
        </div>
      </td>
    </DisplayColumnOrNull>
  );
}

export function FieldRow({
  children,
  className,
}: FieldProps & { className?: string }) {
  return (
    <tr
      className={
        "hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0" +
        " " +
        (className ?? "")
      }
    >
      {children}
    </tr>
  );
}

interface HoverButtonsProps {
  fieldName: string;
}

function HoverButtons({ fieldName }: HoverButtonsProps) {
  const [isValidating, setIsValidating] = useState(false);
  const formContext = useSelectedForm();

  function handleValidation() {
    setIsValidating(true);
    formContext?.formContext
      .trigger(fieldName)
      .finally(() => setIsValidating(false));
  }

  function cleanField() {
    formContext?.formContext.resetField(fieldName);
  }

  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleValidation();
        }}
        disabled={isValidating}
        className="p-0.5 text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors disabled:opacity-50"
        title="Validate this field"
      >
        {isValidating ? (
          <MdCheckCircle className="w-3 h-3 animate-pulse" />
        ) : (
          <MdVerified className="w-3 h-3" />
        )}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          cleanField();
        }}
        className="p-0.5 text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors disabled:opacity-50"
        title="Clear field value"
      >
        <MdDeleteOutline className="w-3 h-3" />
      </button>
    </div>
  );
}
