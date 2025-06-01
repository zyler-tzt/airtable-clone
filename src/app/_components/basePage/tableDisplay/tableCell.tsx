import type { RowData } from "./tableDisplay";
import type { CellContext } from "@tanstack/react-table";
import { Input } from "../../ui/input";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";

interface TableCellProps {
    value: CellContext<RowData, unknown>,
    tableId: number,
}
export function TableCell({ value }: TableCellProps) {
    const rowId = value.row.original.id;
    const fieldId = parseInt(value.column.id);
    const rowIndex = value.row.index;
    const [isEditing, setIsEditing] = useState(false);


    const utils = api.useUtils();

    const [cellExist, setCellExist] = useState(value.getValue() ? true : false)
    const [cellValue, setCellValue] = useState(value.getValue())

    useEffect(() => {
        const newVal = value.getValue();
        setCellExist(!!newVal);
        setCellValue(newVal);
        console.log(value.getValue())
    }, [value.getValue()]);


    function parseValue(value: unknown) {
        if (value === undefined) {
            return ""
        } else {
            return (typeof value === "string" || typeof value === "number") ? String(value) : "";
        }
    }

    const deleteCell = api.cell.deleteCell.useMutation({
        onSuccess: async () => {
            setCellExist(false)
        },
    });

    const updateCell = api.cell.updateCell.useMutation({
    });


    const createCell = api.cell.createCell.useMutation({
            onSuccess: async () => {
                setCellExist(true)
            },
        });
    
    async function changeCellHandler() {
        const newVal = (parseValue(cellValue)).trim()
        if (newVal === "" && cellExist) await deleteCell.mutateAsync({ fieldId, rowId })
        if (!cellExist && newVal !== "") await createCell.mutateAsync({ value: newVal, fieldId, rowId }) 
        if (cellExist && newVal !== "") await updateCell.mutateAsync({ value: newVal, fieldId, rowId }) 
    }

    return (
        <Input 
            className="!text-xs rounded-none m-0 border-0 w-full h-full"
            id={`${rowId}-${fieldId}`}
            value={parseValue(cellValue)}
            readOnly={!isEditing}

            onChange={(e: { target: { value: unknown; }; }) => setCellValue(e.target.value)}
            onDoubleClick={() => setIsEditing(true)}
            onKeyDown={(e: { key: string; }) => {
                if (!isEditing && e.key !== "Enter" && e.key !== "Tab") {
                    setIsEditing(true);
                    setCellValue("")
                }
                if (e.key === 'Enter') {
                    const nextRow = value.table.getRowModel().rows[rowIndex + 1]
                    const nextRowId = nextRow?.original.id;
                    const nextInput = document.getElementById(`${nextRowId}-${value.column.id}`);

                    if (nextInput) {
                        nextInput.focus();
                    }
                }
            }}
            onBlur={() => {
                void changeCellHandler();
                setIsEditing(false)
            }}
        />
    )
}