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
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {ChevronDown, NotepadText} from "lucide-react";
import {cn} from "@/lib/utils";
import React from "react";
import {Poppins} from "next/font/google";
import {SidebarTitle} from "@/app/(main)/(routes)/_components/side-bar-title";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "600"],
});
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