
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import CustomProductInput from "./CustomProductInput";
import SelectedProductsBadges from "./SelectedProductsBadges";
import ProductsFallbackInput from "./ProductsFallbackInput";

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
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Reset custom input when dropdown closes
  useEffect(() => {
    if (!open) {
      setShowCustomInput(false);
    }
  }, [open]);

  const handleSelect = (product: string) => {
    if (product === "add-custom") {
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

  const handleAddCustomProduct = (customProduct: string) => {
    if (!selectedProducts.includes(customProduct)) {
      const newSelection = [...selectedProducts, customProduct];
      onSelectionChange(newSelection);
      setShowCustomInput(false);
    }
  };

  const getDisplayText = () => {
    if (selectedProducts.length === 0) return placeholder;
    if (selectedProducts.length === 1) return selectedProducts[0];
    return `${selectedProducts.length} selected`;
  };

  // If no products available, show fallback input
  if (!availableProducts || availableProducts.length === 0) {
    return (
      <ProductsFallbackInput
        selectedProducts={selectedProducts}
        onSelectionChange={onSelectionChange}
        disabled={disabled}
      />
    );
  }

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-10 text-left"
            disabled={disabled}
          >
            <span className="truncate">{getDisplayText()}</span>
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
                <CommandItem
                  value="add-custom"
                  onSelect={() => handleSelect("add-custom")}
                  className="text-primary"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add custom product/service
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
          <CustomProductInput
            onAdd={handleAddCustomProduct}
            onCancel={() => setShowCustomInput(false)}
            isVisible={showCustomInput}
          />
        </PopoverContent>
      </Popover>

      <SelectedProductsBadges
        selectedProducts={selectedProducts}
        onRemove={handleRemoveProduct}
      />
    </div>
  );
};

export default ProductsServicesMultiSelect;
