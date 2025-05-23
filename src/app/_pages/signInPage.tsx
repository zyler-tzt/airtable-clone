import { SignInButton } from "../_components/authButtons"
import Image from 'next/image'

export function SignInPage() {
    return (
        <div className="flex flex-row items-center justify-center h-screen w-screen">
            <div className="flex flex-col justify-center items-center w-1/2 pl-[10%] gap-4">
                <h1 className="text-4xl font-bold mb-2 w-full">
                    Digital operations for the AI era
                </h1>
                <h5 className="text-2xl text-gray-600 mb-4 w-full">
                    Create modern business apps to manage and automate critical processes.
                </h5>
                <div className="w-full">
                    <SignInButton/>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center w-1/2">
                <div className="relative w-[25vw] h-[50vh]">
                    <Image 
                        src="/airtable.svg"
                        alt="airtableLogo"
                        fill
                    />
                </div>
                
                <h3 className="text-6xl font-bold mb-2 w-full text-center">
                    Airtable
                </h3>
            </div>
        </div>
    )
}