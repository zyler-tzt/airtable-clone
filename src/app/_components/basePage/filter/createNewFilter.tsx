import type { Field } from "@prisma/client";
import { random } from "nanoid";
import { api } from "~/trpc/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";

type filterByObject = {
  id: number;
  fieldId: number;
  operator: string;
  value: string;
};

function randomNum() {
  return Math.floor(Math.random() * 1000);
}

type CreateNewFilterProps = {
  fields: Field[] | undefined;
  filterMap: filterByObject[];
  setFilterMap: (filterMap: filterByObject[]) => void;
  viewId: number;
};

export function CreateNewFilter({
  fields,
  filterMap,
  setFilterMap,
  viewId,
}: CreateNewFilterProps) {
  const utils = api.useUtils();

  const createFilter = api.view.createFilter.useMutation({
    onMutate: async () => {
      await utils.view.getFilters.cancel();
    },
    onSuccess: async () => {
      await utils.view.getFilters.invalidate();
      await utils.cell.infiniteRows.invalidate();
    },
  });
  function createFilterHandler(fieldId: number) {
    setFilterMap([
      ...filterMap,
      { id: randomNum(), fieldId, operator: "contains", value: "" },
    ]);
    void createFilter.mutateAsync({
      fieldId,
      operator: "contains",
      value: "",
      viewId: viewId,
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="my-1 flex flex-row items-center justify-center gap-1 rounded-sm px-2 py-2 text-xs select-none hover:bg-gray-200">
          Add a new filter
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
          {fields?.map((f) => {
            return (
              <div
                key={`to-sort-${f.id}`}
                className="px-2 py-1 text-xs select-none hover:bg-gray-200"
                style={{ borderRadius: "2px" }}
                onClick={() => createFilterHandler(f.id)}
              >
                {f.name}
              </div>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
