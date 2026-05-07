import { MdDownload } from "react-icons/md";
import { Sample } from "../types";
import { SampleItem } from "./sampleItem";

interface SampleListProps {
  samples: Sample[];
  activeSampleId: string | null;
  onPreview: (sample: Sample) => void;
  onEdit: (sample: Sample) => void;
  onLoad: (sample: Sample) => void;
  onDelete: (sample: Sample) => void;
}

export function SampleList({
  samples,
  activeSampleId,
  onPreview,
  onEdit,
  onLoad,
  onDelete,
}: SampleListProps) {
  if (samples.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 dark:text-gray-500">
        <MdDownload className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-xs">No saved samples yet</p>
        <p className="text-[10px] mt-1">
          Save the current form state as a sample
        </p>
      </div>
    );
  }

  return (
    <>
      <h4 className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
        Saved Samples ({samples.length})
      </h4>
      <div className="space-y-2">
        {samples.map((sample) => (
          <SampleItem
            key={sample.id}
            sample={sample}
            isActive={activeSampleId === sample.id}
            onPreview={() => onPreview(sample)}
            onEdit={() => onEdit(sample)}
            onLoad={() => onLoad(sample)}
            onDelete={() => onDelete(sample)}
          />
        ))}
      </div>
    </>
  );
}
