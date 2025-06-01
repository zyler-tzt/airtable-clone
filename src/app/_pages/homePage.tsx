import { SignOutButton } from "../_components/homePage/authButtons";
import { BaseGrid } from "../_components/homePage/baseGrid";
import Image from "next/image";

export function HomePage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center select-none">
      <div className="flex h-[8vh] w-full flex-row gap-4 shadow">
        <div className="justify-left flex w-1/2 items-center pl-5 text-lg">
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
        <div className="flex w-1/2 justify-end pr-5">
          <SignOutButton />
        </div>
      </div>
      <div className="scrollbar-none flex h-[92vh] w-full flex-col justify-start gap-5 overflow-y-auto p-5">
        <div className="text-2xl">Home</div>
        <div className="pb-5">
          <BaseGrid />
        </div>
      </div>
    </div>
  );
}
