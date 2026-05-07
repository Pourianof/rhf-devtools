import { createContext, ReactNode, useContext } from "react";

export type RhfDevtoolConfigs = {
  displayOnlyIfAnyFormExists?: boolean;
};

const RhfDevtoolConfigsContext = createContext<RhfDevtoolConfigs>(
  {} as unknown as RhfDevtoolConfigs,
);

export function useRhfDevToolConfigs() {
  return useContext(RhfDevtoolConfigsContext);
}

export function RhfDevtoolConfigsProvider({
  children,
  configs = {},
}: {
  children: ReactNode;
  configs?: RhfDevtoolConfigs;
}) {
  return (
    <RhfDevtoolConfigsContext.Provider value={configs}>
      {children}
    </RhfDevtoolConfigsContext.Provider>
  );
}
