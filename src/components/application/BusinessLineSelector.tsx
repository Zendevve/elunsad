
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { businessLineOptions } from "./businessLinesData";

interface BusinessLineSelectorProps {
  lineId: number;
  value: string;
  onSelect: (lineId: number, value: string) => void;
  isCustom: boolean;
  onCustomChange: (lineId: number, isCustom: boolean) => void;
}

const BusinessLineSelector = ({
  lineId,
  value,
  onSelect,
  isCustom,
  onCustomChange
}: BusinessLineSelectorProps) => {
  const [open, setOpen] = useState(false);

  const handleBusinessLineSelect = (selectedValue: string) => {
    console.log(`Selected business line for ID ${lineId}:`, selectedValue);
    
    if (selectedValue === "Others (Custom)") {
      onCustomChange(lineId, true);
      onSelect(lineId, "");
    } else {
      onCustomChange(lineId, false);
      onSelect(lineId, selectedValue);
    }
    
    setOpen(false);
  };

  const groupedOptions = businessLineOptions.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, typeof businessLineOptions>);

  if (isCustom) {
    return (
      <Input 
        value={value} 
        onChange={(e) => onSelect(lineId, e.target.value)}
        placeholder="Enter custom line of business"
        className="focus:ring-1 focus:ring-primary"
      />
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-left"
        >
          <span className="truncate">
            {value || "Select line of business..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 z-50 bg-white" align="start">
        <Command>
          <CommandInput placeholder="Search line of business..." />
          <CommandList>
            <CommandEmpty>No business line found.</CommandEmpty>
            {Object.entries(groupedOptions).map(([category, options]) => (
              <CommandGroup key={category} heading={category}>
                {options.map((option) => (
                  <CommandItem
                    key={option.name}
                    value={option.name}
                    onSelect={(currentValue) => {
                      console.log("Command item selected:", currentValue, "for line:", lineId);
                      handleBusinessLineSelect(option.name);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
            <CommandGroup heading="CUSTOM">
              <CommandItem
                value="Others (Custom)"
                onSelect={() => handleBusinessLineSelect("Others (Custom)")}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    isCustom ? "opacity-100" : "opacity-0"
                  )}
                />
                Others (Custom)
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default BusinessLineSelector;
