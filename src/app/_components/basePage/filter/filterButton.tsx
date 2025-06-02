import type { Field } from "@prisma/client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import { api } from "~/trpc/react";
import { CreateNewFilter } from "./createNewFilter";
import { FilterItem } from "./filterItem";

type FiltererButtonProps = {
  tableId: number;
  viewId: number;
  tableColumns: Field[];
};

type filterByObject = {
  id: number;
  fieldId: number;
  operator: string;
  value: string;
};

export function FilterButton({ tableId, viewId }: FiltererButtonProps) {
  const { data: fields } = api.table.getAllFields.useQuery({ tableId });
  const { data: filters } = api.view.getFilters.useQuery({ viewId });
  const [filterMap, setFilterMap] = useState<filterByObject[]>([]);

  useEffect(() => {
    if (filters) {
      setFilterMap(
        filters.map((s) => ({
          id: s.id,
          fieldId: s.fieldId,
          operator: s.operator,
          value: s.value,
        })),
      );
    }
  }, [filters]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="my-1 flex flex-row items-center justify-center gap-1 rounded-sm px-2 text-xs select-none hover:bg-gray-200">
          <Image
            src="/filter.svg"
            alt="filterIcon"
            width={15}
            height={15}
            draggable={false}
          />
          Filter
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-100" align="start">
        <DropdownMenuLabel className="text-xs">Filter by</DropdownMenuLabel>
        <DropdownMenuGroup>
          {filterMap.map((filterItem) => {
            const field = fields?.find((f) => f.id === filterItem.fieldId);
            if (!field) return null;
            return (
              <FilterItem
                key={`Filter-item-${filterItem.id}`}
                filterId={filterItem.id}
                field={field}
                filterMap={filterMap}
                setFilterMap={setFilterMap}
              />
            );
          })}
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <CreateNewFilter
            viewId={viewId}
            fields={fields}
            filterMap={filterMap}
            setFilterMap={setFilterMap}
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
