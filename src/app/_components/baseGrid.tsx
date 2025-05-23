"use client"
import { api } from "~/trpc/react";
import { BaseItem, CreateBaseItem } from "./baseItem";
import { useState } from "react";

export function BaseGrid() {
    const { data: bases, isLoading } = api.base.getBases.useQuery();

    const [isModalOpen, setModelState] = useState(false)
    const [newBaseName, setNewBaseName] = useState("");
    const utils = api.useUtils();
    const createBase = api.base.create.useMutation({
        onSuccess: async () => {
            closeModal()
            await utils.base.invalidate();
        },
    });

    if (isLoading) return <div className="text-xl text-gray-500">Please wait while we fetch your base :D</div>;
    
    function openModal() {
        setModelState(true)
    }

    function closeModal() {
        setNewBaseName("")
        setModelState(false)
    }

    function baseCreateHandler() {
        if (newBaseName.trim() === "") {
            createBase.mutate({ name: "Untitled Base" })
        } else {
            createBase.mutate({ name: newBaseName });
        }
    }

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <CreateBaseItem onClick={openModal}></CreateBaseItem>
                {
                    bases?.map((base) => {
                        return (
                            <BaseItem key={base.id} base={base}/>
                        )
                    })
                }
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div className="flex flex-col w-[30vw] h-[50vh] shadow-lg p-5 rounded-lg bg-gray-50 z-50 border-2 border-gray-300 gap-5 justify-center items-center">
                        <div className="text-lg text-center">
                            Create a new base
                        </div>

                        <input type="text" value={newBaseName} onChange={(e) => (setNewBaseName(e.target.value))}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") baseCreateHandler()
                        }}
                        className="bg-white border-1 rounded-md p-3 w-[70%]" placeholder="Untitled Base"
                        >
                        </input>

                        <button className="bg-gray-500 w-[70%] text-white rounded-md p-3" onClick={baseCreateHandler}>
                            Create
                        </button>

                        <button className="bg-gray-500 w-[70%] text-white rounded-md p-3" onClick={closeModal}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}