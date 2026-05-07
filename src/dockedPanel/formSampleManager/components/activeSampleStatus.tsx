import { MdWarning, MdCheck } from "react-icons/md";
import { Sample } from "../types";

interface ActiveSampleStatusProps {
  activeSampleId: string | null;
  samples: Sample[];
  hasUnsavedChanges: boolean;
  onUpdate: () => void;
}

export function ActiveSampleStatus({
  activeSampleId,
  samples,
  hasUnsavedChanges,
  onUpdate,
}: ActiveSampleStatusProps) {
  if (!activeSampleId) return null;

  const activeSample = samples.find((s) => s.id === activeSampleId);

  return (
    <div
      className={`mx-3 mt-3 p-2 rounded-lg text-xs ${
        hasUnsavedChanges
          ? "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800"
          : "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
      }`}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {hasUnsavedChanges ? (
            <MdWarning className="w-4 h-4 text-amber-500" />
          ) : (
            <MdCheck className="w-4 h-4 text-green-500" />
          )}
          <span className="text-gray-700 dark:text-gray-300 text-[11px]">
            Active: <span className="font-semibold">{activeSample?.name}</span>
          </span>
        </div>
        {hasUnsavedChanges && (
          <button
            onClick={onUpdate}
            className="px-2 py-0.5 text-[10px] font-medium bg-indigo-500 text-white hover:bg-indigo-600 rounded transition-colors"
          >
            Update Sample
          </button>
        )}
      </div>
    </div>
  );
}
