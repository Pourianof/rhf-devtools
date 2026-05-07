import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type ChangeStateCallback<T> = (value: T) => void;

interface DockedState {
  isOpen: boolean;
  setIsOpen: ChangeStateCallback<boolean>;
  isMinimized: boolean;
  setIsMinimized: ChangeStateCallback<boolean>;
  panelHeight: number;
  setPanelHeight: ChangeStateCallback<number>;
}

function useLocalStorageState() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [panelHeight, setPanelHeight] = useState(60); // height percentage

  useEffect(() => {
    const savedOpen = localStorage.getItem("formHelperOpen");
    const savedMinimized = localStorage.getItem("formHelperMinimized");
    const savedHeight = localStorage.getItem("formHelperHeight");

    if (savedOpen !== null) setIsOpen(savedOpen === "true");
    if (savedMinimized !== null) setIsMinimized(savedMinimized === "true");
    if (savedHeight !== null) setPanelHeight(parseInt(savedHeight));
  }, []);

  useEffect(() => {
    localStorage.setItem("formHelperOpen", String(isOpen));
    localStorage.setItem("formHelperMinimized", String(isMinimized));
    localStorage.setItem("formHelperHeight", String(panelHeight));
  }, [isOpen, isMinimized, panelHeight]);

  return {
    isOpen,
    setIsOpen,
    isMinimized,
    setIsMinimized,
    panelHeight,
    setPanelHeight,
  };
}

export function useDockedState() {
  return useContext(DockedStateContext);
}

const DockedStateContext = createContext<DockedState>(
  {} as unknown as DockedState,
);

export function DockedPanelProvider({ children }: { children: ReactNode }) {
  const context = useLocalStorageState();

  return (
    <DockedStateContext.Provider value={context}>
      {children}
    </DockedStateContext.Provider>
  );
}
