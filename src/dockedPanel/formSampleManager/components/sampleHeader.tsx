import { MdFolderOpen, MdRefresh } from "react-icons/md";

interface SampleHeaderProps {
  formName: string;
  onRefresh: () => void;
}

export function SampleHeader({ formName, onRefresh }: SampleHeaderProps) {
  return (
    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-600 to-purple-600">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-sm flex items-center gap-2">
            <MdFolderOpen className="w-4 h-4" />
            Form Samples
          </h3>
          <p className="text-indigo-100 text-[10px] mt-0.5">
            Save, load and manage form states for &quot;{formName}&quot;
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="p-1 text-white/80 hover:text-white hover:bg-white/20 rounded transition-colors"
          title="Refresh"
        >
          <MdRefresh className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
