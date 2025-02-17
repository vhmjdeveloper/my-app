import {SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/app/(main)/(routes)/_components/app-sidebar";
import React from "react";
import {Navbar} from "@/app/(main)/(routes)/_components/navbar";

export default function MainLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {

    return (
        <div className="flex h-screen bg-white dark:bg-gray-900">
            <SidebarProvider>
                <AppSidebar collapsible='offcanvas'/>

            <main className="flex-1 overflow-auto">
               <Navbar/>
                {children}
            </main>
            </SidebarProvider>
        </div>
    )
}
