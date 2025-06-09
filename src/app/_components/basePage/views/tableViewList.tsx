import type { View } from "@prisma/client";
import { ViewAddButton } from "./addViewButton";
import Image from "next/image";
import { api } from "~/trpc/react";

type TableViewListProps = {
  tableId: number;
  viewData: View[] | undefined;
  currentViewId: number;
  setViewId: (id: number) => void;
  setViewData: (data: View[]) => void;
};

export function TableViewList({
  tableId,
  viewData,
  currentViewId,
  setViewId,
  setViewData,
}: TableViewListProps) {
  const utils = api.useUtils();

  const deleteView = api.view.deleteView.useMutation({
    onMutate: async () => {
      setViewId(viewData?.[0]?.id ?? -1);

      await utils.table.getTableByTableId.cancel();
    },
    onSuccess: async () => {
      await utils.table.getTableByTableId.invalidate();
    },
  });

  async function viewDeleteHandler(viewId: number, viewData: View[]) {
    setViewData(viewData.filter((v) => v.id != viewId));
    await deleteView.mutateAsync({ viewId });
  }

  return (
    <div className="flex h-[78vh] flex-col items-center p-2">
      <div className="flex h-14 w-[80%] items-center px-2 text-left text-sm select-none">
        Views
      </div>
      <div className="flex h-full w-full flex-col items-center gap-1 overflow-auto">
        {viewData?.map((v) => {
          return (
            <div
              key={`view-${v.id}`}
              className={`${currentViewId === v.id ? "bg-blue-200" : ""} justify-left flex w-[80%] cursor-pointer flex-row items-center text-sm select-none hover:bg-gray-200`}
              style={{ borderRadius: "4px" }}
              onClick={() => setViewId(v.id)}
            >
              <div className="flex w-[80%] flex-row gap-2 px-2 py-1">
                <Image
                  src="/grid.svg"
                  alt="gridIcon"
                  width={15}
                  height={15}
                  draggable={false}
                />
                {v.name}
              </div>

              <div
                className={`ml-auto rounded-full px-1 py-1 hover:border-1 hover:border-gray-400 ${viewData.length === 1 ? "hidden" : ""}`}
                onClick={() => viewDeleteHandler(v.id, viewData)}
              >
                <Image
                  src="/delete.svg"
                  alt="deleteIcon"
                  width={15}
                  height={15}
                  draggable={false}
                />
              </div>
            </div>
          );
        })}
      </div>
      <ViewAddButton tableId={tableId} setViewId={setViewId} />
    </div>
  );
}
