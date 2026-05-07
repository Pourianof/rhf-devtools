/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from "react";
import { Sample, FormSamples } from "../types";
import { useFormActiveSample } from "../../../contexts/activeSampleContext";

export function useFormSamples(formId: string) {
  const [samples, setSamples] = useState<Sample[]>([]);
  const activeSampleContext = useFormActiveSample(formId);

  const activeSampleId = activeSampleContext.activeSample?.sampleId;

  useEffect(() => {
    const stored = localStorage.getItem("form_samples");
    if (stored) {
      const allSamples: FormSamples = JSON.parse(stored);
      const formSamples = allSamples[formId];
      if (formSamples) {
        setSamples(formSamples.samples);
        if (activeSampleContext.activeSample?.formId != formId) {
          activeSampleContext.deActivate();
        }
      }
    }
  }, [activeSampleContext, formId]);

  const getSampleById = useCallback(
    function (sampleId: any) {
      return samples.find((s) => s.id == sampleId);
    },
    [samples],
  );

  const persistSamples = useCallback(
    (newSamples: Sample[]) => {
      const stored = localStorage.getItem("form_samples");
      const allSamples: FormSamples = stored ? JSON.parse(stored) : {};

      allSamples[formId] = {
        samples: newSamples,
      };

      localStorage.setItem("form_samples", JSON.stringify(allSamples));
    },
    [formId],
  );

  const addSample = useCallback(
    (name: string, data: any) => {
      const newSample: Sample = {
        id: Date.now().toString(),
        name,
        data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const newSamples = [...samples, newSample];
      setSamples(newSamples);
      activeSampleContext.activate(newSample.id, newSample.data);
      persistSamples(newSamples);
      return newSample;
    },
    [samples, activeSampleContext, persistSamples],
  );

  const updateSample = useCallback(
    (sampleId: string, data: any) => {
      const updatedSamples = samples.map((sample) =>
        sample.id === sampleId
          ? { ...sample, data, updatedAt: new Date().toISOString() }
          : sample,
      );
      setSamples(updatedSamples);
      if (activeSampleId === sampleId) {
        persistSamples(updatedSamples);
      } else {
        persistSamples(updatedSamples);
      }
      return updatedSamples;
    },
    [samples, activeSampleId, persistSamples],
  );

  const deleteSample = useCallback(
    (sampleId: string) => {
      const newSamples = samples.filter((s) => s.id !== sampleId);
      let newActiveId = activeSampleId;
      if (activeSampleId === sampleId) {
        newActiveId = null;
      }
      setSamples(newSamples);
      activeSampleContext.activate(newActiveId, getSampleById(newActiveId));
      persistSamples(newSamples);
    },
    [
      samples,
      activeSampleId,
      activeSampleContext,
      getSampleById,
      persistSamples,
    ],
  );

  const setActiveSample = useCallback(
    (sampleId: string | null) => {
      activeSampleContext.activate(sampleId, getSampleById(sampleId));
    },
    [activeSampleContext, getSampleById],
  );

  return {
    samples,
    activeSampleId: activeSampleContext.activeSample?.sampleId,
    addSample,
    updateSample,
    deleteSample,
    setActiveSample,
  };
}
