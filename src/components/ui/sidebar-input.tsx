
import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SidebarInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const SidebarInput = React.forwardRef<HTMLInputElement, SidebarInputProps>(
  ({ className, startIcon, endIcon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {startIcon && (
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sidebar-foreground/50">
            {startIcon}
          </div>
        )}
        <Input
          ref={ref}
          className={cn(
            "h-8 w-full bg-sidebar-accent/30 border-sidebar-border shadow-none focus-visible:ring-sidebar-ring",
            startIcon && "pl-8",
            endIcon && "pr-8",
            className
          )}
          {...props}
        />
        {endIcon && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sidebar-foreground/50">
            {endIcon}
          </div>
        )}
      </div>
    );
  }
);

SidebarInput.displayName = "SidebarInput";

export { SidebarInput };
