import { useForm } from "react-hook-form";
import { RhfDevTools, useRhfDevTool } from "../../src/rhfDevTools";
import RegistrationForm from "../components/register-form/form";

export function App() {
  return (
    <div>
      <RhfDevTools>
        <ContextConsumer />
      </RhfDevTools>
    </div>
  );
}

function ContextConsumer() {
  const form = useForm({
    defaultValues: {
      skills: [{ name: "", level: "Beginner" }],
    } as any,
  });
  useRhfDevTool(form, "register-user-form");
  return <RegistrationForm form={form} />;
}
