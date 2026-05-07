import { ReactNode } from "react";
import { FieldRow, TableHead } from "./tableFields";
import { JsonSimpleField } from "./jsonSimpleField";
import { JsonComplexField } from "./jsonComplexField";
import {
  ALL_COLUMNS,
  DisplayingColumnsContextProvider,
  useDisplayingColums,
} from "./displayingColumnsContext";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function JsonTreeViewer({
  value,
  builder,
}: {
  value: any;
  builder?: JsonTreeNodeBuilder;
}) {
  const isComplexData = typeof value === "object" && value !== null;
  const displayingColums = useDisplayingColums();

  return (
    <div className="flex-1 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
      {isComplexData ? (
        <DisplayingColumnsContextProvider
          displayedColumns={
            displayingColums?.length ? displayingColums : ALL_COLUMNS
          }
        >
          <table className="w-full table-auto whitespace-nowrap border-spacing-x-4">
            <thead className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
              <FieldRow className="text-gray-200 ">
                <TableHead columnName="fieldname">Field name</TableHead>
                <TableHead columnName="type">Type</TableHead>
                <TableHead columnName="value">Value</TableHead>
                <TableHead className="w-20" columnName="actions">
                  Actions
                </TableHead>
              </FieldRow>
            </thead>
            <tbody>
              {Object.entries(value).map(([key, val]) => (
                <JsonSubTreeViewer
                  key={key}
                  value={val as any}
                  fieldName={key}
                  level={0}
                  builder={builder}
                />
              ))}
            </tbody>
          </table>
        </DisplayingColumnsContextProvider>
      ) : (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          {String(value)}
        </div>
      )}
    </div>
  );
}

export type JsonTreeNodeBuilder = (ctx: {
  props: {
    fieldName: string;
    level: number;
    fullPath: string;
    value: object;
    builder?: JsonTreeNodeBuilder;
  };
  isComplexNode: boolean;
}) => ReactNode;

interface SubTreeViewerProps {
  value: object;
  fieldName: string;
  level?: number;
  parentPath?: string;
  builder?: JsonTreeNodeBuilder;
}

export function JsonSubTreeViewer({
  value,
  fieldName,
  level = 0,
  parentPath = "",
  builder,
}: SubTreeViewerProps) {
  const currentPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;

  const isArray = Array.isArray(value);
  const isObject = typeof value === "object" && value !== null && !isArray;

  const isSimple = !isArray && !isObject;

  if (builder) {
    return builder({
      props: { fieldName, fullPath: currentPath, level, value, builder },
      isComplexNode: !isSimple,
    });
  }

  let node: ReactNode;
  if (!isArray && !isObject) {
    node = (
      <JsonSimpleField
        fieldName={fieldName}
        level={level}
        fullPath={currentPath}
        value={value}
      />
    );
  } else {
    node = (
      <JsonComplexField
        fieldName={fieldName}
        level={level}
        fullPath={currentPath}
        value={value}
      />
    );
  }

  return node;
}
