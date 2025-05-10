import { toast as sonnerToast } from "sonner";

type ToastOptions = {
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
};

// Create a wrapper function to handle both old-style and new-style toast calls
export function compatToast(titleOrOptions: string | { title?: string; description?: string; variant?: string }, options?: ToastOptions) {
  // If first parameter is an object, it's using the old shadcn/ui toast format
  if (typeof titleOrOptions === 'object') {
    const { title, description, variant } = titleOrOptions;
    return sonnerToast(title || "", { 
      description, 
      ...(variant ? { className: variant === 'destructive' ? 'bg-destructive text-destructive-foreground' : '' } : {})
    });
  }
  
  // Otherwise, it's using the new sonner format
  return sonnerToast(titleOrOptions, options);
}

// Export a patched toast function that works with both formats
export const toast = compatToast;

// Export a compatibility layer for useToast
export function useToast() {
  return {
    toast: compatToast,
    toasts: [],
    dismiss: () => {}
  };
}
