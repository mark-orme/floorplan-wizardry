
import * as React from "react"
import { AiOutlineMenuFold } from "react-icons/ai"

import { useSidebar } from "./use-sidebar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

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
              {children ?? <AiOutlineMenuFold className="h-5 w-5" />}
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
