
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SelectedProductsBadgesProps {
  selectedProducts: string[];
  onRemove: (product: string) => void;
}

const SelectedProductsBadges = ({ selectedProducts, onRemove }: SelectedProductsBadgesProps) => {
  if (selectedProducts.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {selectedProducts.map((product) => (
        <Badge
          key={product}
          variant="secondary"
          className="flex items-center gap-1 text-xs py-1 px-2 max-w-[200px]"
        >
          <span className="truncate">{product}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent"
            onClick={() => onRemove(product)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
    </div>
  );
};

export default SelectedProductsBadges;
