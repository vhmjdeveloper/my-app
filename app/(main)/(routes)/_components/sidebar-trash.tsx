import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { loadAllDocuments } from '@/lib/serializer';
import { cn } from '@/lib/utils';
import { TrashDialog } from './trash-dialog';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

export function SidebarTrash() {
    const [deletedCount, setDeletedCount] = useState(0);

    useEffect(() => {
        const updateTrashCount = () => {
            const documents = loadAllDocuments();
            const trashedDocs = Object.values(documents).filter(doc => doc.isDeleted);
            setDeletedCount(trashedDocs.length);
        };

        // Actualizar inicialmente
        updateTrashCount();

        // Actualizar cuando cambie el almacenamiento
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'documents') {
                updateTrashCount();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <div className="mt-4">
            <div className="px-3">
                <h2 className="mb-2 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    PAPELERA
                </h2>
            </div>
            <SidebarMenu>
                <SidebarMenuItem>
                    <TrashDialog>
                        <SidebarMenuButton className="w-full justify-between">
                            <div className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                <span>Papelera</span>
                            </div>
                            {deletedCount > 0 && (
                                <span className={cn(
                                    "rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium dark:bg-gray-800",
                                    deletedCount > 0 && "text-red-600 dark:text-red-400"
                                )}>
                                    {deletedCount}
                                </span>
                            )}
                        </SidebarMenuButton>
                    </TrashDialog>
                </SidebarMenuItem>
            </SidebarMenu>
        </div>
    );
}