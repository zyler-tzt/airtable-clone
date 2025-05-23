import { SignOutButton } from "../_components/authButtons"

export function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-row gap-4 h-[8vh] shadow w-full">
                <div className="flex pl-5 items-center justify-left w-1/2 text-lg">
                    <img src='/airtable.svg' className="h-1/2 mr-3"></img>
                    Airtable
                </div>
                <div className="pr-5 w-1/2 flex justify-end">
                    <SignOutButton/>
                </div>
                
            </div>
            <div className="h-[92vh] w-full">
                <div>Home</div>
                <div>
                    
                </div>
            </div>
            
        </div>
    )
}