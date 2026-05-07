import { useState, useEffect } from "react";
import { MdSave, MdClose } from "react-icons/md";

interface SaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  existingNames: string[];
}

export function SaveDialog({
  isOpen,
  onClose,
  onSave,
  existingNames = [],
}: SaveDialogProps) {
  const [sampleName, setSampleName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSampleName("");
      setError("");
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!sampleName.trim()) {
      setError("Sample name is required");
      return;
    }
    if (existingNames.includes(sampleName.trim())) {
      setError("A sample with this name already exists");
      return;
    }
    onSave(sampleName.trim());
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MdSave className="w-5 h-5 text-indigo-500" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Save Sample
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
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sample Name
          </label>
          <input
            type="text"
            value={sampleName}
            onChange={(e) => setSampleName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Sample 1, Test Data, etc."
            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            autoFocus
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded transition-colors"
          >
            Save Sample
          </button>
        </div>
      </div>
    </div>
  );
}
