import { SignOutButton } from "../_components/authButtons"
import { BaseGrid } from "../_components/baseGrid"

export function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen">
            <div className="flex flex-row gap-4 h-[8vh] shadow w-full">
                <div className="flex pl-5 items-center justify-left w-1/2 text-lg">
                    <img src='/airtable.svg' className="h-1/2 mr-3"></img>
                    Airtable
                </div>
                <div className="pr-5 w-1/2 flex justify-end">
                    <SignOutButton/>
                </div>
                
            </div>
            <div className="flex flex-col justify-start h-[92vh] w-full p-5 gap-5">
                <div className="text-2xl">Home</div>
                <div className="">
                    <BaseGrid/>
                </div>
            </div>
            
        </div>
    )
}