import { SignOutButton } from "../_components/homePage/authButtons"
import { BaseGrid } from "../_components/homePage/baseGrid"
import Image from 'next/image'

export function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen select-none">
            <div className="flex flex-row gap-4 h-[8vh] shadow w-full">
                <div className="flex pl-5 items-center justify-left w-1/2 text-lg">
                    <div className="relative mr-3 h-8 w-10">
                        <Image 
                            src="/airtable.svg"
                            alt="airtableLogo"
                            draggable={false}
                            fill
                        />
                    </div>
                    Airtable
                </div>
                <div className="pr-5 w-1/2 flex justify-end">
                    <SignOutButton/>
                </div>
                
            </div>
            <div className="flex flex-col justify-start h-[92vh] w-full p-5 gap-5 overflow-y-auto scrollbar-none">
                <div className="text-2xl">Home</div>
                <div className="pb-5">
                    <BaseGrid/>
                </div>
            </div>
            
        </div>
    )
}