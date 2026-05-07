import { createContext, ReactNode, useContext } from "react";
import { JsonEditableValue } from "./jsonEditableValue";
import {
  FieldActions,
  FieldName,
  FieldRow,
  FieldType,
  FieldValue,
} from "./tableFields";
import { TypeBadge } from "./typeBadge";

export interface EditingFieldContextState {
  readOnly?: boolean;
  onEdit?(fieldPath: string, newVaue: string): void;
}

export interface SimpleRowProps extends EditingFieldContextState {
  fieldName: string;
  level: number;
  fullPath?: string;
  value: object;
}

export function JsonSimpleField({
  fieldName,
  level,
  fullPath = "",
  value,
  onEdit,
  readOnly = undefined,
}: SimpleRowProps) {
  const editingFieldConfigs = useEditingFieldContext();

  const getTypeLabel = () => {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    return typeof value;
  };

  return (
    <FieldRow>
      <FieldName>
        <div className="flex">
          <div className="shrink-0" style={{ width: level * 16 + 20 }}></div>
          <span
            className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400 w-25 shrink-0 truncate"
            title={fieldName}
          >
            {fieldName}:
          </span>
        </div>
      </FieldName>
      <FieldType>
        <TypeBadge typeLabel={getTypeLabel()} />
      </FieldType>

      <FieldValue>
        <JsonEditableValue
          value={value}
          fieldPath={fullPath}
          onEdit={onEdit ?? editingFieldConfigs.onEdit}
          readOnly={readOnly ?? editingFieldConfigs.readOnly}
        />
      </FieldValue>
      <FieldActions fieldName={fullPath} />
    </FieldRow>
  );
}

const EditingFieldContext = createContext<EditingFieldContextState>(
  {} as object,
);

export function useEditingFieldContext() {
  return useContext(EditingFieldContext);
}

export function EditingFieldsContextProvider({
  children,
  state,
}: {
  children: ReactNode;
  state: EditingFieldContextState;
}) {
  return (
    <EditingFieldContext.Provider value={state}>
      {children}
    </EditingFieldContext.Provider>
  );
}
