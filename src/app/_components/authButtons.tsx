"use client"

import { signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';

export function SignInButton() {
    return (
        <button onClick={() => signIn("google", { callbackUrl: "/" })} className="flex items-center gap-2 bg-white  text-2xl w-1/2 text-center shadow rounded-md pt-2 pb-2 text-[#3c4043] justify-center">
            <img src="/google.svg" className="h-6 w-6"></img>
            Sign In with Google
        </button>
    );
}


export function SignOutButton() {

  return (
    <button onClick={() => signOut({ callbackUrl: "/" })}>
        Sign out
    </button>
  );
}