"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
type BaseHeaderProps = {
  baseName: string | undefined;
};

export function BaseHeader({ baseName }: BaseHeaderProps) {
  const router = useRouter();
  return (
    <div className="h-[8vh] bg-green-700">
      {baseName && (
        <div className="flex h-full flex-row items-center justify-between text-sm text-white">
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
          <div className="pr-5 select-none">ProfileIcon</div>
        </div>
      )}
    </div>
  );
}

export function EmptyBaseHeader() {
  return <div className="h-[8vh] bg-green-700"></div>;
}
