"use client"

import type { Table } from "@prisma/client";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import type { CellContext } from "@tanstack/react-table";

import { api } from "~/trpc/react";
import { useVirtualizer } from "@tanstack/react-virtual"
import { useEffect, useRef, useState } from "react";
import { TableCell } from "./tableCell";
import { AddFieldButton } from "./addFieldButton";
import { AddRowButton } from "./addRowButton";


type TableDataItemProps = {
  tableData: Table;
};

export type RowData = {
  cells: {
    id: number;
    value: string;
    fieldId: number;
    rowId: number;
  }[];
  id: number;
  tableId: number;
};

interface CustomColumnMeta {
  type?: string;
}

function classParser(meta?: CustomColumnMeta) {
    if (!meta) return "";
    if (meta.type === "text") {
        return "justify-start"
    } else if (meta.type === "number") {
        return "justify-end"
    } else if (meta.type === "id") {
        return "justify-center"
    }
}

export function TableDisplay({ tableData }: TableDataItemProps) {    
    const [extendedRows, setExtendedRows] = useState<RowData[]>([])

    const { data: columns } = api.table.getFields.useQuery({ tableId: tableData.id }); 
    const { data: rows } = api.table.getRowsWithCells.useQuery({ tableId: tableData.id });

    useEffect(() => {
        setExtendedRows(rows ? [...rows, { id: -1, tableId: tableData.id, cells: [] }] : [])
    }, [rows])

    const tableColumns: ColumnDef<RowData>[] = [
        {
            id: 'rowNums',
            header: '',
            cell: (info) => info.row.index + 1,
            meta: {type: 'id'},
            size: 40,
        },
        ...columns?.map((field) => ({
            id: String(field.id),
            accessorKey: field.name,
            header: () => {
                return (
                    <div className="w-full h-full px-3">{field.name}</div>
                )
            },
            meta: {type: field.type},
            cell: (value: CellContext<RowData, unknown>) => {
                return (
                    <TableCell value={value}/>
                )
            },
        })) ?? [],
        {
            id: 'addCols',
            header: () => {
                return (
                    <AddFieldButton tableId={tableData.id}/>
                )
            },
            cell: () => null,
            size: 40,
        },
    ];

    const table = useReactTable({
        data: extendedRows,
        columns: tableColumns ?? [],
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const tableParentRef = useRef(null);

    const rowVirtualizer = useVirtualizer({
        count: table.getRowModel().rows.length,
        getScrollElement: () => tableParentRef.current,
        estimateSize: () => 40, 
        overscan: 10, 
    })

    const virtualRows = table.getRowModel().rows;

    return (
        <div ref={tableParentRef}>
            <div className="sticky top-0 bg-gray-50 border border-gray-200">
                {table.getHeaderGroups().map((headerGroup) => (
                    <div key={headerGroup.id} className="flex">
                        {headerGroup.headers.map((header) => (
                            <div
                                key={header.id}
                                className={`py-2 border-r border-gray-200 last:border-r-0 bg-gray-50 flex-shrink-0`}
                                style={{ width: header.getSize() }}
                            >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div
                className="w-full relative border-l border-gray-200"
                style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                }}
            >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const row = virtualRows[virtualRow.index]
                    if (!row) return null;
                    return (
                    <div
                        key={row.id}
                        className={`w-full flex flex-row h-10 flex-shrink-0`}
                        style={{
                            height: `${virtualRow.size}px`,
                        }}
                    >
                        {row.getVisibleCells().map((cell) => {
                            if (cell.column.id === "addCols") return null; 
                            if (cell.row.original.id === -1 && cell.column.id != "rowNums") return null;
                            if (cell.row.original.id === -1) return (
                                <div key="addColButton" className={`border-b border-r border-gray-200 text-sm flex items-center justify-center flex-shrink-0 hover:bg-gray-50`}
                                    style={{ width: cell.column.getSize() }}>
                                    <AddRowButton key="rowAddButton" tableId={tableData.id} />
                                </div>
                            )
                            return (
                                <div
                                    key={cell.id}
                                    className={`border-b border-r border-gray-200  text-sm flex items-center flex-shrink-0 hover:bg-gray-50
                                    ${classParser(cell.column.columnDef.meta)}`}
                                    style={{ width: cell.column.getSize() }}
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </div>
                        )})
                    }
                    </div>
                )})}
            </div>
        </div>
    )
}