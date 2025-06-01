import type { Field, ViewField } from "@prisma/client";
import { api } from "~/trpc/react";
import { Label } from "~/app/_components/ui/label";
import { Switch } from "~/app/_components/ui/switch";

type FieldShowHideTogglerProps = {
  viewFields: ViewField[];
  viewId: number;
  fieldId: number;
  fieldName: string;
  fieldType: string;
  tableId: number;
  setTableColumns: (newFields: Field[]) => void;
  tableColumns: Field[];
};
export function FieldShowHideToggler({
  viewFields,
  viewId,
  fieldId,
  fieldName,
  tableColumns,
  setTableColumns,
  fieldType,
  tableId,
}: FieldShowHideTogglerProps) {
  const exist = viewFields.find((vf) => vf.viewId === viewId);
  const utils = api.useUtils();

  const createViewFieldMutation = api.view.createViewField.useMutation({
    onMutate: async () => {
      await utils.table.getFields.cancel();
      await utils.cell.infiniteRows.invalidate();
    },
    onSuccess: async () => {
      await utils.table.getFields.invalidate();
    },
  });
  const deleteViewFieldMutation = api.view.deleteViewField.useMutation({
    onMutate: async () => {
      await utils.table.getFields.cancel();
      await utils.cell.infiniteRows.invalidate();
    },
    onSuccess: async () => {
      await utils.table.getFields.invalidate();
    },
  });

  function handleFieldToggle(fieldId: number, isChecked: boolean) {
    if (isChecked) {
      const copy = [
        ...tableColumns,
        { id: fieldId, type: fieldType, name: fieldName, tableId: tableId },
      ];
      setTableColumns(copy);
      void createViewFieldMutation.mutateAsync({ fieldId, viewId });
    } else {
      const newFields = tableColumns.filter((c) => c.id != fieldId);
      setTableColumns(newFields);
      void deleteViewFieldMutation.mutateAsync({ fieldId, viewId });
    }
  }

  return (
    <div className="flex flex-row gap-2 px-2 py-1">
      <Switch
        key={`switch-${fieldId}`}
        className="h-4 w-7 data-[state=checked]:bg-green-700"
        defaultChecked={!!exist}
        onCheckedChange={(checked) => handleFieldToggle(fieldId, checked)}
      />
      <Label htmlFor="airplane-mode" className="text-xs">
        {fieldName}
      </Label>
    </div>
  );
}
