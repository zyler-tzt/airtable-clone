import { BaseDisplay } from "../_components/basePage/baseDisplay";
import { auth } from "~/server/auth";

export default async function BasePage() {
  const session = await auth();
  return <BaseDisplay name={session?.user.name} />;
}
