"use client";

import { useCallback, useState } from "react";
import { MdClose, MdOutlineSettings } from "react-icons/md";
import { useFormStateContext } from "../rhfDevTools";
import { DragNDropController } from "../hooks/DragNDropController";
import { HoverPanelBox } from "./hoverPanelBox";

export function HoverRhfDevTools() {
  const [isOpen, setIsOpen] = useState(false);

  const activeForms = useFormStateContext();

  const toggleOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  return (
    <DragNDropController
      style={{ cursor: "grab" }}
      whenDraggingProps={{ style: { cursor: "grabbing" } }}
      onClick={toggleOpen}
    >
      <div className="select-none">
        <button
          className={`
            group relative flex items-center justify-center
            w-14 h-14 rounded-full
            bg-gradient-to-br from-indigo-500 to-purple-600
            hover:from-indigo-600 hover:to-purple-700
            shadow-lg hover:shadow-xl
            transition-all duration-300 ease-out
            ${isOpen ? "rotate-90 scale-110" : "rotate-0"}
            focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2
          `}
          style={{ cursor: "inherit" }}
        >
          {isOpen ? (
            <MdClose className="w-6 h-6 text-white" />
          ) : (
            <MdOutlineSettings className="w-6 h-6 text-white animate-pulse" />
          )}

          {activeForms.length > 0 && !isOpen && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-2 ring-white">
              {activeForms.length}
            </span>
          )}
        </button>
      </div>

      {isOpen && <HoverPanelBox onClose={() => setIsOpen(false)} />}
    </DragNDropController>
  );
}
