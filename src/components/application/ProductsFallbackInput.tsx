
import { Input } from "@/components/ui/input";

interface ProductsFallbackInputProps {
  selectedProducts: string[];
  onSelectionChange: (products: string[]) => void;
  disabled?: boolean;
}

const ProductsFallbackInput = ({ 
  selectedProducts, 
  onSelectionChange, 
  disabled = false 
}: ProductsFallbackInputProps) => {
  return (
    <div className="space-y-3">
      <Input
        placeholder="Enter products/services"
        value={selectedProducts.join(", ")}
        onChange={(e) => onSelectionChange(e.target.value.split(", ").filter(Boolean))}
        disabled={disabled}
        className="h-10"
      />
    </div>
  );
};

export default ProductsFallbackInput;
