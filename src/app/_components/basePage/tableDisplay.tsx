"use client"

import type { Table } from "@prisma/client"
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender, type ColumnDef } from "@tanstack/react-table"
import type { CellContext } from "@tanstack/react-table"

import { api } from "~/trpc/react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useEffect, useRef, useMemo } from "react"
import { TableCell } from "./tableCell"
import { AddFieldButton } from "./addFieldButton"
import { AddRowButton } from "./addRowButton"
import { Button } from "../ui/button"

type TableDataItemProps = {
  tableData: Table
}

export type RowData = {
  cells: {
    id: number
    value: string
    fieldId: number
    rowId: number
  }[]
  id: number
  tableId: number
}

type ExtendedRowData =
  | RowData
  | {
      id: number
      tableId: number
      cells: never[]
    }

interface CustomColumnMeta {
  type?: string
}

function classParser(meta?: CustomColumnMeta) {
  if (!meta) return ""
  if (meta.type === "text") {
    return "text-left"
  } else if (meta.type === "number") {
    return "text-right"
  } else if (meta.type === "id") {
    return "justify-center"
  }
}

export function TableDisplay({ tableData }: TableDataItemProps) {
  const { data: columns } = api.table.getFields.useQuery({ tableId: tableData.id })

  const {
    data: infiniteRowsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = api.cell.infiniteRows.useInfiniteQuery(
    { tableId: tableData.id },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )

  const utils = api.useUtils()

  const allRows = useMemo(() => {
    if (!infiniteRowsData) return []
    return infiniteRowsData.pages.flatMap((page) => page.rows)
  }, [infiniteRowsData])

  const extendedRows = useMemo(() => {
    return [...allRows, { id: -1, tableId: tableData.id, cells: [] }]
  }, [allRows, tableData.id])

  const tableColumns: ColumnDef<ExtendedRowData>[] = [
    {
      id: "rowNums",
      header: "",
      cell: (info) => info.row.index + 1,
      meta: { type: "id" },
      size: 60,
    },
    ...(columns?.map((field) => ({
      id: String(field.id),
      accessorFn: (row: ExtendedRowData) => {
        if (row.id === -1) return ""
        return row.cells.find((c) => c.fieldId === field.id)?.value ?? ""
      },
      header: () => {
        return <div className="w-full h-full px-3">{field.name}</div>
      },
      meta: { type: field.type },
      cell: (value: CellContext<ExtendedRowData, unknown>) => {
        return <TableCell value={value} />
      },
    })) ?? []),
    {
      id: "addCols",
      header: () => {
        return <AddFieldButton tableId={tableData.id} />
      },
      cell: () => null,
      size: 40,
    },
  ]

  const table = useReactTable({
    data: extendedRows,
    columns: tableColumns ?? [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const tableParentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => tableParentRef.current,
    estimateSize: () => 40,
    overscan: 10,
  })

  useEffect(() => {
    const virtualItems = rowVirtualizer.getVirtualItems()
    if (!virtualItems.length) return

    const lastItem = virtualItems[virtualItems.length - 1]
    if (!lastItem) return

    if (
      lastItem.index >= allRows.length - 1000 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      void fetchNextPage()
    }
  }, [rowVirtualizer.getVirtualItems(), allRows.length, hasNextPage, isFetchingNextPage, fetchNextPage])

  const virtualRows = table.getRowModel().rows

  const fakerFieldMapper = columns?.map((c) => ({ fieldId: c.id, fieldType: c.type }))

  const create100kRows = api.cell.create1kRows.useMutation({
    onSuccess: async () => {
      await utils.table.getRowsWithCells.invalidate({ tableId: tableData.id })
    },
  })

  async function create100kRowsHandler() {
    await create100kRows.mutateAsync({ fieldInfo: fakerFieldMapper ?? [], tableId: tableData.id })
  }

  if (isLoading || !columns) {
    return <div className="text-xl text-gray-500">Please wait while we fetch your base :D</div>
  }

  return (
    <div>
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
      <div ref={tableParentRef} className="h-[68vh] w-full overflow-auto border-l border-gray-200">
        <div
          className="relative w-full"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = virtualRows[virtualRow.index]
            if (!row) return null
            return (
              <div
                key={row.id}
                className={`absolute top-0 left-0 w-full flex`}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {row.getVisibleCells().map((cell) => {
                  if (cell.column.id === "addCols") return null
                  if (cell.row.original.id === -1 && cell.column.id != "rowNums") return null
                  if (cell.row.original.id === -1)
                    return (
                      <div
                        key="addColButton"
                        className={`border-b border-r border-gray-200 text-sm flex items-center justify-center flex-shrink-0 hover:bg-gray-50`}
                        style={{ width: cell.column.getSize() }}
                      >
                        <AddRowButton key="rowAddButton" tableId={tableData.id} />
                      </div>
                    )
                  return (
                    <div
                      key={cell.id}
                      className={`border-b border-r border-gray-200  text-sm flex items-center hover:bg-gray-50
                                    ${classParser(cell.column.columnDef.meta)}`}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
      <Button variant="outline" className="fixed bottom-6 right-8" onClick={create100kRowsHandler}>
        Add 10k Rows
      </Button>
    </div>
  )
}
