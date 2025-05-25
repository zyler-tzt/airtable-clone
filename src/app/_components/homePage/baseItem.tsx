"use client"

import type { Base } from '@prisma/client';
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog"
import { api } from "~/trpc/react";

import { Button } from "~/app/_components/ui/button"
import { Input } from "~/app/_components/ui/input"
import { Label } from "~/app/_components/ui/label"
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type BaseItemProps = {
  base: Base;
};

export function BaseItem({ base }: BaseItemProps) {
    const router = useRouter();
    return (
        <div className="flex flex-row border-2 border-gray-300 rounded-lg items-center justify-start pl-5 h-50" onClick={() => router.push(`/${base.slug}`)}>
            <div>
                <Image
                    src="/airtable-base.png"
                    alt="airtableBaseImg"
                    draggable={false}
                    width={96}         
                    height={96}  
                />                
            </div>
            <div className='flex flex-col gap-4 pl-5'>
                <div className='text-lg'>
                    {base.name}
                </div>
                <div className="text-sm text-gray-500">
                    Base
                </div>
            </div>
        </div>
    )
}

export function CreateBaseItem() {
    const [open, setOpen] = useState(false)
    const [newBaseName, setNewBaseName] = useState("")
    const utils = api.useUtils();


    const createBase = api.base.create.useMutation({
        onSuccess: async () => {
            await utils.base.invalidate();
            setOpen(false)
        },
    });

    async function baseCreateHandler() {
        const name = newBaseName.trim() === "" ? "Untitled Base" : newBaseName
        await createBase.mutateAsync({ name }) 
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className='flex items-center justify-center border-2 border-gray-300 rounded-lg h-50'>
                    <Image 
                        src="/add-lucide.svg"
                        alt="addBaseIcon"
                        draggable={false}
                        width={40}         
                        height={40} 
                    />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Create a new base</DialogTitle>
                <DialogDescription>
                    Enter a name for your base
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                    Name
                    </Label>
                    <Input
                    id="name"
                    className="col-span-3"
                    onChange={(e) => setNewBaseName(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            void baseCreateHandler();
                        }
                    }}
                    disabled={createBase.isPending}
                    />
                </div>
                </div>
                <DialogFooter>
                    <Button onClick={baseCreateHandler} disabled={createBase.isPending}>
                    Create Base
                </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}