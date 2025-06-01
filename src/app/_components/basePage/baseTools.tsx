import Image from "next/image";
import { HideShowButton } from "./showHide/hideShowButton";
import type { Field } from "@prisma/client";
import { SorterButton } from "./sorter/SorterButton";

type BaseToolsProps = {
  openView: boolean;
  openViewSetter: (newState: boolean) => void;
  tableId: number;
  viewId: number;
  setTableColumns: (newFields: Field[]) => void;
  tableColumns: Field[];
};

export function BaseTools({
  openView,
  openViewSetter,
  tableId,
  viewId,
  setTableColumns,
  tableColumns,
}: BaseToolsProps) {
  return (
    <div className="my-1 flex h-[5vh] flex-row justify-start gap-5 px-2 pl-3 text-xs shadow-sm">
      <div
        className="my-1 flex flex-row items-center justify-center gap-1 rounded-sm px-2 select-none hover:bg-gray-200"
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

      <div className="my-1 flex flex-row items-center justify-center gap-1 rounded-sm px-2 hover:bg-gray-200">
        <Image
          src="/filter.svg"
          alt="filterIcon"
          width={15}
          height={15}
          draggable={false}
        />
        Filter
      </div>

      <SorterButton
        tableColumns={tableColumns}
        tableId={tableId}
        viewId={viewId}
      />
    </div>
  );
}
