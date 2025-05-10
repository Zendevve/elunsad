
import { toast } from "sonner";
import { useToast as useSonnerToast } from "sonner";

// Re-export toast function directly
export { toast };

// Create a compatible interface that matches the expected API in our components
export function useToast() {
  // Use sonner's hook
  useSonnerToast();
  
  // But return an interface compatible with our existing code
  return {
    toast,
    // Include a dummy toasts array to satisfy the existing interface
    toasts: [],
    // Include a dummy dismiss function
    dismiss: () => {}
  };
}
