import type { Prisma, View } from "@prisma/client";
import { TableItem } from "./tableItem";
import { TableAddButton } from "./tableAddIcon";

type BaseWithTables = Prisma.BaseGetPayload<{
  include: {
    tables: true;
  };
}>;

type BaseTableListProps = {
  base: BaseWithTables | undefined | null;
  selectedTable: number | undefined | null;
  setSelectedTable: (id: number) => void;
  setViewId: (id: number) => void;
  views: View[];
};

export function BaseTableList({
  base,
  selectedTable,
  setSelectedTable,
  setViewId,
  views,
}: BaseTableListProps) {
  return (
    <div className="flex flex-row bg-green-700 justify-between">
<div className="rounded-tr-md scrollbar-none h-[4vh] w-[88%] overflow-x-auto  whitespace-nowrap bg-green-800">
      {base && (
        <div className="flex h-[4vh] w-max flex-row items-center justify-center px-5">
          {base.tables.map((table) => {
            return (
              <TableItem
                views={views}
                key={table.id}
                setViewId={setViewId}
                table={table}
                allTables={base.tables}
                setSelectedTable={setSelectedTable}
                selectedTable={selectedTable}
              />
            );
          })}
          <TableAddButton
            baseId={base.id}
            setViewId={setViewId}
            setSelectedTable={setSelectedTable}
          />
        </div>
      )}
    </div>
    <div className="flex w-[11.5%] rounded-tl-md items-center justify-around flex-row bg-green-800">
      <div className="cursor-pointer text-sm text-white/90">
      Extensions
      </div>
      <div className="cursor-pointer text-sm text-white/90">
        Tools
      </div>
    </div>
    </div>
  );
}

export function EmptyBaseTableList() {
  return <div className="h-[4vh] w-full bg-green-800"></div>;
}
