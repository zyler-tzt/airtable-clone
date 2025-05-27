"use client"
import { api } from "~/trpc/react";
import { useParams } from "next/navigation"
import { TableDisplay } from "./tableDisplay";
import { BaseHeader } from "./baseHeader";
import { BaseTableList } from "./baseTableList";
import { useEffect, useState } from "react";
import { BaseTools } from "./baseTools";
export function BaseDisplay() {
    const { base: slug } = useParams()
    const [selectedTableId, setSelectedTableId] = useState<number | undefined>(undefined)

    const { data: base, isLoading: isBaseLoading } = api.base.getBaseBySlug.useQuery({ slug: slug as string });
    
    useEffect(() => {
        if (!selectedTableId)
            setSelectedTableId(base?.tables?.[0]?.id)
    }, [base])

    const { data: table, isLoading: isTableLoading } = api.table.getTableByTableId.useQuery({ tableId: selectedTableId ?? -1}) ;


    if (isBaseLoading || isTableLoading) {
        <div> Loading </div>
    }

    return (
        <div className='flex flex-col'>
            <BaseHeader baseName={base?.name} />
            <BaseTableList base={base} selectedTable={selectedTableId} setSelectedTable={setSelectedTableId}/>
            <BaseTools />
            <div className='flex flex-row'>
                <div className="w-[15vw]">
                    View
                </div>
                <div className="w-[85vw]">
                    {
                        table ? <TableDisplay tableData={table} /> : <div></div>
                    }
                </div>
            </div>
        </div>
    )
}