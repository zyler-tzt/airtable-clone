"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProfileIcon } from "./profile/profileIcon";
type BaseHeaderProps = {
  baseName: string | undefined;
  userName: string | undefined | null;
};

export function BaseHeader({ baseName, userName }: BaseHeaderProps) {
  const router = useRouter();
  return (
    <div className="h-[8.5vh] bg-green-700">
      {baseName && (
        <div className="text-bold text-md flex h-full flex-row items-center justify-between text-white">
          <div className="flex flex-row items-center justify-center pl-5 select-none">
            <div
              className="relative mr-3 h-6 w-6 cursor-pointer"
              onClick={() => router.push("/")}
            >
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
            <ProfileIcon firstName={userName} />
          </div>
        </div>
      )}
    </div>
  );
}

export function EmptyBaseHeader() {
  return <div className="h-[8vh] bg-green-700"></div>;
}
