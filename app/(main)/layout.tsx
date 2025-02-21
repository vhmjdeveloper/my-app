'use client'
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/(main)/(routes)/_components/app-sidebar";
import React, { useEffect } from "react";
import { Navbar } from "@/app/(main)/(routes)/_components/navbar";
import { DocumentProvider } from "@/context/document-context";
import { useParams, useRouter } from "next/navigation";
import { MainContent } from "@/app/(main)/main-content";
import { loadDocument } from "@/lib/serializer";

export default function MainLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    const params = useParams();
    const router = useRouter();
    const documentId = Array.isArray(params.documentId)
        ? params.documentId[0]
        : params.documentId;

    useEffect(() => {
        // Si estamos intentando ver un documento eliminado, verificar si hay navegación
        const currentDoc = loadDocument(documentId);
        if (currentDoc?.isDeleted) {
            // Buscar en localStorage si el usuario está navegando desde otro documento
            const navigatingFrom = localStorage.getItem('navigating_from');
            if (navigatingFrom && navigatingFrom !== documentId) {
                // Navegar de vuelta al documento anterior
                router.push(`/documents/${navigatingFrom}`);
                localStorage.removeItem('navigating_from');
            }
        }
    }, [documentId, router]);

    return (
        <div className="flex h-screen bg-white dark:bg-gray-900">
            <SidebarProvider>
                <DocumentProvider documentId={documentId}>
                    <div className="z-20">
                        <AppSidebar collapsible='offcanvas'/>
                    </div>
                    <div className="flex-1 flex flex-col">
                        <Navbar />
                        <MainContent>
                            {children}
                        </MainContent>
                    </div>
                </DocumentProvider>
            </SidebarProvider>
        </div>
    )
}