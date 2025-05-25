import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "~/app/_components/ui/dropdown-menu";

import { Button } from "~/app/_components/ui/button"
import { Input } from "~/app/_components/ui/input"
import { useState } from "react";
import type { Table } from "@prisma/client"

type TableItemProps = {
    table: Table
    selectedTable: number | undefined | null;
    setSelectedTable: (id: number) => void
}

export function TableItem({ table, selectedTable, setSelectedTable }: TableItemProps) {
    const [tableName, setTableName] = useState(table.name);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <DropdownMenu open={isOpen} onOpenChange={(open) => {
            if (table.id !== selectedTable) return;
            setTableName(table.name);
            setIsOpen(open);
        }}>
        <DropdownMenuTrigger asChild>
            <div className={`${table.id === selectedTable ? 'bg-white px-6' : 'px-3 text-white'}  h-9 flex items-center justify-center text-sm select-none`}
                style={{ borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}
                onClick={() => {
                    if (table.id !== selectedTable) setSelectedTable(table.id)
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
                <div className="flex flex-row justify-between items-center">
                    <Button onClick={() => {
                        setIsOpen(false); 
                    }} className="w-15">
                        Delete
                    </Button>
                    <Button onClick={() => {
                        setIsOpen(false); 
                    }} className="w-15">
                        Save
                    </Button>
                </div>
            </div>
        </DropdownMenuContent>
    </DropdownMenu>
)
}