import type { Base } from '@prisma/client';
import Image from 'next/image'

type BaseItemProps = {
  base: Base;
};

type CreateBaseItemProps = {
    onClick: () => void;
}

export function BaseItem({ base }: BaseItemProps) {
    return (
        <div className="flex flex-row border-2 border-gray-300 rounded-lg items-center justify-start pl-5 h-50">
            <div>
                <Image
                    src="/airtable-base.png"
                    alt="airtableBaseImg"
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

export function CreateBaseItem({ onClick }: CreateBaseItemProps) {
    return (
        <div className='flex items-center justify-center border-2 border-gray-300 rounded-lg h-50' onClick={onClick}>
            <Image 
                src="/add-lucide.svg"
                alt="addBaseImage"
                width={40}         
                height={40} 
            />
        </div>
    )
}