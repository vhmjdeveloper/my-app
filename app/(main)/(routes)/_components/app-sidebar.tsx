"use client"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem, SidebarTrigger, useSidebar
} from "@/components/ui/sidebar";
import Logo from "@/app/(main)/(routes)/_components/logo";
import {SidebarTitle} from "@/app/(main)/(routes)/_components/side-bar-title";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { state, openMobile, isMobile } = useSidebar()
    const showTrigger = isMobile ? openMobile : state === 'expanded'
    return(
    <Sidebar {...props}>
        <SidebarHeader>
            <SidebarTitle
                name="Victor Mendoza"
                showTrigger={showTrigger}
            />
        </SidebarHeader>
        <SidebarContent>
            Content
        </SidebarContent>

    </Sidebar>
)
}