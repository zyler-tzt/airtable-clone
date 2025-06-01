import Image from 'next/image'
import { HideShowButton } from './showHide/hideShowButton'
import type { Field } from '@prisma/client'
import { SorterButton } from './sorter/SorterButton'

type BaseToolsProps = {
    openView: boolean,
    openViewSetter: (newState: boolean) => void,
    tableId: number,
    viewId: number,
    setTableColumns: (newFields: Field[]) => void,
    tableColumns: Field[],
}

export function BaseTools({ openView, openViewSetter, tableId, viewId, setTableColumns, tableColumns }: BaseToolsProps) {
    return (
        <div className="h-[5vh] my-1 px-2 text-xs shadow-sm flex flex-row gap-5 justify-start pl-3">
            <div className='flex my-1 px-2 rounded-sm flex-row hover:bg-gray-200 items-center justify-center gap-1 select-none'
                onClick={() => openViewSetter(!openView)}>
                <Image 
                    src="/views.svg"
                    alt="viewIcon"
                    width={15}         
                    height={15}    
                    draggable={false}
                />
                Views
            </div>

            <HideShowButton tableColumns={tableColumns} setTableColumns={setTableColumns} tableId={tableId} viewId={viewId}/>
            
            <div className='flex my-1 px-2 rounded-sm flex-row hover:bg-gray-200 items-center justify-center gap-1'>
                <Image 
                    src="/filter.svg"
                    alt="filterIcon"
                    width={15}         
                    height={15}    
                    draggable={false}
                />
                Filter
            </div>
            
            <SorterButton tableColumns={tableColumns} tableId={tableId} viewId={viewId}/>
        </div>
    )
}