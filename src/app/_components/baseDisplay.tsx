"use client"
import { api } from "~/trpc/react";
import { useParams } from "next/navigation"
import { TableData } from "./tableData";

export function BaseDisplay() {
    const { base: slug } = useParams()

    const { data: base, isLoading: isBaseLoading } = api.base.getBaseBySlug.useQuery({ slug: slug as string });

    const { data: table, isLoading: isTableLoading } = api.base.getFirstTableByBaseId.useQuery({ baseId: base ? base.id : -1}) ;

    if (isBaseLoading || isTableLoading) {
        <div> Loading </div>
    }

    return (
        <div className='flex flex-col'>
            <div className="bg-green-700">
                Untitled Base
            </div>
            <div className='bg-green-800'>
                Table 1
            </div>
            <div>
                Tools
            </div>
            <div className='flex flex-row'>
                <div>
                    View
                </div>
                <div>
                    {
                        table ? <TableData tableData={table} /> : <div></div>
                    }
                </div>
            </div>
        </div>
    )
}