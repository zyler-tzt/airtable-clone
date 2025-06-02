import type { Field } from "@prisma/client";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { api } from "~/trpc/react";

type sortByObject = {
  id: number;
  fieldId: number;
  order: "asc" | "desc";
};

type SortedItemProps = {
  sortMap: sortByObject[];
  setSortMap: (sortMap: sortByObject[]) => void;
  field: Field;
};

export function SortedItem({ field, sortMap, setSortMap }: SortedItemProps) {
  const utils = api.useUtils();

  const deleteSort = api.view.deleteSort.useMutation({
    onMutate: async () => {
      await utils.view.getSorts.cancel();
    },
    onSuccess: async () => {
      await utils.view.getSorts.invalidate();
      await utils.cell.infiniteRows.invalidate();
    },
  });

  async function deleteSortHandler() {
    const sort = sortMap.find((s) => s.fieldId === field.id);
    if (sort) {
      const newMap = sortMap.filter((s) => s.fieldId != field.id);
      setSortMap(newMap);
      await deleteSort.mutateAsync({ sorterId: sort.id });
    }
  }

  const modifySorter = api.view.modifySort.useMutation({
    onMutate: async () => {
      await utils.view.getSorts.cancel();
    },
    onSuccess: async () => {
      await utils.view.getSorts.invalidate();
      await utils.cell.infiniteRows.invalidate();
    },
  });

  async function modifySorterHandler(sorterId: number, newOrder: string) {
    await modifySorter.mutateAsync({ sorterId, newOrder });
  }

  return (
    <div className="mb-2 flex flex-row items-center justify-around text-xs">
      <div className="w-[20%]">{field.name}</div>
      <div className="w-[50%]">
        <Select
          value={sortMap
            .find((s) => s.fieldId === field.id)
            ?.order.toUpperCase()}
          onValueChange={async (newValue) => {
            const newMap = sortMap.slice();
            const sortChange = newMap.find((s) => s.fieldId === field.id);
            if (sortChange) {
              sortChange.order = newValue as "asc" | "desc";
              setSortMap(newMap);
              await modifySorterHandler(sortChange.id, newValue);
            }
          }}
        >
          <SelectTrigger className="w-full text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="ASC" className="text-xs">
                ASC
              </SelectItem>
              <SelectItem value="DESC" className="text-xs">
                DESC
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div
        className="flex w-[15%] items-center justify-center rounded-md p-[3px] hover:border-1"
        onClick={deleteSortHandler}
      >
        <Image
          src="/delete.svg"
          alt="airtableLogo"
          draggable={false}
          width={18}
          height={18}
        />
      </div>
    </div>
  );
}
