import type { Prisma, View } from "@prisma/client"
import { TableItem } from "./tableItem";
import { TableAddButton } from "./tableAddIcon";

type BaseWithTables = Prisma.BaseGetPayload<{
  include: {
    tables: true
  }
}>

type BaseTableListProps = {
    base: BaseWithTables | undefined | null;
    selectedTable: number | undefined | null;
    setSelectedTable: (id: number) => void
    setViewId: (id: number) => void
    views: View[]
}

export function BaseTableList({ base, selectedTable, setSelectedTable, setViewId, views }: BaseTableListProps) {
    return (
        <div className="bg-green-800 h-[5vh] w-full overflow-x-auto whitespace-nowrap scrollbar-none">
            { base && <div className="flex flex-row px-5 h-9 w-max">
                {base.tables.map(table => {
                    return (
                        <TableItem views={views} key={table.id} setViewId={setViewId} table={table} setSelectedTable={setSelectedTable} selectedTable={selectedTable}/>
                    )
                })}
                <TableAddButton baseId={base.id} setViewId={setViewId} setSelectedTable={setSelectedTable} />
            </div>}
        </div>
        
    )
}

export function EmptyBaseTableList() {
    return (
        <div className="bg-green-800 h-[5vh] w-full">
        </div>
    )
}
 