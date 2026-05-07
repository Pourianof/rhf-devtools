import { useState } from "react";
import {
  MdCode,
  MdDashboard,
  MdFolderOpen,
  MdInfoOutline,
  MdList,
} from "react-icons/md";
import { useSelectedForm } from "../../contexts/selectedFormProvider";
import { ActionTabPage } from "./actionsTabPage";
import { DetailsTabPage } from "./detailsTabPage";
import { ValuesTabPage } from "./valuesTabPage";
import { FormSampleManagerTabPage } from "./formSampleManagerTabPage";

type Tabs = "details" | "values" | "actions" | "samples";
export function FormDashboard() {
  const [activeTab, setActiveTab] = useState<Tabs>("details");

  const selectedForm = useSelectedForm();

  if (!selectedForm) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
        <MdDashboard className="w-16 h-16 mb-4 opacity-30" />
        <p className="text-sm font-medium">No Form Selected</p>
        <p className="text-xs mt-1">Select a form from the left panel</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        {[
          { id: "details", label: "Details", icon: MdInfoOutline },
          { id: "values", label: "Values", icon: MdList },
          { id: "actions", label: "Actions", icon: MdCode },
          { id: "samples", label: "Samples", icon: MdFolderOpen }, // تب جدید
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tabs)}
            className={`
              flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all
              ${
                activeTab === tab.id
                  ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 bg-white dark:bg-gray-800"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === "details" && <DetailsTabPage />}
        {activeTab === "values" && <ValuesTabPage />}
        {activeTab === "actions" && <ActionTabPage />}
        {activeTab === "samples" && <FormSampleManagerTabPage />}
      </div>
    </div>
  );
}
