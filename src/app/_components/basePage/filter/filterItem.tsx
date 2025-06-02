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
import { Input } from "../../ui/input";

type filterByObject = {
  id: number;
  fieldId: number;
  operator: string;
  value: string;
};

type FilterItemProps = {
  filterMap: filterByObject[];
  setFilterMap: (filterMap: filterByObject[]) => void;
  field: Field;
  filterId: number;
};

export function FilterItem({
  field,
  filterMap,
  setFilterMap,
  filterId,
}: FilterItemProps) {
  const utils = api.useUtils();

  const deleteFilter = api.view.deleteFilter.useMutation({
    onMutate: async () => {
      await utils.view.getFilters.cancel();
    },
    onSuccess: async () => {
      await utils.view.getFilters.invalidate();
      await utils.cell.infiniteRows.invalidate();
    },
  });

  const modifyValueFilter = api.view.modifyValueFilter.useMutation({
    onMutate: async () => {
      await utils.view.getFilters.cancel();
    },
    onSuccess: async () => {
      await utils.view.getFilters.invalidate();
      await utils.cell.infiniteRows.invalidate();
    },
  });

  const modifyOperatorFilter = api.view.modifyOperatorFilter.useMutation({
    onMutate: async () => {
      await utils.view.getFilters.cancel();
    },
    onSuccess: async () => {
      await utils.view.getFilters.invalidate();
      await utils.cell.infiniteRows.invalidate();
    },
  });

  async function deleteFilterHandler() {
    const newMap = filterMap.filter((s) => s.id != filterId);
    setFilterMap(newMap);
    await deleteFilter.mutateAsync({ filterId: filterId });
  }

  async function modifyValueFilterHandler(newValue: string) {
    await modifyValueFilter.mutateAsync({ filterId: filterId, newValue });
  }

  async function modifyOperatorFilterHandler(newValue: string) {
    await modifyOperatorFilter.mutateAsync({
      filterId: filterId,
      newValue: newValue.split(" ").join("_"),
    });
  }

  return (
    <div className="mb-2 flex flex-row items-center justify-around text-xs">
      <div className="w-[20%]">{field.name}</div>
      <div className="w-[30%]">
        <Select
          value={filterMap
            .find((s) => s.id === filterId)
            ?.operator.split("_")
            .join(" ")}
          onValueChange={async (newValue) => {
            const newMap = filterMap.slice();
            const filterChange = newMap.find((s) => s.id === filterId);
            if (filterChange) {
              filterChange.operator = newValue.split(" ").join("_");
            }
            setFilterMap(newMap);
            await modifyOperatorFilterHandler(newValue);
          }}
        >
          <SelectTrigger className="w-full text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="contains" className="text-xs">
                contains...
              </SelectItem>
              <SelectItem value="does not contain" className="text-xs">
                does not contain...
              </SelectItem>
              <SelectItem value="is" className="text-xs">
                is...
              </SelectItem>
              <SelectItem value="is not" className="text-xs">
                is not...
              </SelectItem>
              <SelectItem value="is empty" className="text-xs">
                is empty...
              </SelectItem>
              <SelectItem value="is not empty" className="text-xs">
                is not empty...
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Input
        value={filterMap.find((s) => s.id === filterId)?.value}
        className="w-[25%] text-xs"
        onChange={async (e) => {
          const newMap = filterMap.slice();
          const filterChange = newMap.find((s) => s.id === filterId);
          if (filterChange) {
            filterChange.value = e.target.value;
          }
          setFilterMap(newMap);
          await modifyValueFilterHandler(e.target.value);
        }}
      />
      <div
        className="flex w-[15%] items-center justify-center rounded-md p-[3px] hover:border-1"
        onClick={deleteFilterHandler}
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
