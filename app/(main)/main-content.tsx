import React from "react";
import { useDocument } from "@/context/document-context";
import { RestoreBanner } from "@/app/(main)/(routes)/_components/restore-banner";
import { cn } from "@/lib/utils";

export function MainContent({ children }: { children: React.ReactNode }) {
    const { document } = useDocument();
    const showRestoreBanner = document?.isDeleted;

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <main className={cn(
                "flex-1 flex flex-col min-h-0",
            )}>
                {showRestoreBanner && <RestoreBanner document={document} />}
                <div className="flex-1 p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}