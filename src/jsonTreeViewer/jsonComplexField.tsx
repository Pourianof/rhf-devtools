import { useState } from "react";
import { MdArrowRight } from "react-icons/md";
import { JsonSubTreeViewer, JsonTreeNodeBuilder } from "./jsonTreeViewer";
import {
  FieldActions,
  FieldName,
  FieldRow,
  FieldType,
  FieldValue,
} from "./tableFields";
import { TypeBadge } from "./typeBadge";

export interface ComplexFieldProps {
  fieldName: string;
  level: number;
  fullPath: string;
  value: object;
  builder?: JsonTreeNodeBuilder;
}

export function JsonComplexField({
  fieldName,
  level,
  fullPath,
  value,
  builder,
}: ComplexFieldProps) {
  const isArray = Array.isArray(value);
  const isObject = typeof value === "object" && value !== null && !isArray;

  const [isExpanded, setIsExpanded] = useState(false);

  const getTypeLabel = () => {
    if (isArray) return `Arr(${value.length})`;
    if (isObject) return "Obj";
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    return typeof value;
  };

  const getPreviewText = () => {
    if (isArray && value) {
      return `[${value
        .slice(0, 3)
        .map((v: object) =>
          typeof v === "object"
            ? Array.isArray(v)
              ? "[...]"
              : "{...}"
            : typeof v === "string"
              ? `"${v}"`
              : String(v),
        )
        .join(", ")}${value.length > 3 ? ", ..." : ""}]`;
    }

    if (isObject && value) {
      return `{${Object.entries(value)
        .slice(0, 2)
        .map(
          ([k, v]) =>
            `${k}: ${typeof v === "object" ? (Array.isArray(v) ? "[...]" : "{...}") : String(v)}`,
        )
        .join(", ")}${Object.keys(value).length > 2 ? ", ..." : ""}}`;
    }

    return "";
  };

  return (
    <>
      <ObjectHeader
        key={Math.random()}
        fieldName={fieldName}
        typeLabel={getTypeLabel()}
        level={level}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        previewText={getPreviewText()}
        fieldFullPath={fullPath}
      />

      {isExpanded && value && (
        <>
          {isArray
            ? value.map((item: object, index: number) => (
                <JsonSubTreeViewer
                  key={index}
                  value={item}
                  fieldName={`${index}`}
                  level={level + 1}
                  parentPath={fullPath}
                  builder={builder}
                />
              ))
            : isObject
              ? Object.entries(value).map(([key, val]) => (
                  <JsonSubTreeViewer
                    key={key}
                    value={val}
                    fieldName={key}
                    level={level + 1}
                    parentPath={fullPath}
                    builder={builder}
                  />
                ))
              : null}
        </>
      )}
    </>
  );
}

interface ExpandButtonProps {
  isExpanded: boolean;
  onToggle: () => void;
}

function ExpandButton({ isExpanded, onToggle }: ExpandButtonProps) {
  return (
    <button
      className="cursor-pointer shrink-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-200 w-5 h-5 flex items-center justify-center"
      style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
    >
      <MdArrowRight className="w-3.5 h-3.5" />
    </button>
  );
}

interface ObjectHeaderProps {
  fieldName: string;
  typeLabel: string;
  level: number;
  isExpanded: boolean;
  onToggle: () => void;
  previewText: string;
  fieldFullPath: string;
}

function ObjectHeader({
  fieldName,
  typeLabel,
  level,
  isExpanded,
  onToggle,
  previewText,
  fieldFullPath,
}: ObjectHeaderProps) {
  return (
    <FieldRow>
      <FieldName>
        <div className="flex">
          <div className="shrink-0" style={{ width: level * 16 }}></div>
          <ExpandButton isExpanded={isExpanded} onToggle={onToggle} />
          <span
            className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400 truncate"
            title={fieldName}
          >
            {fieldName}:
          </span>
          {!isExpanded && (
            <span
              title={previewText}
              className="text-[11px] max-w-[15ch] text-ellipsis overflow-hidden text-gray-500 dark:text-gray-400 truncate flex-1"
            >
              {previewText}
            </span>
          )}
        </div>
      </FieldName>
      <FieldType>
        <TypeBadge typeLabel={typeLabel} />
      </FieldType>
      <FieldValue>
        <span className="text-gray-500">---</span>
      </FieldValue>
      <FieldActions fieldName={fieldFullPath} />
    </FieldRow>
  );
}
