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
import { CreateNewSort } from "./CreateNewSort";
import { SortedItem } from "./SortedItem";

type SorterButtonProps = {
  tableId: number;
  viewId: number;
  tableColumns: Field[];
};

type sortByObject = {
  id: number;
  fieldId: number;
  order: "asc" | "desc";
};

export function SorterButton({
  tableId,
  viewId,
  tableColumns,
}: SorterButtonProps) {
  const { data: fields } = api.table.getAllFields.useQuery({ tableId });
  const { data: sorts } = api.view.getSorts.useQuery({ viewId });
  const [sortMap, setSortMap] = useState<sortByObject[]>([]);

  useEffect(() => {
    if (sorts) {
      setSortMap(
        sorts.map((s) => ({
          id: s.id,
          fieldId: s.fieldId,
          order: s.order as "asc" | "desc",
        })),
      );
    }
  }, [sorts]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="my-1 flex flex-row items-center justify-center gap-1 rounded-sm px-2 text-xs select-none hover:bg-gray-200">
          <Image
            src="/hide-field.svg"
            alt="hideFieldIcon"
            width={15}
            height={15}
            draggable={false}
          />
          Sort
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel className="text-xs">Sort by</DropdownMenuLabel>
        <DropdownMenuGroup>
          {sortMap.map((sortItem) => {
            const field = fields?.find((f) => f.id === sortItem.fieldId);
            if (!field) return null;
            return (
              <SortedItem
                key={`sort-item-${field.id}`}
                field={field}
                sortMap={sortMap}
                setSortMap={setSortMap}
              />
            );
          })}
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <CreateNewSort
            viewId={viewId}
            fields={fields}
            sortMap={sortMap}
            setSortMap={setSortMap}
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
