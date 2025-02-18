"use client"
import { DarkModeToggle } from "@/app/(main)/(routes)/_components/dark-mode-toggle";
import React from "react";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { DocumentTitle } from "@/app/(main)/(routes)/_components/document-title";

export function Navbar() {
    const { state, isMobile } = useSidebar();

    return (
        <nav className="sticky top-0 z-10 flex flex-row items-center justify-between p-1 border-b dark:border-gray-700 bg-white dark:bg-gray-900">
            {(state === 'collapsed' || isMobile) && (
                <SidebarTrigger variant="navbar" />
            )}
            <DocumentTitle />
            <DarkModeToggle />
        </nav>
    );
}