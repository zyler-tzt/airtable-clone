"use client";

import { signIn, signOut } from "next-auth/react";
import Image from "next/image";

export function SignInButton() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/" })}
      className="flex w-1/2 items-center justify-center gap-2 rounded-md bg-white pt-2 pb-2 text-center text-2xl text-[#3c4043] shadow"
    >
      <Image
        src="/google.svg"
        alt="googleLogo"
        width={24}
        height={24}
        draggable={false}
      />
      Sign In with Google
    </button>
  );
}

export function SignOutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button>
  );
}
