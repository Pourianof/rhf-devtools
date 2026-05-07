import { MdAdd, MdSaveAlt } from "react-icons/md";

interface ActionButtonsProps {
  samplesCount: number;
  hasActiveSample: boolean;
  onSaveAsNew: () => void;
  onOverwrite: () => void;
  onExitSample: () => void;
}

export function ActionButtons({
  samplesCount,
  hasActiveSample,
  onSaveAsNew,
  onOverwrite,
  onExitSample,
}: ActionButtonsProps) {
  return (
    <div className="flex gap-2 p-3 border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={onSaveAsNew}
        className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors"
      >
        <MdAdd className="w-3.5 h-3.5" />
        Save as New
      </button>

      {samplesCount > 0 && !hasActiveSample && (
        <button
          onClick={onOverwrite}
          className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium bg-amber-600 text-white hover:bg-amber-700 rounded-lg transition-colors"
        >
          <MdSaveAlt className="w-3.5 h-3.5" />
          Overwrite Sample
        </button>
      )}

      {hasActiveSample && (
        <button
          onClick={onExitSample}
          className="px-2 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          Exit Sample
        </button>
      )}
    </div>
  );
}
