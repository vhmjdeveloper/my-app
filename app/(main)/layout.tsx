'use client'
import {SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/app/(main)/(routes)/_components/app-sidebar";
import React from "react";
import {Navbar} from "@/app/(main)/(routes)/_components/navbar";
import {DocumentProvider} from "@/context/document-context";
import {useParams} from "next/navigation";

export default function MainLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    const params = useParams();
    const documentId = Array.isArray(params.documentId)
        ? params.documentId[0]
        : params.documentId;
    return (
        <div className="flex h-screen bg-white dark:bg-gray-900">
            <SidebarProvider>
                <DocumentProvider documentId={documentId}>
                <AppSidebar collapsible='offcanvas' className='w-90'/>

            <main className="flex-1 overflow-auto">
               <Navbar />
                {children}
            </main>
                </DocumentProvider>
            </SidebarProvider>
        </div>
    )
}
