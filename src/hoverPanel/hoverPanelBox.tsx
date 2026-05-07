import { FaRegWindowMaximize } from "react-icons/fa";
import { MdClose, MdExpandMore, MdInfoOutline } from "react-icons/md";
import { useDevToolDisplayMode } from "../contexts/devToolDisplayModeContext";
import { SelectedFormProvider } from "../contexts/selectedFormProvider";
import { useFormStateContext } from "../rhfDevTools";
import { usePinToDraggableContainer } from "./hooks/usePinToDragContainer";
import { FormCard } from "./hoverPanel";

export function HoverPanelBox({ onClose }: { onClose: VoidFunction }) {
  const activeForms = useFormStateContext();
  const { position, pinningBoxRef } = usePinToDraggableContainer();

  return (
    <div
      className="panel-content absolute cursor-default w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200"
      style={{
        transformOrigin: "top right",
        visibility: position ? "visible" : "hidden",
        ...position,
      }}
      ref={pinningBoxRef}
    >
      <div className="no-drag flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white cursor-default">
        <div className="flex items-center gap-2">
          <MdInfoOutline className="w-4 h-4" />
          <h3 className="text-sm font-semibold">Form Inspector</h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
            {activeForms.length} Active
          </span>
          <DockModeButton />
          <button
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
            className="text-white/80 hover:text-white transition-colors"
          >
            <MdClose className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 divide-y divide-gray-200 dark:divide-gray-700 max-h-[460px]">
        {activeForms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
            <FaRegWindowMaximize className="w-10 h-10 mb-3 opacity-50" />
            <p className="text-sm font-medium">No Active Forms</p>
            <p className="text-xs mt-1 text-center px-4">
              Forms using{" "}
              <code className="text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">
                useFormHelper
              </code>{" "}
              will appear here
            </p>
          </div>
        ) : (
          activeForms.map((form, index) => (
            <SelectedFormProvider key={index} form={form}>
              <FormCard />
            </SelectedFormProvider>
          ))
        )}
      </div>

      {activeForms.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            💡 Drag the button to move
          </p>
        </div>
      )}
    </div>
  );
}

function DockModeButton() {
  const { changeToDocked } = useDevToolDisplayMode();
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        changeToDocked();
      }}
      title="change to docked mode"
    >
      <MdExpandMore />
    </button>
  );
}
