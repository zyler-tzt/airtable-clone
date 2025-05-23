import Link from "next/link";

import { LatestPost } from "~/app/_components/base";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { SignInPage } from "~/app/_pages/signInPage";
import { HomePage } from "~/app/_pages/homePage";

export default async function Home() {
  const session = await auth();

  return (
    <div>
      {session? <HomePage/> : <SignInPage/>}
    </div>
  );
}
