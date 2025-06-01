"use client";
import Image from "next/image";

import { api } from "~/trpc/react";

type AddRowButtonProps = {
  tableId: number;
};

export function AddRowButton({ tableId }: AddRowButtonProps) {
  const utils = api.useUtils();

  const createRow = api.table.createRow.useMutation({
    onSuccess: async () => {
      await utils.cell.invalidate();
    },
  });

  async function rowCreateHandler() {
    await createRow.mutateAsync({ tableId });
  }

  return (
    <div
      className="flex items-center justify-center select-none"
      onClick={rowCreateHandler}
    >
      <Image
        src="/add-lucide3.svg"
        alt="addRowIcon"
        draggable={false}
        width={20}
        height={20}
      />
    </div>
  );
}
