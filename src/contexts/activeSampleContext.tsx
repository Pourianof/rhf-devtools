/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useFormStateContext } from "../rhfDevTools";

interface FormSampleState {
  formId: string;
  sampleData: any;
  sampleId: any;
}

interface ActiveFormSampleState {
  formsSampleState?: FormSampleState[];
  activateSample(formId: string, sample?: { data: any; id: any }): void;
}

const ActiveSampleContext = createContext<ActiveFormSampleState>({} as any);

export function useFormActiveSample(formId: string) {
  const formSampleStates = useContext(ActiveSampleContext);

  const activeSample = formSampleStates.formsSampleState?.find(
    (f) => f.formId == formId,
  );

  const formActiveSample = useMemo(
    () => ({
      activeSample: activeSample,
      activate(sampleId: any, sampleData: any) {
        formSampleStates.activateSample(formId, {
          id: sampleId,
          data: sampleData,
        });
      },
      deActivate() {
        formSampleStates.activateSample(formId, undefined);
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeSample, formId, formSampleStates.activateSample],
  );

  return formActiveSample;
}

export function ActiveFormSampleContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [sampleStates, setSampleStates] = useState<FormSampleState[]>([]);
  const forms = useFormStateContext();

  useEffect(() => {
    setSampleStates((sss) =>
      sss.filter((ss) => forms.some((f) => f.formName == ss.formId)),
    );
  }, [forms]);

  const handleSampleActivation = useCallback(
    function (formId: string, sample: { data: any; id: any }) {
      if (!forms.some((f) => f.formName == formId)) {
        return;
      }

      if (!sample) {
        setSampleStates((sss) => sss.filter((ss) => ss.formId != formId));
        return;
      }

      setSampleStates((sss) => [
        ...sss.filter((ss) => ss.formId != formId),
        { formId, sampleData: sample.data, sampleId: sample.id },
      ]);
    },
    [forms],
  );

  return (
    <ActiveSampleContext.Provider
      value={{
        formsSampleState: sampleStates,
        activateSample: handleSampleActivation,
      }}
    >
      {children}
    </ActiveSampleContext.Provider>
  );
}
