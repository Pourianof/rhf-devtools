/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from "react";
import { Sample } from "../types";
import { isDeepEqual } from "../../../utils/deepEquality";
import { useWatch } from "react-hook-form";
import { useSelectedForm } from "../../../contexts/selectedFormProvider";

export function useSampleChanges(
  activeSampleId: string | null,
  samples: Sample[],
  getCurrentData: () => any,
  onSampleChanged?: (isUsingSample: boolean) => void,
) {
  const form = useSelectedForm();
  const values = useWatch({ control: form?.formContext.control });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const checkForChanges = useCallback(() => {
    if (activeSampleId) {
      const activeSample = samples.find((s) => s.id === activeSampleId);
      if (activeSample) {
        const currentData = getCurrentData();

        const hasChanges =
          JSON.stringify(currentData) != JSON.stringify(activeSample.data) &&
          !isDeepEqual(activeSample.data, currentData);

        setHasUnsavedChanges(hasChanges);
        onSampleChanged?.(hasChanges);
      }
    } else {
      setHasUnsavedChanges(false);
      onSampleChanged?.(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSampleId, samples, getCurrentData, onSampleChanged, values]);

  useEffect(() => {
    checkForChanges();
  }, [checkForChanges]);

  return {
    hasUnsavedChanges,
    checkForChanges,
  };
}
