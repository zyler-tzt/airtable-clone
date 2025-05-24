"use client"

import type { Table } from "@prisma/client";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { api } from "~/trpc/react";

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

    const tableColumns: ColumnDef<RowData>[] = columns?.map((field) => ({
        accessorKey: field.name,
        header: field.name,
        cell: (value) => value.getValue(),
    })) ?? [];

    const table = useReactTable({
        data: rows ?? [],
        columns: tableColumns ?? [],
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div>
            <div className="sticky top-0 bg-gray-50 border-b border-gray-200">
                {table.getHeaderGroups().map((headerGroup) => (
                    <div key={headerGroup.id} className="flex">
                        {headerGroup.headers.map((header) => (
                            <div
                                key={header.id}
                                className="px-3 py-2 text-left border-r border-gray-200 last:border-r-0 bg-gray-50 flex-shrink-0"
                            >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}