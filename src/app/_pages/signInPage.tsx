import { SignInButton } from "../_components/homePage/authButtons";
import Image from "next/image";

export function SignInPage() {
  return (
    <div className="flex h-screen w-screen flex-row items-center justify-center">
      <div className="flex w-1/2 flex-col items-center justify-center gap-4 pl-[10%]">
        <h1 className="mb-2 w-full text-4xl font-bold">
          Digital operations for the AI era
        </h1>
        <h5 className="mb-4 w-full text-2xl text-gray-600">
          Create modern business apps to manage and automate critical processes.
        </h5>
        <div className="w-full">
          <SignInButton />
        </div>
      </div>
      <div className="flex w-1/2 flex-col items-center justify-center">
        <div className="relative h-[50vh] w-[25vw]">
          <Image
            src="/airtable.svg"
            alt="airtableLogo"
            draggable={false}
            fill
          />
        </div>

        <h3 className="mb-2 w-full text-center text-6xl font-bold">Airtable</h3>
      </div>
    </div>
  );
}
