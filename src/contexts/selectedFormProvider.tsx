import { createContext, ReactNode, useContext } from "react";
import { FormState } from "../rhfDevTools";

const SelectedFormContext = createContext<FormState | null | undefined>(
  {} as unknown as FormState,
);

export function useSelectedForm() {
  return useContext(SelectedFormContext);
}

export function SelectedFormProvider({
  children,
  form,
}: {
  children: ReactNode;
  form: FormState | null | undefined;
}) {
  return (
    <SelectedFormContext.Provider value={form}>
      {children}
    </SelectedFormContext.Provider>
  );
}
