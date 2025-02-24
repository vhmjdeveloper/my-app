import {Button} from "@/components/ui/button";
import { ImageIcon} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import ImageUpload from "@/app/(main)/(routes)/_components/BlockEditor/image-upload";




interface PageCoverProps{
    content?: string;
    preview?: boolean;
}


const PageCover = ({content,preview}:PageCoverProps) => {

return(
    <>
    <div className="relative inline-block group/cover ">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>

                <Button variant='ghost' className={` p-1 flex items-center justify-center rounded-lg 
                            hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors 
                          ${!content && !preview && 'opacity-0 group-hover/cover:opacity-100'}
                            dark:text-gray-100`}>
                    <ImageIcon/> Agrega una portada
                </Button>

    </DropdownMenuTrigger>
            <DropdownMenuContent  align="start"
                                  sideOffset={5}
                                  className="w-[534px] p-0 border dark:border-gray-800">

                        <ImageUpload onImageSelect={()=>{}} onImageError={()=>{}}/>

            </DropdownMenuContent>
</DropdownMenu>
    </div>

</>
)
}
export default PageCover;