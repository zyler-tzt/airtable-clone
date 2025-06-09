"use client";

import type { Table, Field } from "@prisma/client";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import type { CellContext } from "@tanstack/react-table";

import { api } from "~/trpc/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useMemo } from "react";
import { TableCell } from "~/app/_components/basePage/tableDisplay/tableCell";
import { AddFieldButton } from "~/app/_components/basePage/tableDisplay/addFieldButton";
import { AddRowButton } from "~/app/_components/basePage/tableDisplay/addRowButton";
import { Button } from "../../ui/button";

type TableDataItemProps = {
  tableData: Table;
  viewId: number;
  columns: Field[];
  searchInput: string;
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

type ExtendedRowData =
  | RowData
  | {
      id: number;
      tableId: number;
      cells: never[];
    };

interface CustomColumnMeta {
  type?: string;
}

function classParser(meta?: CustomColumnMeta) {
  if (!meta) return "";
  if (meta.type === "text") {
    return "text-left";
  } else if (meta.type === "number") {
    return "text-right";
  } else if (meta.type === "id") {
    return "justify-center";
  }
}

export function TableDisplay({
  columns,
  tableData,
  viewId,
  searchInput,
}: TableDataItemProps) {
  const {
    data: infiniteRowsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = api.cell.infiniteRows.useInfiniteQuery(
    { tableId: tableData.id, viewId, searchInput },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const utils = api.useUtils();

  const allRows = useMemo(() => {
    if (!infiniteRowsData) return [];
    return infiniteRowsData.pages.flatMap((page) => page.rows);
  }, [infiniteRowsData]);

  const extendedRows = useMemo(() => {
    return [...allRows, { id: -1, tableId: tableData.id, cells: [] }];
  }, [allRows, tableData.id]);

  const tableColumns: ColumnDef<ExtendedRowData>[] = [
    {
      id: "rowNums",
      header: "",
      cell: (info) => <div className="text-xs">{info.row.index + 1}</div>,
      meta: { type: "id" },
      size: 60,
    },
    ...(columns
      ?.slice()
      .sort((a, b) => a.id - b.id)
      .map((field) => ({
        id: String(field.id),
        accessorFn: (row: ExtendedRowData) => {
          if (row.id === -1) return "";
          return row.cells.find((c) => c.fieldId === field.id)?.value ?? "";
        },
        header: () => {
          return (
            <div className="flex h-full w-full items-center px-3">
              <span className="truncate">{field.name}</span>
            </div>
          );
        },
        meta: { type: field.type },
        cell: (value: CellContext<ExtendedRowData, unknown>) => {
          return (
            <TableCell type={field.type} value={value} tableId={tableData.id} />
          );
        },
      })) ?? []),
    {
      id: "addCols",
      header: () => {
        return <AddFieldButton tableId={tableData.id} />;
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

  const tableParentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => tableParentRef.current,
    estimateSize: () => 30,
    overscan: 10,
  });

  useEffect(() => {
    const virtualItems = rowVirtualizer.getVirtualItems();
    if (!virtualItems.length) return;

    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;

    if (
      lastItem.index >= allRows.length - 1000 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      void fetchNextPage();
    }
  }, [
    rowVirtualizer.getVirtualItems(),
    allRows.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  const virtualRows = table.getRowModel().rows;

  const fakerFieldMapper = columns?.map((c) => ({
    fieldId: c.id,
    fieldType: c.type,
  }));

  const create100kRows = api.cell.create1kRows.useMutation({
    onSuccess: async () => {
      await utils.cell.infiniteRows.invalidate({ tableId: tableData.id });
    },
  });

  async function create100kRowsHandler() {
    await create100kRows.mutateAsync({
      fieldInfo: fakerFieldMapper ?? [],
      tableId: tableData.id,
    });
  }

  if (isLoading || !columns) {
    return (
      <div className="p-5 text-sm text-gray-500">
        Please wait while we fetch your view :D
      </div>
    );
  }

  return (
    <div className="text-xs">
      <div className="sticky top-0 border border-gray-200 bg-gray-50">
        {table.getHeaderGroups().map((headerGroup) => (
          <div key={headerGroup.id} className="flex">
            {headerGroup.headers.map((header) => (
              <div
                key={header.id}
                className={`flex h-7 flex-shrink-0 items-center justify-center border-r border-gray-200 bg-gray-50 py-2 text-xs last:border-r-0`}
                style={{ width: header.getSize() }}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div
        ref={tableParentRef}
        className="h-[68vh] w-full overflow-auto border-l border-gray-200"
      >
        <div
          className="relative w-full"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = virtualRows[virtualRow.index];
            if (!row) return null;
            return (
              <div
                key={row.id}
                className={`absolute top-0 left-0 flex w-full`}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {row.getVisibleCells().map((cell) => {
                  if (cell.column.id === "addCols") return null;
                  if (
                    cell.row.original.id === -1 &&
                    cell.column.id != "rowNums"
                  )
                    return null;
                  if (cell.row.original.id === -1)
                    return (
                      <div
                        key="addColButton"
                        className={`flex flex-shrink-0 items-center justify-center border-r border-b border-gray-200 text-sm hover:bg-gray-50`}
                        style={{ width: cell.column.getSize() }}
                      >
                        <AddRowButton
                          key="rowAddButton"
                          tableId={tableData.id}
                        />
                      </div>
                    );
                  return (
                    <div
                      key={cell.id}
                      className={`flex items-center border-r border-b border-gray-200 text-sm hover:bg-gray-50 ${classParser(cell.column.columnDef.meta)}`}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <Button
        variant="outline"
        className="fixed right-8 bottom-6"
        onClick={create100kRowsHandler}
      >
        Add 10k Rows
      </Button>
    </div>
  );
}
