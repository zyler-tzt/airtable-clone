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
import { useRef } from "react";


type TableDataItemProps = {
  tableData: Table;
};

type RowData = {
  cells: {
    id: number;
    value: string;
    fieldId: number;
    rowId: number;
  }[];
  id: number;
  tableId: number;
};


export function TableData({ tableData }: TableDataItemProps) {

    const { data: columns } = api.table.getFields.useQuery({ tableId: tableData.id }); 
    const { data: rows } = api.table.getRowsWithCells.useQuery({ tableId: tableData.id });

    const tableColumns: ColumnDef<RowData>[] = [
        {
            id: 'rowNums',
            header: '#',
            cell: (info) => info.row.index + 1,
            size: 10,
        },
        ...columns?.map((field) => ({
            accessorKey: field.name,
            header: field.name,
            cell: (value: CellContext<RowData, unknown>) => value.getValue(),
        })) ?? [],
        {
            id: 'addCols',
            header: () => (
            <div
            >
                Add
            </div>
            ),
            cell: () => null,
            size: 30,
        },
    ];

    const table = useReactTable({
        data: rows ?? [],
        columns: tableColumns ?? [],
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const tableParentRef = useRef(null);

    const rowVirtualizer = useVirtualizer({
        count: rows === undefined ? 0 : rows.length,
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
                                className="px-3 py-2 text-left border-r border-gray-200 last:border-r-0 bg-gray-50 flex-shrink-0"
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
                            console.log(cell.column.id);
                            if (cell.column.id === "addCols") return null; 
                            return (
                                <div
                                    key={cell.id}
                                    className="px-3 py-2 border-b border-r border-gray-200  text-sm flex items-center flex-shrink-0 hover:bg-gray-50"
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