import { useState, useEffect } from "react";
import { FaRegWindowMaximize } from "react-icons/fa";
import { useFormStateContext } from "../rhfDevTools";
import { useDockedState } from "./contexts/dockedContext";
import { FormDashboard } from "./formDashboard/formDashboard";
import { FormListItem } from "./formListItem";
import { SelectedFormProvider } from "../contexts/selectedFormProvider";

export function PanelBody() {
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
  const { panelHeight } = useDockedState();

  const activeForms = useFormStateContext();

  useEffect(() => {
    if (activeForms.length > 0 && selectedFormId === null) {
      setSelectedFormId(0);
    }
  }, [activeForms, selectedFormId]);

  const selectedForm =
    selectedFormId !== null ? activeForms[selectedFormId] : null;
  return (
    <div
      className="flex-1 flex overflow-hidden"
      style={{ height: `calc(${panelHeight}vh - 48px)` }}
    >
      <div className="w-64 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Form List
          </h4>
        </div>
        <div className="flex-1 overflow-y-auto">
          {activeForms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 p-4">
              <FaRegWindowMaximize className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-xs text-center">No active forms</p>
            </div>
          ) : (
            activeForms.map((form, index) => (
              <FormListItem
                key={index}
                form={form}
                isSelected={selectedFormId === index}
                onSelect={() => setSelectedFormId(index)}
              />
            ))
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <SelectedFormProvider form={selectedForm}>
          <FormDashboard />
        </SelectedFormProvider>
      </div>
    </div>
  );
}
