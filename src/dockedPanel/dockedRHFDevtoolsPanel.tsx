import { useEffect, useRef, useState } from "react";
import {
  MdClose,
  MdCompress,
  MdDashboard,
  MdGrain,
  MdHeight,
  MdOpenInFull,
  MdOutlineSettings,
  MdUnfoldMore,
} from "react-icons/md";
import { useDevToolDisplayMode } from "../contexts/devToolDisplayModeContext";
import { useFormStateContext } from "../rhfDevTools";
import { DockedPanelProvider, useDockedState } from "./contexts/dockedContext";
import { PanelBody } from "./panelBody";

export function DockedRHFDevtoolsPanel() {
  return (
    <DockedPanelProvider>
      <DockedRHFDevtoolsPanel_ />
    </DockedPanelProvider>
  );
}

function DockedRHFDevtoolsPanel_() {
  const { isMinimized, isOpen, panelHeight, setIsOpen } = useDockedState();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] shadow-2xl animate-in slide-in-from-bottom duration-300"
      style={{ height: isOpen && !isMinimized ? `${panelHeight}vh` : "auto" }}
    >
      {!isOpen ? <ClosedPanel onOpen={() => setIsOpen(true)} /> : <Panel />}
    </div>
  );
}

function Panel() {
  const {
    isMinimized,
    panelHeight,

    setPanelHeight,
  } = useDockedState();

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startYRef.current = e.clientY;
    startHeightRef.current = panelHeight;
  };

  const [isResizing, setIsResizing] = useState(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  useEffect(() => {
    const handleResizeMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaY = startYRef.current - e.clientY;
      const newHeight = Math.min(
        85,
        Math.max(
          30,
          startHeightRef.current + (deltaY / window.innerHeight) * 100,
        ),
      );
      setPanelHeight(newHeight);
    };

    const handleResizeEnd = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleResizeMove);
      window.addEventListener("mouseup", handleResizeEnd);
      return () => {
        window.removeEventListener("mousemove", handleResizeMove);
        window.removeEventListener("mouseup", handleResizeEnd);
      };
    }
  }, [isResizing, setPanelHeight]);

  return (
    <div className="bg-white dark:bg-gray-800 border-t-2 border-indigo-500 shadow-lg flex flex-col h-full">
      <PanelHeader />
      {!isMinimized && (
        <div
          className="h-1 bg-gray-200 dark:bg-gray-700 hover:bg-indigo-400 dark:hover:bg-indigo-600 cursor-row-resize transition-colors group relative"
          onMouseDown={handleResizeStart}
        >
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <MdUnfoldMore className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          </div>
        </div>
      )}

      {!isMinimized && <PanelBody />}
    </div>
  );
}

function ClosedPanel({ onOpen }: { onOpen: VoidFunction }) {
  const forms = useFormStateContext();

  return (
    <div
      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 flex items-center justify-between cursor-pointer hover:from-indigo-700 hover:to-purple-700 transition-colors"
      onClick={onOpen}
    >
      <div className="flex items-center gap-2">
        <MdOutlineSettings className="w-5 h-5" />
        <span className="text-sm font-medium">Form Inspector</span>
        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
          {forms.length}
        </span>
      </div>
      <button
        onClick={onOpen}
        className="p-1 hover:bg-white/20 rounded transition-colors"
      >
        <MdOpenInFull className="w-4 h-4" />
      </button>
    </div>
  );
}
export function PanelHeader() {
  const {
    isMinimized,
    panelHeight,
    setIsMinimized,
    setIsOpen,
    setPanelHeight,
  } = useDockedState();
  const activeForms = useFormStateContext();

  return (
    <div className="flex items-center justify-between px-4 py-1 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="flex items-center gap-2">
        <MdDashboard className="w-5 h-5" />
        <h3 className="text-sm font-semibold">Form Inspector Dashboard</h3>
        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
          {activeForms.length} Forms
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setPanelHeight(panelHeight === 40 ? 60 : 40)}
          className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          title="Toggle height (40% / 60%)"
        >
          <MdHeight className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          title={isMinimized ? "Expand" : "Minimize"}
        >
          {isMinimized ? (
            <MdOpenInFull className="w-4 h-4" />
          ) : (
            <MdCompress className="w-4 h-4" />
          )}
        </button>
        <HoverModeButton />
        <button
          onClick={() => setIsOpen(false)}
          className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          title="Close"
        >
          <MdClose className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function HoverModeButton() {
  const { changeToHover } = useDevToolDisplayMode();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        changeToHover();
      }}
      className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
      title="change to hover mode"
    >
      <MdGrain />
    </button>
  );
}
