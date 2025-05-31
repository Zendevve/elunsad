
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CustomProductInputProps {
  onAdd: (product: string) => void;
  onCancel: () => void;
  isVisible: boolean;
}

const CustomProductInput = ({ onAdd, onCancel, isVisible }: CustomProductInputProps) => {
  const [customInput, setCustomInput] = useState("");

  useEffect(() => {
    if (!isVisible) {
      setCustomInput("");
    }
  }, [isVisible]);

  const handleSubmit = () => {
    if (customInput.trim()) {
      onAdd(customInput.trim());
      setCustomInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      setCustomInput("");
      onCancel();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="p-3 border-t">
      <Input
        placeholder="Enter custom product/service"
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        onKeyDown={handleKeyPress}
        onBlur={handleSubmit}
        autoFocus
        className="mb-2"
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={!customInput.trim()}
        >
          <Plus className="h-3 w-3 mr-1" />
          Add
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setCustomInput("");
            onCancel();
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CustomProductInput;
