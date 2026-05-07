/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Sample } from "./types";
import { useFormSamples } from "./hooks/useFormSamples";
import { useSampleChanges } from "./hooks/useSampleChanges";
import { ActionButtons } from "./components/actionButtons";
import { ActiveSampleStatus } from "./components/activeSampleStatus";
import { SampleList } from "./components/sampleList";
import { ConfirmDialog } from "./dialogs/confirmDialog";
import { OverwriteDialog } from "./dialogs/overwriteDialog";
import { SampleModal } from "./dialogs/sampleModal";
import { SaveDialog } from "./dialogs/saveDialog";

interface FormSamplesManagerProps {
  formId: string;
  formName: string;
  onLoadSample: (data: any) => void;
  onSampleChanged?: (isUsingSample: boolean) => void;
  getCurrentData: () => any;
}

export function FormSamplesManager({
  formId,
  onLoadSample,
  onSampleChanged,
  getCurrentData,
}: FormSamplesManagerProps) {
  const {
    samples,
    activeSampleId,
    addSample,
    updateSample,
    deleteSample,
    setActiveSample,
  } = useFormSamples(formId);

  const {
    hasUnsavedChanges,
    // checkForChanges
  } = useSampleChanges(
    activeSampleId,
    samples,
    getCurrentData,
    onSampleChanged,
  );

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showOverwriteDialog, setShowOverwriteDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Sample | null>(
    null,
  );
  const [showUnsavedWarning, setShowUnsavedWarning] = useState<{
    targetSampleId: string;
  } | null>(null);
  const [pendingSampleId, setPendingSampleId] = useState<string | null>(null);
  const [modalSample, setModalSample] = useState<Sample | null>(null);
  const [modalMode, setModalMode] = useState<"preview" | "edit">("preview");

  const handleSaveSample = (name: string) => {
    const currentData = getCurrentData();
    addSample(name, currentData);
  };

  const handleOverwriteSample = (sampleId: string) => {
    const currentData = getCurrentData();
    updateSample(sampleId, currentData);
    setShowOverwriteDialog(false);
  };

  const handleSaveEditedSample = (sample: Sample, newData: any) => {
    updateSample(sample.id, newData);
    if (activeSampleId === sample.id) {
      onLoadSample(newData);
    }
  };

  const handleLoadSample = (sampleId: string, ignoreChanges = false) => {
    const sample = samples.find((s) => s.id === sampleId);
    if (!sample) return;

    if (hasUnsavedChanges && !ignoreChanges) {
      setPendingSampleId(sampleId);
      setShowUnsavedWarning({ targetSampleId: sampleId });
      return;
    }

    onLoadSample(sample.data);
    setActiveSample(sampleId);
  };

  const handleLoadSampleFromModal = (sample: Sample) => {
    onLoadSample(sample.data);
    setActiveSample(sample.id);
  };

  const handleDeleteSample = (sample: Sample) => {
    deleteSample(sample.id);
    setShowDeleteConfirm(null);
  };

  const handleExitSample = () => {
    setActiveSample(null);
  };

  const handleUpdateCurrentSample = () => {
    if (activeSampleId) {
      const currentData = getCurrentData();
      updateSample(activeSampleId, currentData);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* <SampleHeader formName={formName} onRefresh={checkForChanges} /> */}

      <ActiveSampleStatus
        activeSampleId={activeSampleId}
        samples={samples}
        hasUnsavedChanges={hasUnsavedChanges}
        onUpdate={handleUpdateCurrentSample}
      />

      <ActionButtons
        samplesCount={samples.length}
        hasActiveSample={!!activeSampleId}
        onSaveAsNew={() => setShowSaveDialog(true)}
        onOverwrite={() => setShowOverwriteDialog(true)}
        onExitSample={handleExitSample}
      />

      <div className="flex-1 overflow-y-auto p-3">
        <SampleList
          samples={samples}
          activeSampleId={activeSampleId}
          onPreview={(sample) => {
            setModalSample(sample);
            setModalMode("preview");
          }}
          onEdit={(sample) => {
            setModalSample(sample);
            setModalMode("edit");
          }}
          onLoad={(sample) => handleLoadSample(sample.id, false)}
          onDelete={(sample) => setShowDeleteConfirm(sample)}
        />
      </div>

      {/* Modals and Dialogs */}
      <SampleModal
        sample={modalSample}
        isOpen={!!modalSample}
        onClose={() => setModalSample(null)}
        onSave={handleSaveEditedSample}
        onLoad={handleLoadSampleFromModal}
        mode={modalMode}
      />

      <SaveDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSaveSample}
        existingNames={samples.map((s) => s.name)}
      />

      <OverwriteDialog
        isOpen={showOverwriteDialog}
        onClose={() => setShowOverwriteDialog(false)}
        samples={samples}
        onConfirm={handleOverwriteSample}
      />

      <ConfirmDialog
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() =>
          showDeleteConfirm && handleDeleteSample(showDeleteConfirm)
        }
        title="Delete Sample"
        message={`Are you sure you want to delete "${showDeleteConfirm?.name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      <ConfirmDialog
        isOpen={!!showUnsavedWarning}
        onClose={() => {
          setShowUnsavedWarning(null);
          setPendingSampleId(null);
        }}
        onConfirm={() => {
          if (pendingSampleId) {
            handleLoadSample(pendingSampleId, true);
          }
          setShowUnsavedWarning(null);
          setPendingSampleId(null);
        }}
        title="Unsaved Changes"
        message="You have unsaved changes in the current sample. Loading another sample will discard these changes. Are you sure?"
        confirmText="Discard & Load"
        cancelText="Stay"
      />
    </div>
  );
}
