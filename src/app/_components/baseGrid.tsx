"use client"
import { api } from "~/trpc/react";
import { BaseItem, CreateBaseItem } from "./baseItem";
import { useState } from "react";

export function BaseGrid() {
    const { data: bases, isLoading } = api.base.getBases.useQuery();

    if (isLoading) return <div className="text-xl text-gray-500">Please wait while we fetch your base :D</div>;

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <CreateBaseItem/>
                {
                    bases?.map((base) => {
                        return (
                            <BaseItem key={base.id} base={base}/>
                        )
                    })
                }
            </div>
        </div>
    )
}