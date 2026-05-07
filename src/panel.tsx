"use client";

import { DevToolDisplayModeProvider } from "./contexts/devToolDisplayModeContext";
import { useRhfDevToolConfigs } from "./contexts/rhfDevToolConfigsContext";
import { DockedRHFDevtoolsPanel } from "./dockedPanel/dockedRHFDevtoolsPanel";
import { HoverRhfDevTools } from "./hoverPanel/hoverRhfDevtools";
import { useFormStateContext } from "./rhfDevTools";

export function Panel() {
  const { displayOnlyIfAnyFormExists } = useRhfDevToolConfigs();
  const forms = useFormStateContext();

  if (displayOnlyIfAnyFormExists && !forms.length) {
    return null;
  }

  return (
    <DevToolDisplayModeProvider
      builder={(mode) =>
        mode == "docked" ? <DockedRHFDevtoolsPanel /> : <HoverRhfDevTools />
      }
    />
  );
}
