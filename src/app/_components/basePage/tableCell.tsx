import type { RowData } from "./tableDisplay";
import type { CellContext } from "@tanstack/react-table";
import { Input } from "../ui/input";

interface TableCellProps {
    value: CellContext<RowData, unknown>
}
export function TableCell({ value }: TableCellProps) {
    const rowId = value.row.original.id;
    const columnId = value.column.id;

    return (
        <Input 
            className="rounded-none m-0 border-0 w-full h-full"
            id={`${rowId}-${columnId}`}
            value={value.getValue() as string}
        />
    )
}