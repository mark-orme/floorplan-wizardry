
import * as React from "react"
import { AiOutlineMenuFold, AiOutlineMenu } from "react-icons/ai"
import { Icons } from '@/components/icons'

// Temporary implementation as use-sidebar is missing
const useSidebar = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  return { collapsed, setCollapsed };
}

interface SidebarTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
}

const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { collapsed, setCollapsed } = useSidebar()

    return (
      <Button
        ref={ref}
        variant="outline"
        size="icon"
        className={className}
        onClick={() => setCollapsed(!collapsed)}
        {...props}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              {children ?? (collapsed ? <AiOutlineMenu className="h-5 w-5" /> : <AiOutlineMenuFold className="h-5 w-5" />)}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            {collapsed ? "Expand" : "Collapse"} sidebar
          </TooltipContent>
        </Tooltip>
      </Button>
    )
  }
)

SidebarTrigger.displayName = "SidebarTrigger"

export { SidebarTrigger }

// Import missing dependencies to make the code work
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
