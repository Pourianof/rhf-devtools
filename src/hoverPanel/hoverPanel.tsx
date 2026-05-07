import { useState } from "react";
import { useSelectedForm } from "../contexts/selectedFormProvider";
import { StatusBadge } from "../shared/statusBadge";
import { FormItemHeader } from "./formItemHeader";
import { HoverPanelActionButtons } from "./hoverPanelActionButtons";
import { HoverPanelJsonValuesDisplay } from "./hoverPanelJsonValuesDisplay";
import { HoverPanelValidationErrorsDisplay } from "./hoverPanelValidationErrorsDisplay";
import { FormEditingPage } from "./formEditingPage";
import { FormSampleManagerPage } from "./formSampleMangerPage";

enum FormCardPages {
  Editing,
  Samples,
  Main,
}

export function FormCard() {
  const [expanded, setExpanded] = useState(false);
  const [displayingPage, setDisplayingPage] = useState<FormCardPages>(
    FormCardPages.Main,
  );

  return (
    <div className="group border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <FormItemHeader
        onExpandToggled={() => setExpanded(!expanded)}
        isExpanded={expanded}
      />
      {expanded ? (
        <div className="text-xs border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
          {displayingPage == FormCardPages.Editing ? (
            <FormEditingPage
              onBack={() => setDisplayingPage(FormCardPages.Main)}
            />
          ) : displayingPage == FormCardPages.Samples ? (
            <FormSampleManagerPage
              onBack={() => setDisplayingPage(FormCardPages.Main)}
            />
          ) : (
            <div className="px-4 pb-4 space-y-3 ">
              <FormStatus />
              <HoverPanelValidationErrorsDisplay />
              <HoverPanelJsonValuesDisplay
                onDisplayEditingPage={() =>
                  setDisplayingPage(FormCardPages.Editing)
                }
                onDisplaySamplesPage={() =>
                  setDisplayingPage(FormCardPages.Samples)
                }
              />
              <HoverPanelActionButtons />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function FormStatus() {
  const { formContext } = useSelectedForm()!;

  const formState = formContext.formState;
  const isValid = formState.isValid;
  const isDirty = formState.isDirty;
  const isSubmitting = formState.isSubmitting;
  const isSubmitted = formState.isSubmitted;
  const submitCount = formState.submitCount;
  return (
    <div className="grid grid-cols-2 gap-2 pt-3">
      <StatusBadge label="Valid" value={isValid} isGood={isValid} />
      <StatusBadge label="Dirty" value={isDirty} isGood={!isDirty} />
      <StatusBadge
        label="Submitting"
        value={isSubmitting}
        isGood={!isSubmitting}
      />
      <StatusBadge label="Submitted" value={isSubmitted} />
      <StatusBadge label="Submit Count" value={submitCount} />
      <StatusBadge
        label="Touched Fields"
        value={Object.keys(formState.touchedFields || {}).length}
      />
    </div>
  );
}
