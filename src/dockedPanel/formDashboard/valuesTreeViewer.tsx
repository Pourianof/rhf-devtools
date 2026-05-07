import { useSelectedForm } from "../../contexts/selectedFormProvider";
import { JsonTreeViewer } from "../../jsonTreeViewer/jsonTreeViewer";
import { FormComplexField, FormSimpleField } from "./formFieldNodes";

export function ValuesTreeViewer() {
  const data = useSelectedForm()?.formContext.watch();

  return (
    <div className="flex flex-col h-full">
      <JsonTreeViewer
        value={data}
        builder={({ isComplexNode, props }) => {
          return isComplexNode ? (
            <FormComplexField {...props} />
          ) : (
            <FormSimpleField {...props} />
          );
        }}
      />
      <div className="mt-2 text-[10px] text-gray-400 dark:text-gray-500 text-center">
        💡 Double-click on any value to edit
      </div>
    </div>
  );
}
