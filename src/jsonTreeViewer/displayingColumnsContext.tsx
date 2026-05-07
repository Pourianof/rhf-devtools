import { createContext, ReactNode, useContext } from "react";

export type FieldsTableAvailableComuns =
  | "fieldname"
  | "type"
  | "value"
  | "actions";

const DisplayingColumnsContext = createContext<FieldsTableAvailableComuns[]>(
  [],
);

export function useDisplayingColums() {
  return useContext(DisplayingColumnsContext);
}

export function useShouldColumnDisplay(name: FieldsTableAvailableComuns) {
  const context = useDisplayingColums();

  return !!context.find((c) => c == name);
}

export const ALL_COLUMNS = [
  "fieldname",
  "actions",
  "type",
  "value",
] as FieldsTableAvailableComuns[];

export function DisplayingColumnsContextProvider({
  displayedColumns = ALL_COLUMNS,
  children,
}: {
  children: ReactNode;
  displayedColumns?: FieldsTableAvailableComuns[];
}) {
  return (
    <DisplayingColumnsContext.Provider value={displayedColumns}>
      {children}
    </DisplayingColumnsContext.Provider>
  );
}
