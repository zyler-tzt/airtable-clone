"use client"

import { signIn, signOut } from "next-auth/react";
import Image from 'next/image'

export function SignInButton() {
    return (
        <button onClick={() => signIn("google", { callbackUrl: "/" })} className="flex items-center gap-2 bg-white  text-2xl w-1/2 text-center shadow rounded-md pt-2 pb-2 text-[#3c4043] justify-center">
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
    <button onClick={() => signOut({ callbackUrl: "/" })}>
        Sign out
    </button>
  );
}