
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface ProductsServicesMultiSelectProps {
  availableProducts: string[];
  selectedProducts: string[];
  onSelectionChange: (products: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

const ProductsServicesMultiSelect = ({
  availableProducts,
  selectedProducts,
  onSelectionChange,
  placeholder = "Select products/services...",
  disabled = false
}: ProductsServicesMultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Reset custom input when dropdown closes
  useEffect(() => {
    if (!open) {
      setCustomInput("");
      setShowCustomInput(false);
    }
  }, [open]);

  const handleSelect = (product: string) => {
    if (product === "Others (Custom)") {
      setShowCustomInput(true);
      return;
    }

    const newSelection = selectedProducts.includes(product)
      ? selectedProducts.filter(p => p !== product)
      : [...selectedProducts, product];
    
    onSelectionChange(newSelection);
  };

  const handleRemoveProduct = (productToRemove: string) => {
    const newSelection = selectedProducts.filter(p => p !== productToRemove);
    onSelectionChange(newSelection);
  };

  const handleCustomInputSubmit = () => {
    if (customInput.trim() && !selectedProducts.includes(customInput.trim())) {
      const newSelection = [...selectedProducts, customInput.trim()];
      onSelectionChange(newSelection);
      setCustomInput("");
      setShowCustomInput(false);
    }
  };

  const handleCustomInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomInputSubmit();
    } else if (e.key === 'Escape') {
      setCustomInput("");
      setShowCustomInput(false);
    }
  };

  // If no products available, show text input
  if (!availableProducts || availableProducts.length === 0) {
    return (
      <Input
        placeholder="Enter products/services"
        value={selectedProducts.join(", ")}
        onChange={(e) => onSelectionChange(e.target.value.split(", ").filter(Boolean))}
        disabled={disabled}
        className="focus:ring-1 focus:ring-primary"
      />
    );
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {selectedProducts.length > 0
              ? `${selectedProducts.length} selected`
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search products/services..." />
            <CommandList>
              <CommandEmpty>No products/services found.</CommandEmpty>
              <CommandGroup>
                {availableProducts.map((product) => (
                  <CommandItem
                    key={product}
                    value={product}
                    onSelect={() => handleSelect(product)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedProducts.includes(product) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {product}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          {showCustomInput && (
            <div className="p-2 border-t">
              <Input
                placeholder="Enter custom product/service"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={handleCustomInputKeyPress}
                onBlur={handleCustomInputSubmit}
                autoFocus
                className="mb-2"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleCustomInputSubmit}
                  disabled={!customInput.trim()}
                >
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setCustomInput("");
                    setShowCustomInput(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Selected products display */}
      {selectedProducts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedProducts.map((product) => (
            <Badge
              key={product}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              <span className="text-xs">{product}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => handleRemoveProduct(product)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsServicesMultiSelect;
