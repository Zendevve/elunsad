
import React, { useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface EnhancedRadioGroupProps {
  options: RadioOption[];
  value: string;
  onValueChange: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  name: string;
  className?: string;
}

export function EnhancedRadioGroup({
  options,
  value,
  onValueChange,
  orientation = "vertical",
  name,
  className,
}: EnhancedRadioGroupProps) {
  // Log when values change to help debugging
  useEffect(() => {
    console.log(`EnhancedRadioGroup (${name}) - Current value:`, value);
  }, [value, name]);

  const handleValueChange = (newValue: string) => {
    console.log(`EnhancedRadioGroup (${name}) - Value changing to:`, newValue);
    onValueChange(newValue);
  };

  return (
    <RadioGroup
      value={value}
      onValueChange={handleValueChange}
      className={cn(
        orientation === "horizontal" ? "flex gap-4 flex-wrap" : "space-y-3",
        className
      )}
      name={name}
    >
      {options.map((option) => (
        <div
          key={option.value}
          className={cn(
            "relative flex items-start",
            orientation === "horizontal" && "flex-col"
          )}
        >
          <div className="flex items-center h-5">
            <RadioGroupItem
              value={option.value}
              id={`${name}-${option.value}`}
              className="h-5 w-5 border-2 data-[state=checked]:border-primary"
            />
          </div>
          <div className={cn("ml-3", orientation === "horizontal" && "ml-0 mt-1")}>
            <Label
              htmlFor={`${name}-${option.value}`}
              className="font-medium cursor-pointer"
            >
              {option.label}
            </Label>
            {option.description && (
              <p className="text-sm text-muted-foreground">{option.description}</p>
            )}
          </div>
        </div>
      ))}
    </RadioGroup>
  );
}
