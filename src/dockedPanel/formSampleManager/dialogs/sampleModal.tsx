/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { MdClose, MdEdit, MdPreview, MdSave, MdUpload } from "react-icons/md";
import {
  DisplayingColumnsContextProvider,
  ALL_COLUMNS,
} from "../../../jsonTreeViewer/displayingColumnsContext";
import { EditingFieldsContextProvider } from "../../../jsonTreeViewer/jsonSimpleField";
import { JsonTreeViewer } from "../../../jsonTreeViewer/jsonTreeViewer";

interface Sample {
  id: string;
  name: string;
  data: any;
  createdAt: string;
  updatedAt: string;
}

interface SampleModalProps {
  sample: Sample | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (sample: Sample, newData: any) => void;
  onLoad: (sample: Sample) => void;
  mode?: "preview" | "edit";
}

export function SampleModal({
  sample,
  isOpen,
  onClose,
  onSave,
  onLoad,
  mode = "preview",
}: SampleModalProps) {
  const [editData, setEditData] = useState<any>(null);
  const [currentMode, setCurrentMode] = useState<"preview" | "edit">(mode);

  useEffect(() => {
    if (sample && isOpen) {
      setEditData(JSON.parse(JSON.stringify(sample.data)));
      setCurrentMode(mode);
    }
  }, [sample, isOpen, mode]);

  if (!isOpen || !sample) return null;

  const handleSave = () => {
    onSave(sample, editData);
    onClose();
  };

  const handleLoad = () => {
    onLoad(sample);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[90vw] max-w-4xl max-h-[85vh] flex flex-col">
        {/* هدر Modal */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-xl">
          <div className="flex items-center gap-2">
            {currentMode === "preview" ? (
              <MdPreview className="w-5 h-5 text-white" />
            ) : (
              <MdEdit className="w-5 h-5 text-white" />
            )}
            <h3 className="text-sm font-semibold text-white">
              {currentMode === "preview" ? "Preview" : "Edit"} Sample:{" "}
              {sample.name}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                setCurrentMode(currentMode === "preview" ? "edit" : "preview")
              }
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
              title={
                currentMode === "preview"
                  ? "Switch to Edit Mode"
                  : "Switch to Preview Mode"
              }
            >
              {currentMode === "preview" ? (
                <MdEdit className="w-4 h-4" />
              ) : (
                <MdPreview className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <MdClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden p-4">
          {currentMode === "preview" ? (
            <div className="h-full overflow-y-auto">
              <div className="mb-2 text-[10px] text-gray-500 dark:text-gray-400">
                Created: {new Date(sample.createdAt).toLocaleString()} | Last
                updated: {new Date(sample.updatedAt).toLocaleString()}
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <DisplayingColumnsContextProvider
                  displayedColumns={ALL_COLUMNS.filter((c) => c != "actions")}
                >
                  <EditingFieldsContextProvider
                    state={{
                      readOnly: true,
                    }}
                  >
                    <JsonTreeViewer value={sample.data} />
                  </EditingFieldsContextProvider>
                </DisplayingColumnsContextProvider>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <div className="mb-2 text-[10px] text-amber-500 dark:text-amber-400">
                💡 Double-click on any value to edit
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <DisplayingColumnsContextProvider
                  displayedColumns={ALL_COLUMNS.filter((c) => c != "actions")}
                >
                  <EditingFieldsContextProvider
                    state={{
                      readOnly: false,
                      onEdit(fieldPath, newVaue) {
                        const newData = JSON.parse(JSON.stringify(editData));
                        const keys = fieldPath.split(".");
                        let current = newData;
                        for (let i = 0; i < keys.length - 1; i++) {
                          current = current[keys[i]];
                        }
                        current[keys[keys.length - 1]] = newVaue;
                        setEditData(newData);
                      },
                    }}
                  >
                    <JsonTreeViewer value={editData} />
                  </EditingFieldsContextProvider>
                </DisplayingColumnsContextProvider>
              </div>
            </div>
          )}
        </div>

        {/* فوتر Modal */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            Close
          </button>
          {currentMode === "edit" && (
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white hover:bg-green-700 rounded transition-colors flex items-center gap-1"
            >
              <MdSave className="w-3.5 h-3.5" />
              Save Changes
            </button>
          )}
          <button
            onClick={handleLoad}
            className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded transition-colors flex items-center gap-1"
          >
            <MdUpload className="w-3.5 h-3.5" />
            Load This Sample
          </button>
        </div>
      </div>
    </div>
  );
}
