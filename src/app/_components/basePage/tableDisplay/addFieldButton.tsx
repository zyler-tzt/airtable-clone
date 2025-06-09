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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";

type AddFieldButtonProps = {
  tableId: number;
};

export function AddFieldButton({ tableId }: AddFieldButtonProps) {
  const [open, setOpen] = useState(false);
  const [newFieldName, setNewFieldName] = useState("New Field");
  const [newFieldType, setnewFieldType] = useState("text");
  const utils = api.useUtils();

  const createField = api.table.createField.useMutation({
    onSuccess: async () => {
      await utils.table.invalidate();
      setOpen(false);
    },
  });

  async function tableCreateHandler() {
    const name = newFieldName.trim() === "" ? "New Table" : newFieldName;
    await createField.mutateAsync({
      tableId,
      fieldName: name,
      fieldType: newFieldType,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex h-full w-full cursor-pointer items-center justify-center py-1.5 select-none">
          <Image
            src="/add-lucide3.svg"
            alt="addFieldIcon"
            draggable={false}
            width={20}
            height={20}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new field</DialogTitle>
          <DialogDescription>Enter details of the new field</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Field Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              onChange={(e) => setNewFieldName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  void tableCreateHandler();
                }
              }}
              disabled={createField.isPending}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Field Type
            </Label>
            <Select
              value={newFieldType}
              onValueChange={(value) => setnewFieldType(value)}
            >
              <SelectTrigger className="sm:max-w-[425px]">
                <SelectValue placeholder="Select Field Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Field Type</SelectLabel>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={tableCreateHandler} disabled={createField.isPending}>
            Create Field
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
