"use client";

import { signOut } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";

function getInitials(name: string | undefined | null) {
  if (!name) {
    return "G";
  }
  return name.trim().charAt(0).toUpperCase();
}

type ProfileIconProps = {
  firstName: string | undefined | null;
};

export function ProfileIcon({ firstName }: ProfileIconProps) {
  const initial = getInitials(firstName);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className="text-md flex cursor-pointer items-center justify-center border border-white font-bold text-white"
          style={{
            borderRadius: "50%",
            width: 30,
            height: 30,
          }}
        >
          {initial}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
