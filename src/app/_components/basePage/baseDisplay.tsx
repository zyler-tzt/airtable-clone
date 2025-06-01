"use client"
import { api } from "~/trpc/react";
import { useParams } from "next/navigation"
import { TableDisplay } from "~/app/_components/basePage/tableDisplay/tableDisplay";
import { BaseHeader, EmptyBaseHeader } from "./baseHeader";
import { BaseTableList, EmptyBaseTableList } from "~/app/_components/basePage/tableList/baseTableList";
import { useEffect, useState } from "react";
import { BaseTools } from "./baseTools";
import { TableViewList } from "~/app/_components/basePage/views/tableViewList";
import type { Field, View } from "@prisma/client";

export function BaseDisplay() {
    const { base: slug } = useParams()
    const [selectedTableId, setSelectedTableId] = useState<number | undefined>(undefined)
    const [openViewList, setOpenViewList] = useState<boolean>(false)
    const [currentViewId, setViewId] = useState<undefined| number>(undefined)

    const [tableColumns, setTableColumns] = useState<Field[] | undefined>(undefined)
    const { data: base, isLoading: isBaseLoading } = api.base.getBaseBySlug.useQuery({ slug: slug as string });
    
    useEffect(() => {
        if (selectedTableId === undefined)
            setSelectedTableId(base?.tables?.[0]?.id)
    }, [base])

    const { data: table, isLoading: isTableLoading } = api.table.getTableByTableId.useQuery({ tableId: selectedTableId ?? -1}) ;
    useEffect(() => {
        if (currentViewId === undefined)
            setViewId(table?.view?.[0]?.id)
    }, [table])

    const { data: columns } = api.table.getFields.useQuery({ tableId: selectedTableId ?? -1, viewId: currentViewId ?? -1})

    useEffect(() => {
        if (columns) {
            setTableColumns(columns)
        }
    }, [columns])


    if (isBaseLoading || !selectedTableId || isTableLoading ) {
        return <div>
            <EmptyBaseHeader />
            <EmptyBaseTableList />
        </div>
    }
    if (!currentViewId) {
        return <div>
            <BaseHeader baseName={base?.name} />
            <BaseTableList setViewId={setViewId} views={table!.view} base={base} selectedTable={selectedTableId} setSelectedTable={setSelectedTableId}/>
        </div>
    }

    return (
        <div className='flex flex-col'>
            <BaseHeader baseName={base?.name} />
            <BaseTableList setViewId={setViewId} views={table!.view} base={base} selectedTable={selectedTableId} setSelectedTable={setSelectedTableId}/>
            <BaseTools setTableColumns={setTableColumns} tableColumns={tableColumns!} openView={openViewList} openViewSetter={setOpenViewList} tableId={selectedTableId} viewId={currentViewId}/>
            <div className='flex flex-row'>
                <div className={`w-[15vw] ${openViewList === false ? "hidden" : ""}`}>
                    <TableViewList tableId={selectedTableId} viewData={table?.view} currentViewId={currentViewId} setViewId={setViewId}/>
                </div>
                <div className={`${openViewList === true ? "w-[85vw]" : "w-full"}`}>
                    {
                        table ? <TableDisplay columns={tableColumns!} tableData={table} viewId={currentViewId}/> : <div></div>
                    }
                </div>
            </div>
        </div>
    )
}