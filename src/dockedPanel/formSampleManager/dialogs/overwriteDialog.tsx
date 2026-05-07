/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { MdSaveAlt, MdClose } from "react-icons/md";
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

interface OverwriteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  samples: Sample[];
  onConfirm: (sampleId: string) => void;
}

export function OverwriteDialog({
  isOpen,
  onClose,
  samples,
  onConfirm,
}: OverwriteDialogProps) {
  const [selectedSampleId, setSelectedSampleId] = useState<string>("");

  useEffect(() => {
    if (isOpen && samples.length > 0) {
      setSelectedSampleId(samples[0].id);
    }
  }, [isOpen, samples]);

  if (!isOpen) return null;

  const selectedSample = samples.find((s) => s.id === selectedSampleId);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MdSaveAlt className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Overwrite Sample
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <MdClose className="w-4 h-4" />
          </button>
        </div>
        <div className="px-4 py-3">
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
            Select a sample to overwrite with current form data:
          </p>
          <select
            value={selectedSampleId}
            onChange={(e) => setSelectedSampleId(e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 mb-3"
          >
            {samples.map((sample) => (
              <option key={sample.id} value={sample.id}>
                {sample.name} (Updated:{" "}
                {new Date(sample.updatedAt).toLocaleDateString()})
              </option>
            ))}
          </select>
          {selectedSample && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded p-2 max-h-32 overflow-y-auto">
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">
                Preview of {selectedSample.name}:
              </div>
              <DisplayingColumnsContextProvider
                displayedColumns={ALL_COLUMNS.filter((c) => c != "actions")}
              >
                <EditingFieldsContextProvider
                  state={{
                    readOnly: true,
                  }}
                >
                  <JsonTreeViewer value={selectedSample.data} />
                </EditingFieldsContextProvider>
              </DisplayingColumnsContextProvider>
            </div>
          )}
        </div>
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selectedSampleId)}
            className="px-3 py-1.5 text-xs font-medium bg-amber-600 text-white hover:bg-amber-700 rounded transition-colors"
          >
            Overwrite Sample
          </button>
        </div>
      </div>
    </div>
  );
}
