import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    useSidebar
} from "@/components/ui/sidebar";
import { SidebarTitle } from "@/app/(main)/(routes)/_components/side-bar-title";
import { DocumentList } from "@/app/(main)/(routes)/_components/document-list";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { state, openMobile, isMobile } = useSidebar();
    const showTrigger = isMobile ? openMobile : state === 'expanded';

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarTitle
                    name="Victor Mendoza"
                    showTrigger={showTrigger}
                />
            </SidebarHeader>
            <SidebarContent>
                <DocumentList />
            </SidebarContent>
        </Sidebar>
    );
}