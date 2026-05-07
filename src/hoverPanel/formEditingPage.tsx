import { MdArrowLeft } from "react-icons/md";
import { ValuesTabPage } from "../dockedPanel/formDashboard/valuesTabPage";

export function FormEditingPage({ onBack }: { onBack: VoidFunction }) {
  return (
    <div className="px-2">
      <button
        className="flex hover:cursor-pointer items-center gap-1 text-blue-400 dark:text-blue-400 text-sm"
        onClick={(e) => {
          e.preventDefault();
          onBack();
        }}
      >
        <MdArrowLeft />
        <span>Back</span>
      </button>
      <ValuesTabPage displayedColumns={["value", "fieldname", "actions"]} />
    </div>
  );
}
