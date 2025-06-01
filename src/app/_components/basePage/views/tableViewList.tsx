import type { View } from "@prisma/client"
import { ViewAddButton } from "./addViewButton"
import Image from 'next/image'

type TableViewListProps = {
    tableId: number, 
    viewData: View[] | undefined,
    currentViewId: number,
    setViewId: (id: number) => void
}

export function TableViewList({ tableId, viewData, currentViewId, setViewId} : TableViewListProps) {
    return (
        <div className="flex flex-col p-2 items-center justify-center h-full">
            <div className="w-[80%] text-left mb-2 text-sm px-2 select-none">Views</div>
            <div className="flex-1 overflow-auto w-full items-center flex flex-col gap-1">
                {viewData?.map(v => {
                    return <div key={`view-${v.id}`}className={`${currentViewId === v.id ? 'bg-blue-200' : ''}  hover:bg-gray-200 px-2 py-1 w-[80%] text-sm flex flex-row items-center justify-start gap-2 select-none`} style={{ borderRadius: "4px"}}
                        onClick={() => setViewId(v.id)}>
                        <Image 
                            src="/grid.svg"
                            alt="gridIcon"
                            width={15}         
                            height={15}    
                            draggable={false}
                        />
                        {v.name}
                    </div>
                })}
                <ViewAddButton tableId={tableId} setViewId={setViewId}/>
            </div>     
        </div>
    )
}