import Image from "next/image";
import { HideShowButton } from "./showHide/hideShowButton";
import type { Field } from "@prisma/client";
import { SorterButton } from "./sorter/SorterButton";
import { FilterButton } from "./filter/filterButton";
import { SearchBox } from "./search/searchBox";

type BaseToolsProps = {
  openView: boolean;
  openViewSetter: (newState: boolean) => void;
  tableId: number;
  viewId: number;
  setTableColumns: (newFields: Field[]) => void;
  tableColumns: Field[];
  setSearchInput: (search: string) => void;
};

export function BaseTools({
  openView,
  openViewSetter,
  tableId,
  viewId,
  setTableColumns,
  tableColumns,
  setSearchInput,
}: BaseToolsProps) {
  return (
    <div className="flex h-[6vh] flex-row items-center justify-start gap-5 border-b-1 px-2 py-2 pl-3 text-xs shadow-sm">
      <div
        className="my-1 flex cursor-pointer flex-row items-center justify-center gap-1 rounded-sm px-2 py-2 select-none hover:bg-gray-200"
        onClick={() => openViewSetter(!openView)}
      >
        <Image
          src="/views.svg"
          alt="viewIcon"
          width={15}
          height={15}
          draggable={false}
        />
        Views
      </div>

      <HideShowButton
        tableColumns={tableColumns}
        setTableColumns={setTableColumns}
        tableId={tableId}
        viewId={viewId}
      />

      <FilterButton
        tableColumns={tableColumns}
        tableId={tableId}
        viewId={viewId}
      />

      <SorterButton
        tableColumns={tableColumns}
        tableId={tableId}
        viewId={viewId}
      />

      <SearchBox setSearchInput={setSearchInput}></SearchBox>
    </div>
  );
}
