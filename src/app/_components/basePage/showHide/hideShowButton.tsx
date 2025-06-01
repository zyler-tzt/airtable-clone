import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu"
import { api } from "~/trpc/react";
import { FieldShowHideToggler } from "./fieldShowHideToggler";
import type { Field } from "@prisma/client";

type HideShowButtonProps = {
  tableId: number,
  viewId: number,
  setTableColumns: (newFields: Field[]) => void,
  tableColumns: Field[]
}

export function HideShowButton({tableId, viewId, setTableColumns, tableColumns}: HideShowButtonProps) {
  const { data: fields } = api.table.getAllFields.useQuery({ tableId })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className='flex my-1 px-2 rounded-sm flex-row hover:bg-gray-200 items-center justify-center gap-1 select-none text-xs'>
          <Image 
              src="/hide-field.svg"
              alt="hideFieldIcon"
              width={15}         
              height={15}    
              draggable={false}
          />
            Show/Hide field
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel className="text-xs">Show/Hide Fields</DropdownMenuLabel>
        <DropdownMenuGroup>
          {
            fields?.map(f => {
              return (<FieldShowHideToggler key={`hs-toggler-${f.id}`} tableColumns={tableColumns} setTableColumns={setTableColumns} tableId={f.tableId} fieldType={f.type} fieldId={f.id} fieldName={f.name} viewFields={f.viewFields} viewId={viewId} />)
            })
          }
          
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
