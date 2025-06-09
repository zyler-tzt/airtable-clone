import type { RowData } from "./tableDisplay";
import type { CellContext } from "@tanstack/react-table";
import { Input } from "../../ui/input";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";

interface TableCellProps {
  value: CellContext<RowData, unknown>;
  tableId: number;
  type: string;
}
export function TableCell({ value, type }: TableCellProps) {
  const rowId = value.row.original.id;
  const fieldId = parseInt(value.column.id);
  const rowIndex = value.row.index;
  const [isEditing, setIsEditing] = useState(false);

  const utils = api.useUtils();

  const [cellExist, setCellExist] = useState(value.getValue() ? true : false);
  const [cellValue, setCellValue] = useState(value.getValue());

  useEffect(() => {
    const newVal = value.getValue();
    setCellExist(!!newVal);
    setCellValue(newVal);
  }, [value.getValue()]);

  function parseValue(value: unknown) {
    if (value === undefined) {
      return "";
    } else {
      return typeof value === "string" || typeof value === "number"
        ? String(value)
        : "";
    }
  }

  const deleteCell = api.cell.deleteCell.useMutation({
    onSuccess: async () => {
      setCellExist(false);
    },
  });

  const updateCell = api.cell.updateCell.useMutation({});

  const createCell = api.cell.createCell.useMutation({
    onSuccess: async () => {
      setCellExist(true);
    },
  });

  async function changeCellHandler() {
    const newVal = parseValue(cellValue).trim();
    if (newVal === "" && cellExist)
      await deleteCell.mutateAsync({ fieldId, rowId });
    if (!cellExist && newVal !== "")
      await createCell.mutateAsync({ value: newVal, fieldId, rowId });
    if (cellExist && newVal !== "")
      await updateCell.mutateAsync({ value: newVal, fieldId, rowId });
  }

  return (
    <Input
      className="m-0 h-full w-full rounded-none border-0 !text-xs"
      id={`${rowId}-${fieldId}`}
      autoComplete="off"
      value={parseValue(cellValue)}
      readOnly={!isEditing}
      onChange={(e: { target: { value: unknown } }) => {
        if (type === "number") {
          if (/^\d*$/.test(String(e.target.value))) {
            setCellValue(e.target.value);
          } else {
            toast(
              <div className="text-xs">
                <span className="text-red-500">Invalid action: </span>
                <span>
                  You cannot make a non-number input in <b>Number</b> field
                </span>
              </div>,
              {},
            );
          }
        } else {
          setCellValue(e.target.value);
        }
      }}
      onDoubleClick={() => setIsEditing(true)}
      onKeyDown={(e: { key: string }) => {
        if (
          !isEditing &&
          e.key !== "Enter" &&
          e.key !== "Tab" &&
          e.key !== "ArrowLeft" &&
          e.key !== "ArrowUp" &&
          e.key !== "ArrowDown" &&
          e.key !== "ArrowRight"
        ) {
          setIsEditing(true);
          setCellValue("");
        }
        if (e.key === "Enter") {
          const nextRow = value.table.getRowModel().rows[rowIndex + 1];
          const nextRowId = nextRow?.original.id;
          const nextInput = document.getElementById(
            `${nextRowId}-${value.column.id}`,
          );

          if (nextInput) {
            nextInput.focus();
          }
        }
        if (e.key === "ArrowLeft") {
          const allColumns = value.table.getVisibleLeafColumns();
          const currentIndex = allColumns.findIndex(
            (col) => col.id === value.column.id,
          );
          const prevCol = allColumns[currentIndex - 1]?.id;
          const nextRow = value.table.getRowModel().rows[rowIndex];
          const nextRowId = nextRow?.original.id;
          const nextInput = document.getElementById(`${nextRowId}-${prevCol}`);

          if (nextInput) {
            nextInput.focus();
          }
        }
        if (e.key === "ArrowRight") {
          const allColumns = value.table.getVisibleLeafColumns();
          const currentIndex = allColumns.findIndex(
            (col) => col.id === value.column.id,
          );
          console.log(currentIndex);
          const prevCol = allColumns[currentIndex + 1]?.id;
          const nextRow = value.table.getRowModel().rows[rowIndex];
          const nextRowId = nextRow?.original.id;
          const nextInput = document.getElementById(`${nextRowId}-${prevCol}`);

          if (nextInput) {
            nextInput.focus();
          }
        }
        if (e.key === "ArrowDown") {
          const nextRow = value.table.getRowModel().rows[rowIndex + 1];
          const nextRowId = nextRow?.original.id;
          const nextInput = document.getElementById(
            `${nextRowId}-${value.column.id}`,
          );

          if (nextInput) {
            nextInput.focus();
          }
        }
        if (e.key === "ArrowUp") {
          const nextRow = value.table.getRowModel().rows[rowIndex - 1];
          const nextRowId = nextRow?.original.id;
          const nextInput = document.getElementById(
            `${nextRowId}-${value.column.id}`,
          );

          if (nextInput) {
            nextInput.focus();
          }
        }
      }}
      onBlur={() => {
        void changeCellHandler();
        setIsEditing(false);
      }}
    />
  );
}
