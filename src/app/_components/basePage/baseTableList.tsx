import type { Prisma } from "@prisma/client"
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
}

export function BaseTableList({ base, selectedTable, setSelectedTable }: BaseTableListProps) {
    return (
        <div className="bg-green-800 h-9 w-full overflow-x-auto whitespace-nowrap scrollbar-none">
            { base && <div className="flex flex-row px-5 h-9 w-max">
                {base.tables.map(table => {
                    return (
                        <TableItem key={table.id} table={table} setSelectedTable={setSelectedTable} selectedTable={selectedTable}/>
                    )
                })}
                <TableAddButton baseId={base.id} setSelectedTable={setSelectedTable} />
            </div>}
        </div>
        
    )
}