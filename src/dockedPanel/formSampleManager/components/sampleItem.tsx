import { MdPreview, MdEdit, MdUpload } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { Sample } from "../types";

interface SampleItemProps {
  sample: Sample;
  isActive: boolean;
  onPreview: () => void;
  onEdit: () => void;
  onLoad: () => void;
  onDelete: () => void;
}

export function SampleItem({
  sample,
  isActive,
  onPreview,
  onEdit,
  onLoad,
  onDelete,
}: SampleItemProps) {
  const lastUpdated = new Date(sample.updatedAt).toLocaleString();

  return (
    <div
      className={`rounded-lg border transition-all ${
        isActive
          ? "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-700"
          : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700"
      }`}
    >
      <div className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs font-medium truncate ${
                  isActive
                    ? "text-indigo-700 dark:text-indigo-300"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {sample.name}
              </span>
              {isActive && (
                <span className="text-[9px] px-1 py-0.5 bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300 rounded">
                  Active
                </span>
              )}
            </div>
            <div className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">
              {lastUpdated}
            </div>
          </div>

          <div className="flex items-center gap-0.5">
            <button
              onClick={onPreview}
              className="p-1 text-gray-500 hover:text-blue-500 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Preview"
            >
              <MdPreview className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onEdit}
              className="p-1 text-gray-500 hover:text-green-500 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Edit"
            >
              <MdEdit className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onLoad}
              className="p-1 text-gray-500 hover:text-indigo-500 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Load"
            >
              <MdUpload className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onDelete}
              className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Delete"
            >
              <FaTrashAlt className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
