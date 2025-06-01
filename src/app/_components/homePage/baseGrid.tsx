"use client";
import { api } from "~/trpc/react";
import { BaseItem, CreateBaseItem } from "./baseItem";
import { useSession } from "next-auth/react";

export function BaseGrid() {
  const { data: session } = useSession();
  console.log(session);
  const { data: bases, isLoading } = api.base.getBases.useQuery({
    userId: session?.user.id ?? "",
  });

  if (isLoading)
    return (
      <div className="text-xl text-gray-500">
        Please wait while we fetch your base :D
      </div>
    );

  return (
    <div>
      <div className="scrollbar-none grid grid-cols-2 gap-6 overflow-x-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        <CreateBaseItem />
        {bases?.map((base) => {
          return <BaseItem key={base.id} base={base} />;
        })}
      </div>
    </div>
  );
}
