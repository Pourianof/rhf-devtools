"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { Panel } from "./panel";
import {
  RhfDevtoolConfigs,
  RhfDevtoolConfigsProvider,
} from "./contexts/rhfDevToolConfigsContext";
import { ActiveFormSampleContextProvider } from "./contexts/activeSampleContext";

// const isDevMode = process.env.NODE_ENV == "development";

type FormContext = UseFormReturn<FieldValues, any, FieldValues>;
export type FormState = { formName: string; formContext: FormContext };

interface IFormState {
  activeForms: FormState[];
}

interface IFormHelperActions {
  addForm(form: FormContext, name?: string): number;
  removeForm(id: number): void;
}

const FormActionsContext = createContext<IFormHelperActions>(
  {} as unknown as IFormHelperActions,
);

const FormStateContext = createContext<IFormState>({} as unknown as IFormState);

export function useRhfDevTool(
  form: FormContext,
  formName?: string,
  options?: { disable?: boolean },
) {
  const context = useContext(FormActionsContext);
  const formIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (options?.disable) return;
    if (!context) {
      console.warn(
        "hook used but no RhfDevTools existed and hook not disabled(with set options.disabled to true). It seems you didn't use RhfDevTools component in upper component tree",
      );
      return;
    }

    formIdRef.current = context.addForm(form, formName);

    return () => {
      if (formIdRef.current) context.removeForm(formIdRef.current);
    };
  }, [form.formState.defaultValues, form, context, formName]);
}

export function useFormStateContext() {
  const context = useContext(FormStateContext);

  return context.activeForms;
}

export function RhfDevToolsContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const formId = useRef(1);
  const [activeForms, setActiveForms] = useState<{
    [key: number]: FormState;
  }>({});

  const actions: IFormHelperActions = useMemo(
    () => ({
      addForm(form, name) {
        const formID = formId.current++;
        setActiveForms((af) => ({
          ...af,
          [formID]: {
            formContext: form,
            formName: name ?? `Form #${formID}`,
          },
        }));

        return formID;
      },

      removeForm(id: number) {
        setActiveForms((af) => {
          delete af[id];
          return { ...af };
        });
      },
    }),
    [],
  );

  return (
    <FormActionsContext.Provider value={actions}>
      <FormStateContext.Provider
        value={{
          activeForms: Object.values(activeForms),
        }}
      >
        {children}
      </FormStateContext.Provider>
    </FormActionsContext.Provider>
  );
}

export function RhfDevTools({
  children,
  ...options
}: {
  children: ReactNode;
} & RhfDevtoolConfigs) {
  // if (!isDevMode) {
  //   return children;
  // }

  return (
    <RhfDevToolsContextProvider>
      <ActiveFormSampleContextProvider>
        <RhfDevtoolConfigsProvider configs={options}>
          {children}
          <Panel />
        </RhfDevtoolConfigsProvider>
      </ActiveFormSampleContextProvider>
    </RhfDevToolsContextProvider>
  );
}
