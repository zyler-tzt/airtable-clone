import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "~/app/_components/ui/dropdown-menu";

import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { useEffect, useState } from "react";
import type { Table, View } from "@prisma/client";
import { api } from "~/trpc/react";

type TableItemProps = {
  table: Table;
  allTables: Table[];
  selectedTable: number | undefined | null;
  setSelectedTable: (id: number) => void;
  setViewId: (id: number) => void;
  views: View[];
};

export function TableItem({
  table,
  allTables,
  selectedTable,
  setSelectedTable,
  setViewId,
  views,
}: TableItemProps) {
  const [tableName, setTableName] = useState(table.name);
  const [isOpen, setIsOpen] = useState(false);

  const utils = api.useUtils();

  const deleteTable = api.table.deleteTable.useMutation({
    onSuccess: async () => {
      await utils.base.invalidate();
      setSelectedTable(allTables?.[0]?.id ?? -1);
    },
  });

  const updateTable = api.table.updateTable.useMutation({
    onSuccess: async () => {
      await utils.base.invalidate();
    },
  });

  useEffect(() => {
    if (selectedTable === table.id) {
      setViewId(views?.[0]!.id);
    }
  }, [selectedTable]);

  async function deleteTableHandler() {
    await deleteTable.mutateAsync({ tableId: table.id });
  }

  async function updateTableHandler() {
    await updateTable.mutateAsync({ tableId: table.id, name: tableName });
  }

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={(open) => {
        if (table.id !== selectedTable) return;
        setTableName(table.name);
        setIsOpen(open);
      }}
    >
      <DropdownMenuTrigger asChild>
        <div
          className={`${table.id === selectedTable ? "bg-white px-6" : "px-3 text-white"} flex h-full cursor-pointer items-center justify-center text-xs select-none`}
          style={{ borderTopLeftRadius: "4px", borderTopRightRadius: "4px" }}
          onClick={() => {
            if (table.id !== selectedTable) {
              setSelectedTable(table.id);
            }
          }}
        >
          {table.name}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-4">
        <div className="flex flex-col gap-4">
          <DropdownMenuLabel>Change Table Name</DropdownMenuLabel>
          <Input
            placeholder="Column name"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
          />
          <div className="flex flex-row items-center justify-between">
            <Button
              onClick={async () => {
                setIsOpen(false);
                await deleteTableHandler();
              }}
              className={`w-15 cursor-pointer select-none`}
              disabled={allTables.length === 1}
            >
              Delete
            </Button>
            <Button
              onClick={async () => {
                setIsOpen(false);
                await updateTableHandler();
              }}
              className="w-15 cursor-pointer select-none"
            >
              Save
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
