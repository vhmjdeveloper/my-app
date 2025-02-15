"use client"

import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, NotepadText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Poppins } from "next/font/google"
import Logo from "@/app/(main)/(routes)/_components/logo"
import { useRouter } from "next/navigation"

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "600"],
})

interface SidebarTitleProps {
    name: string
    showTrigger?: boolean
}

export function SidebarTitle({ name, showTrigger }: SidebarTitleProps) {
    const router = useRouter();

    const handleCreateNewDocument = () => {
        const newDocId = 'doc_' + Date.now().toString(36);
        router.push(`/documents/${newDocId}`);
    };

    return (
        <div className="flex flex-row items-center gap-2">

            <SidebarMenu>

                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton>
                                <Logo />
                                <p className={cn(
                                    "font-sans font-semibold max-w-[150px] truncate",
                                    font.className
                                )}>
                                    Bunny Notes de {name}
                                </p>
                                <ChevronDown className="ml-auto shrink-0" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-80">
                            <DropdownMenuItem>
                                <span>Acme Inc</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <span>Acme Corp.</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
            {showTrigger && <SidebarTrigger variant="sidebar" />}
            <NotepadText
                className="shrink-0 cursor-pointer hover:text-blue-500 transition-colors"
                onClick={handleCreateNewDocument}
            />
        </div>
    )
}