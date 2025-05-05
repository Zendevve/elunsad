
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  required?: boolean;
  tooltip?: string;
  error?: string; // Added error prop
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ className, label, helperText, required, tooltip, id, error, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value);

    return (
      <div className="space-y-1.5">
        <div className="relative">
          <Input
            id={id}
            className={cn(
              "pt-6 pb-2 placeholder:text-transparent transition-all h-14",
              (isFocused || hasValue) && "pt-6 pb-2",
              error && "border-red-500",
              className
            )}
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false);
              setHasValue(!!e.target.value);
            }}
            onChange={(e) => {
              setHasValue(!!e.target.value);
              if (props.onChange) props.onChange(e);
            }}
            required={required}
            aria-describedby={helperText || error ? `${id}-description` : undefined}
            aria-invalid={!!error}
            {...props}
          />
          <Label
            htmlFor={id}
            className={cn(
              "absolute left-3 transition-all duration-200 pointer-events-none",
              isFocused || hasValue
                ? "top-2 text-xs text-primary"
                : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground",
              error && "text-red-500"
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>

          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        {error && (
          <p id={`${id}-error`} className="text-xs text-red-500">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p id={`${id}-description`} className="text-xs text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";
