"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProfileIcon } from "./profile/profileIcon";
import { Separator } from "../ui/separator";

type BaseHeaderProps = {
  baseName: string | undefined;
  userName: string | undefined | null;
};

export function BaseHeader({ baseName, userName }: BaseHeaderProps) {
  const router = useRouter();
  return (
    <div className="h-[8vh] bg-green-700">
      {baseName && (
        <div className="text-bold flex h-full flex-row items-center justify-between text-white/90">
          <div className="flex flex-row items-center justify-start pl-5 select-none">
            <div
              className="relative mr-5 h-6 w-6 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <Image
                src="/airtable-white-logo.png"
                alt="airtableWhiteLogo"
                draggable={false}
                fill
              />
            </div>
            <div className="font-semibold">
            {baseName}
            </div>
            <div className="cursor-pointer ml-7 px-3 py-1 hover:bg-green-800 bg-green-800 rounded-xl text-sm"> Data
              </div>
              <div className="cursor-pointer ml-2 px-3 py-1 hover:bg-green-800 rounded-xl text-sm"> Automations
              </div>
              <div className="cursor-pointer ml-2 px-3 py-1 hover:bg-green-800 rounded-xl text-sm"> Interfaces
              </div>
<div className="h-5 w-px bg-white/30 mx-3"></div>              <div className="cursor-pointer px-3 py-1 hover:bg-green-800 rounded-xl text-sm"> Forms
              </div>
          </div>
          <div className="pr-5 select-none flex flex-row justify-end items-center">
            <div className="cursor-pointer hover:bg-green-800 rounded-full p-2">
              <Image
                src="/history.svg"
                alt="history"
                width={15}
                height={15}
                draggable={false}
              />
            </div>
            <div className="cursor-pointer gap-1 flex flex-row text-sm hover:bg-green-800 rounded-3xl px-3 py-1 mx-1">
              <Image
                src="/help-circle.svg"
                alt="help"
                width={15}
                height={15}
                draggable={false}
              />
              Help
            </div>
            <div className="bg-white cursor-pointer gap-1 flex flex-row text-sm rounded-3xl px-3 py-1 mx-1 text-green-700">
              <Image
                src="/share.svg"
                alt="shareicon"
                width={15}
                height={15}
                draggable={false}
              />
              Share
            </div>
            <div className="bg-white cursor-pointer flex flex-row text-sm rounded-full p-2 mx-1 text-green-700 ml-3 mr-4">
              <Image
                src="/bell.svg"
                alt="bellIcon"
                width={15}
                height={15}
                draggable={false}
              />
            </div>
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
