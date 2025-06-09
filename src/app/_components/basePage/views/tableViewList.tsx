import type { View } from "@prisma/client";
import { ViewAddButton } from "./addViewButton";
import Image from "next/image";

type TableViewListProps = {
  tableId: number;
  viewData: View[] | undefined;
  currentViewId: number;
  setViewId: (id: number) => void;
};

export function TableViewList({
  tableId,
  viewData,
  currentViewId,
  setViewId,
}: TableViewListProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-2">
      <div className="flex h-[7%] w-[80%] items-center px-2 text-left text-sm select-none">
        Views
      </div>
      <div className="flex h-[80%] w-full flex-1 flex-col items-center gap-1 overflow-auto">
        {viewData?.map((v) => {
          return (
            <div
              key={`view-${v.id}`}
              className={`${currentViewId === v.id ? "bg-blue-200" : ""} flex w-[80%] flex-row items-center justify-start gap-2 px-2 py-1 text-sm select-none hover:bg-gray-200`}
              style={{ borderRadius: "4px" }}
              onClick={() => setViewId(v.id)}
            >
              <Image
                src="/grid.svg"
                alt="gridIcon"
                width={15}
                height={15}
                draggable={false}
              />
              {v.name}
            </div>
          );
        })}
      </div>
      <ViewAddButton tableId={tableId} setViewId={setViewId} />
    </div>
  );
}
