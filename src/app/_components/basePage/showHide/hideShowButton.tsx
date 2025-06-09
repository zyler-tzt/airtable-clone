import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import { api } from "~/trpc/react";
import { FieldShowHideToggler } from "./fieldShowHideToggler";
import type { Field } from "@prisma/client";

type HideShowButtonProps = {
  tableId: number;
  viewId: number;
  setTableColumns: (newFields: Field[]) => void;
  tableColumns: Field[];
};

export function HideShowButton({
  tableId,
  viewId,
  setTableColumns,
  tableColumns,
}: HideShowButtonProps) {
  const { data: fields } = api.table.getAllFields.useQuery({ tableId });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="my-1 flex cursor-pointer flex-row items-center justify-center gap-1 rounded-sm px-2 py-2 text-xs select-none hover:bg-gray-200">
          <Image
            src="/hide-field.svg"
            alt="hideFieldIcon"
            width={15}
            height={15}
            draggable={false}
          />
          Hide field
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel className="text-xs">
          Show/Hide Fields
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {fields?.map((f) => {
            return (
              <FieldShowHideToggler
                key={`hs-toggler-${f.id}`}
                tableColumns={tableColumns}
                setTableColumns={setTableColumns}
                tableId={f.tableId}
                fieldType={f.type}
                fieldId={f.id}
                fieldName={f.name}
                viewFields={f.viewFields}
                viewId={viewId}
              />
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
