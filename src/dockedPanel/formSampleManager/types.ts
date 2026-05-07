/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Sample {
  id: string;
  name: string;
  data: any;
  createdAt: string;
  updatedAt: string;
}

export interface FormSamples {
  [formId: string]: {
    samples: Sample[];
    activeSampleId?: string | null;
  };
}

export interface FormSamplesManagerProps {
  formId: string;
  formName: string;
  onLoadSample: (data: any) => void;
  onSampleChanged?: (isUsingSample: boolean) => void;
  getCurrentData: () => any;
}
