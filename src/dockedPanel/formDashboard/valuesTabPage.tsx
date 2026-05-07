import { useState } from "react";
import { FaCopy } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useSelectedForm } from "../../contexts/selectedFormProvider";
import { ActionButton } from "../../shared/actionButton";
import {
  DisplayingColumnsContextProvider,
  FieldsTableAvailableComuns,
} from "../../jsonTreeViewer/displayingColumnsContext";
import { ValuesTreeViewer } from "./valuesTreeViewer";

export function ValuesTabPage({
  displayedColumns = ["actions", "fieldname", "type", "value"],
}: {
  displayedColumns?: FieldsTableAvailableComuns[];
}) {
  const [showValues, setShowValues] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { formContext } = useSelectedForm()!;
  const values = formContext.watch();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Form Values
        </h4>
        <ActionButton
          onClick={() => copyToClipboard(JSON.stringify(values, null, 2))}
          label={copied ? "Copied!" : "Copy All"}
          icon={FaCopy}
          variant="outline"
        />
      </div>

      <DisplayingColumnsContextProvider displayedColumns={displayedColumns}>
        <ValuesTreeViewer />
      </DisplayingColumnsContextProvider>

      <button
        onClick={() => setShowValues(!showValues)}
        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
      >
        {showValues ? (
          <FiEyeOff className="w-3 h-3" />
        ) : (
          <FiEye className="w-3 h-3" />
        )}
        {showValues ? "Hide" : "Show"} JSON View
      </button>

      {showValues && (
        <pre className="bg-gray-900 text-green-400 rounded-lg p-3 text-xs overflow-x-auto max-h-96">
          {JSON.stringify(values, null, 2)}
        </pre>
      )}
    </div>
  );
}
