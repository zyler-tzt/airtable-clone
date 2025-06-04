"use client";
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

type ViewAddButtonProps = {
  tableId: number;
  setViewId: (id: number) => void;
};

export function ViewAddButton({ tableId, setViewId }: ViewAddButtonProps) {
  const [open, setOpen] = useState(false);
  const [newViewName, setNewViewName] = useState("");
  const utils = api.useUtils();

  const createView = api.view.createView.useMutation({
    onSuccess: async (newView) => {
      await utils.table.invalidate();
      setOpen(false);
      setViewId(newView.id);
    },
  });

  async function viewCreateHandler() {
    const name = newViewName.trim() === "" ? "New View" : newViewName;
    await createView.mutateAsync({ name, tableId });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-auto w-[80%] bg-green-700 py-0 text-sm">
          Create new view
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new view</DialogTitle>
          <DialogDescription>Enter a name for your view</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              View Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              onChange={(e) => setNewViewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  void viewCreateHandler();
                }
              }}
              disabled={createView.isPending}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={viewCreateHandler} disabled={createView.isPending}>
            Create View
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
