import * as React from "react"

// Constantes para el sidebar
const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_WIDTH_KEY = "sidebar_width"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 días
const DEFAULT_WIDTH = 256 // 16rem
const MIN_WIDTH = 240 // 15rem
const MAX_WIDTH = 480 // 30rem

// Tipos para el contexto del sidebar
type SidebarState = "expanded" | "collapsed"

interface SidebarContextValue {
    // Estados básicos del sidebar
    state: SidebarState
    open: boolean
    setOpen: (open: boolean) => void

    // Estados para móvil
    openMobile: boolean
    setOpenMobile: (open: boolean) => void
    isMobile: boolean

    // Funcionalidad de redimensionado
    width: number
    setWidth: (width: number) => void
    isDragging: boolean
    setIsDragging: (isDragging: boolean) => void

    // Funciones de utilidad
    toggleSidebar: () => void
}

// Crear el contexto
const SidebarContext = React.createContext<SidebarContextValue | null>(null)

// Hook personalizado para usar el contexto
export function useSidebar() {
    const context = React.useContext(SidebarContext)
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider")
    }
    return context
}

// Props para el provider
interface SidebarProviderProps {
    children: React.ReactNode
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

// Provider del sidebar
export function SidebarProvider({
                                    children,
                                    defaultOpen = true,
                                    open: controlledOpen,
                                    onOpenChange
                                }: SidebarProviderProps) {
    // Estado para el modo móvil
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    // Estado interno para open/closed
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
    const open = controlledOpen ?? internalOpen

    // Estados para el redimensionado
    const [width, setWidth] = React.useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY)
            return saved ? Math.max(MIN_WIDTH, Math.min(parseInt(saved), MAX_WIDTH)) : DEFAULT_WIDTH
        }
        return DEFAULT_WIDTH
    })
    const [isDragging, setIsDragging] = React.useState(false)

    // Manejar el cambio de estado open/closed
    const setOpen = React.useCallback(
        (value: boolean) => {
            const newOpenState = value

            if (onOpenChange) {
                onOpenChange(newOpenState)
            } else {
                setInternalOpen(newOpenState)
            }

            // Guardar el estado en una cookie
            document.cookie = `${SIDEBAR_COOKIE_NAME}=${newOpenState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
        },
        [onOpenChange]
    )

    // Función para alternar el estado del sidebar
    const toggleSidebar = React.useCallback(() => {
        if (isMobile) {
            setOpenMobile(prev => !prev)
        } else {
            setOpen(!open)
        }
    }, [isMobile, open, setOpen])

    // Manejar el cambio de ancho
    const handleWidthChange = React.useCallback((newWidth: number) => {
        const clampedWidth = Math.max(MIN_WIDTH, Math.min(newWidth, MAX_WIDTH))
        setWidth(clampedWidth)
        localStorage.setItem(SIDEBAR_WIDTH_KEY, clampedWidth.toString())
    }, [])

    // Valores del contexto
    const value: SidebarContextValue = {
        state: open ? "expanded" : "collapsed",
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        width,
        setWidth: handleWidthChange,
        isDragging,
        setIsDragging,
        toggleSidebar
    }

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    )
}

// Hook para detectar si estamos en móvil
function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState(
        typeof window !== 'undefined' ? window.innerWidth < 768 : false
    )

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return isMobile
}