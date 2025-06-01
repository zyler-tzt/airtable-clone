import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu"

import type { Field } from "@prisma/client"
import { api } from "~/trpc/react";

type sortByObject = {
  id: number,
  fieldId: number,
  order: "asc" | "desc"
}

type CreateNewSortProps = {
    fields: Field[] | undefined,
    sortMap: sortByObject[],
    setSortMap: (sortMap: sortByObject[]) => void,
    viewId: number
}


export function CreateNewSort({fields, sortMap, setSortMap, viewId} : CreateNewSortProps) {
    const utils = api.useUtils();

    const createSort = api.view.createSort.useMutation({
          onSuccess: async () => {
              await utils.view.getSorts.invalidate();
              await utils.cell.infiniteRows.invalidate();
          },
      });
    function createSortHandler(fieldId: number) {
      setSortMap([...sortMap, {id: -1, fieldId, order: "asc"}])
      void createSort.mutateAsync({fieldId, order: "asc", viewId: viewId})
    }

    return (
        <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className='flex my-1 px-2 py-2 rounded-sm flex-row hover:bg-gray-200 items-center justify-center gap-1 select-none text-xs'>
                    Add a new sort
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuGroup>
                  {
                    
                    fields?.filter(f => !sortMap.map(s => s.fieldId).includes(f.id)).length === 0 ?
                       (<div className="text-xs py-1 px-2">
                        No fields left to sort
                      </div>)
                    : fields?.filter(f => !sortMap.map(s => s.fieldId).includes(f.id)).map(f => {
                      return (<div key={`to-sort-${f.id}`} className="text-xs py-1 px-2 select-none hover:bg-gray-200" style={{ borderRadius: "2px"}}
                      onClick={() => createSortHandler(f.id)}>
                        {f.name}
                      </div>)
                    })
                  }
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
    )
}