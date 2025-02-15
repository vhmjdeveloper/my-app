"use client"
import {DarkModeToggle} from "@/app/(main)/(routes)/_components/dark-mode-toggle";
import React from "react";
import {SidebarTrigger, useSidebar} from "@/components/ui/sidebar";


export function Navbar() {
    const {
        state,

        isMobile,
    } = useSidebar()

    return (
        <>
            <nav className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                {(state === 'collapsed' || isMobile) && (
                    <>
                        <SidebarTrigger variant="navbar"/>
                    </>
                )}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bunny Notes</h1>
                <DarkModeToggle/>
            </nav>
        </>
    )
}