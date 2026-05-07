import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type Mode = "hover" | "docked";

interface DevToolDisplayMode {
  mode: Mode;
  changeToHover(): void;
  changeToDocked(): void;
}

const DevToolDisplayModeContext = createContext<DevToolDisplayMode>(
  {} as unknown as DevToolDisplayMode,
);

export function useDevToolDisplayMode() {
  return useContext(DevToolDisplayModeContext);
}

const LS_MODE = "rhf-devtool:mode";

export function DevToolDisplayModeProvider({
  children,
  builder,
}: {
  children?: ReactNode;
  builder?: (mode: Mode) => ReactNode;
}) {
  const [mode, setMode] = useState<Mode>(
    () => (localStorage.getItem(LS_MODE) as Mode | null) ?? "hover",
  );

  function hanleChangeToHover() {
    setMode("hover");
  }

  function handleChangeToDocked() {
    setMode("docked");
  }

  useEffect(() => {
    localStorage.setItem(LS_MODE, mode);
  }, [mode]);

  if (!children && !builder) {
    throw new Error("neither children nor builder specified");
  }

  return (
    <DevToolDisplayModeContext.Provider
      value={{
        mode,
        changeToDocked: handleChangeToDocked,
        changeToHover: hanleChangeToHover,
      }}
    >
      {children ?? builder?.(mode)}
    </DevToolDisplayModeContext.Provider>
  );
}
