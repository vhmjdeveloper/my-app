import React from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Smile, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface PageIconProps {
    icon?: string;
    onChange: (icon: string) => void;
}

const PageIcon = ({ icon, onChange }: PageIconProps) => {
    const { theme } = useTheme();

    const handleRemoveIcon = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
    };

    // Compute emoji picker styles based on theme
    const pickerStyle: React.CSSProperties & { [key: string]: string } = {
        '--border-radius': '0.5rem',
        border: 'none',
        '--rgb-background': 'transparent',
        // Add dark mode specific styles
        '--rgb-input': theme === 'dark' ? '64, 64, 64' : '238, 238, 238',
        '--rgb-color': theme === 'dark' ? '255, 255, 255' : '0, 0, 0',
    };

    return (
        <div className="relative inline-block group/icon">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className={`h-12 w-12 p-0 flex items-center justify-center rounded-lg 
                            hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors 
                            ${!icon && 'opacity-0 group-hover/icon:opacity-100'}
                            dark:text-gray-100`}
                        aria-label="Seleccionar emoji"
                    >
                        {icon ? (
                            <span className="text-4xl select-none">{icon}</span>
                        ) : (
                            <Smile
                                className="h-6 w-6 text-gray-500 group-hover:text-gray-900
                                    dark:text-gray-400 dark:group-hover:text-gray-100
                                    transition-colors"
                            />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="start"
                    sideOffset={5}
                    className="w-[280px] p-0 border dark:border-gray-700"
                >
                    <div className="[&_.em-emoji-picker]:w-[280px] dark:[&_.em-emoji-picker]:dark">
                        <Picker
                            data={data}
                            onEmojiSelect={(emoji: { native: string }) => onChange(emoji.native)}
                            theme={theme as 'light' | 'dark'}
                            set="native"
                            autoFocus={true}
                            showPreview={false}
                            showSkinTones={false}
                            emojiSize={22}
                            emojiButtonSize={28}
                            maxFrequentRows={0}
                            navPosition="none"
                            previewPosition="none"
                            searchPosition="sticky"
                            width="280px"
                            className="dark:bg-gray-800"
                            style={pickerStyle}
                        />
                    </div>
                    {icon && (
                        <>
                            <DropdownMenuSeparator className="my-0 dark:border-gray-700" />
                            <DropdownMenuItem
                                className="w-full flex items-center justify-center text-red-600
                                    dark:text-red-400 hover:text-red-700 dark:hover:text-red-300
                                    cursor-pointer py-3 transition-colors"
                                onClick={handleRemoveIcon}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Quitar icono
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default PageIcon;