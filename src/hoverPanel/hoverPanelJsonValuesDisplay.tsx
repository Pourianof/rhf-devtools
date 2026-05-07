import { useState } from "react";
import { FaCopy } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { MdDocumentScanner, MdEdit } from "react-icons/md";
import { useSelectedForm } from "../contexts/selectedFormProvider";
import { ActionButton } from "../shared/actionButton";

export function HoverPanelJsonValuesDisplay({
  onDisplayEditingPage,
  onDisplaySamplesPage,
}: {
  onDisplayEditingPage: VoidFunction;
  onDisplaySamplesPage: VoidFunction;
}) {
  const [showValues, setShowValues] = useState(false);
  const [copied, setCopied] = useState(false);

  const { formContext } = useSelectedForm()!;
  const values = formContext.getValues();

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {Object.keys(values).length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-400 font-semibold text-xs">
                  Form Values
                </span>
                <button
                  onClick={() => setShowValues(!showValues)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  {showValues ? (
                    <FiEyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <FiEye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <div className="flex gap-2">
                <ActionButton
                  onClick={() =>
                    copyToClipboard(JSON.stringify(values, null, 2))
                  }
                  label={copied ? "Copied!" : "Copy"}
                  icon={FaCopy}
                  variant="outline"
                />
                <ActionButton
                  onClick={() => onDisplaySamplesPage()}
                  label={"Samples"}
                  icon={MdDocumentScanner}
                  variant="outline"
                />
              </div>
            </div>
            <button
              title="display edit page to access to form fields"
              className="hover:cursor-pointer flex items-center  gap-1 text-blue-400 dark:text-blue-400 font-semibold "
              onClick={(e) => {
                e.preventDefault();
                onDisplayEditingPage();
              }}
            >
              <MdEdit />
              Edit form fields
            </button>
          </div>
          {showValues && (
            <div className="bg-gray-100 dark:bg-gray-900 rounded-md p-2 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700">
              <pre className="text-xs text-gray-800 dark:text-gray-300 whitespace-pre-wrap break-all font-mono">
                {JSON.stringify(values, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </>
  );
}
