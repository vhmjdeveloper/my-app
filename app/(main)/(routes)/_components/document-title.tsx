"use client"
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {ScrollText} from "lucide-react";
interface DocumentTitleProps{
    props:{
        title: string
    }
}
export function DocumentTitle({props}:DocumentTitleProps) {
    const [inputValue, setInputValue] = useState('');
    return(
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant='ghost' className='p-1 pt-1'>
                    {props.title}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <div className="flex items-center gap-2">
                    <ScrollText className="h-4 w-4 text-gray-500"/>
                    <Input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={props.title}
                        className="bg-gray-100"
                    />
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}