import { auth } from "~/server/auth";
import { SignInPage } from "~/app/_pages/signInPage";
import { HomePage } from "~/app/_pages/homePage";

export default async function Home() {
  const session = await auth();

  return <div>{session ? <HomePage /> : <SignInPage />}</div>;
}
