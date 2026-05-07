import { useState, useRef, useCallback, useEffect } from "react";
import { MdCheck, MdClose, MdEdit } from "react-icons/md";

/* eslint-disable @typescript-eslint/no-explicit-any */

function EmptyValue() {
  return (
    <span className="text-xs text-gray-400 dark:text-gray-500 italic bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 rounded">
      empty
    </span>
  );
}

interface EditableValueProps {
  value: any;
  fieldPath: string;
  readOnly?: boolean;
  onEdit?(fieldPath: string, newVaue: any): void;
}

export function JsonEditableValue({
  value,
  fieldPath,
  readOnly,
  onEdit,
}: EditableValueProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getDisplayValue = () => {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (value === "") return "";
    if (typeof value === "string") return value;
    return String(value);
  };

  const getValueClass = () => {
    if (value === null) return "text-gray-400 dark:text-gray-500";
    if (value === undefined) return "text-gray-400 dark:text-gray-500 italic";
    if (value === "") return "text-gray-400 dark:text-gray-500";
    if (typeof value === "string")
      return "text-emerald-600 dark:text-emerald-400";
    if (typeof value === "number") return "text-blue-600 dark:text-blue-400";
    if (typeof value === "boolean")
      return "text-purple-600 dark:text-purple-400";
    return "";
  };

  const handleDoubleClick = () => {
    if (readOnly) return;
    setIsEditing(true);
    setEditValue(getDisplayValue());
  };

  const handleSave = useCallback(() => {
    let newValue: unknown;

    if (typeof value === "number") {
      newValue = editValue === "" ? 0 : Number(editValue);
    } else if (typeof value === "boolean") {
      newValue = editValue === "true";
    } else if (value === null) {
      newValue = editValue === "null" ? null : editValue;
    } else if (typeof value === "string") {
      newValue = editValue;
    } else {
      newValue = editValue;
    }

    onEdit?.(fieldPath, newValue);

    setIsEditing(false);
  }, [editValue, fieldPath, onEdit, value]);

  const handleBlur = () => {
    if (isEditing) {
      handleSave();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isEditing &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleSave();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, handleSave]);

  const isEmpty = value === "" || value === null || value === undefined;

  if (isEditing) {
    return (
      <div ref={containerRef} className="flex items-center gap-1 flex-1">
        <input
          readOnly={!onEdit || readOnly}
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="flex-1 px-1.5 py-0.5 text-xs border border-indigo-400 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder={
            typeof value === "string" ? "empty string" : "enter value"
          }
        />
        <button
          onClick={handleSave}
          className="p-0.5 text-green-600 hover:text-green-700 dark:text-green-400"
          title="Save"
        >
          <MdCheck className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="p-0.5 text-red-600 hover:text-red-700 dark:text-red-400"
          title="Cancel"
        >
          <MdClose className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-1 group/value">
      {isEmpty ? (
        <div
          className="cursor-text"
          onDoubleClick={handleDoubleClick}
          title="Double-click to edit"
        >
          <EmptyValue />
        </div>
      ) : (
        <span
          className={`text-xs break-all cursor-text ${getValueClass()}`}
          onDoubleClick={handleDoubleClick}
          title="Double-click to edit"
        >
          {getDisplayValue()}
        </span>
      )}
      {!readOnly && (
        <button
          onClick={handleDoubleClick}
          className="opacity-0 group-hover/value:opacity-100 transition-opacity p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          title="Edit value"
        >
          <MdEdit className="w-2.5 h-2.5" />
        </button>
      )}
    </div>
  );
}
