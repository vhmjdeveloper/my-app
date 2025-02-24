"use client"
import { DarkModeToggle } from "@/app/(main)/(routes)/_components/dark-mode-toggle";
import React from "react";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { DocumentTitle } from "@/app/(main)/(routes)/_components/document-title";
import {ScrollText} from "lucide-react";
import {useDocument} from "@/context/document-context";

export function Navbar() {
    const { state, isMobile } = useSidebar();
    const { document: currentDocument } = useDocument();

    return (
        <nav
            className="sticky top-0 z-10 flex flex-row items-center justify-between p-1 border-b dark:border-gray-700 bg-white dark:bg-gray-900">
            {(state === 'collapsed' || isMobile) && (
                <SidebarTrigger variant="navbar"/>
            )}
            <div className="flex items-center ">
                {currentDocument?.icon ? <div className="h-6 w-6 text-gray-500 dark:text-gray-400 flex-shrink-0">{currentDocument.icon}</div> :<ScrollText className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0"/>}
                <DocumentTitle/>
            </div>
            <DarkModeToggle/>
        </nav>
    );
}