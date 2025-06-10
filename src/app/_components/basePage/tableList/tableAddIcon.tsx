"use client";
import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";

import { api } from "~/trpc/react";

import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";

type TableAddButtonProps = {
  baseId: number;
  setSelectedTable: (id: number) => void;
  setViewId: (id: number) => void;
};

export function TableAddButton({
  baseId,
  setSelectedTable,
  setViewId,
}: TableAddButtonProps) {
  const [open, setOpen] = useState(false);
  const [newTableName, setNewTableName] = useState("");
  const utils = api.useUtils();

  const createTable = api.table.create.useMutation({
    onSuccess: async (newTable) => {
      setOpen(false);
      setSelectedTable(newTable!.id);
      setViewId(newTable!.view?.[0]!.id);
      await utils.base.invalidate();
      await utils.table.invalidate();
    },
  });

  async function tableCreateHandler() {
    const name = newTableName.trim() === "" ? "New Table" : newTableName;
    await createTable.mutateAsync({ name, baseId });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="text-xs text-white/80 hover:text-white/100 flex cursor-pointer items-center justify-center p-5 select-none">
          <Image
            src="/add-lucide2.svg"
            alt="addTableIcon"
            draggable={false}
            width={20}
            height={20}
          />
          Add or import
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new table</DialogTitle>
          <DialogDescription>Enter a name for your table</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Table Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              onChange={(e) => setNewTableName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  void tableCreateHandler();
                }
              }}
              disabled={createTable.isPending}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={tableCreateHandler}
            disabled={createTable.isPending}
            className="cursor-pointer"
          >
            Create Table
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
