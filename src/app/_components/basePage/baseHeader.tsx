"use client"

import Image from 'next/image'
import { useRouter } from 'next/navigation'
type BaseHeaderProps = {
    baseName: string | undefined
}

export function BaseHeader({ baseName } : BaseHeaderProps) {
    const router = useRouter()
    return (
        <div className="h-13 bg-green-700">
            { baseName &&
                <div className='flex flex-row items-center justify-between text-white text-lg h-full'>
                    <div className="pl-5 flex flex-row items-center justify-center select-none">
                        <div className="relative mr-3 h-6 w-6   cursor-pointer"
                            onClick={() => router.push('/')}>
                            <Image 
                            src="/airtable-white-logo.png"
                            alt="airtableWhiteLogo"
                            draggable={false}
                            fill
                            />
                        </div>
                    {baseName}
                    </div>
                    <div className="pr-5 select-none">
                        ProfileIcon
                    </div>
                </div>    
            }        
        </div>
    )
}