
import { toast as sonnerToast } from 'sonner';

type ToastOptions = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
};

/**
 * Toast compatibility function that supports both object-style and arguments-style calls
 */
export function toast(titleOrOptions: string | ToastOptions, options?: ToastOptions) {
  // If first argument is a string, use it as title
  if (typeof titleOrOptions === 'string') {
    const title = titleOrOptions;
    const description = options?.description;
    const variant = options?.variant || 'default';
    const duration = options?.duration || 5000;
    
    if (variant === 'destructive') {
      sonnerToast.error(title, { description, duration });
    } else if (variant === 'success') {
      sonnerToast.success(title, { description, duration });
    } else {
      sonnerToast(title, { description, duration });
    }
  } 
  // If first argument is an object
  else {
    const { title, description, variant = 'default', duration = 5000 } = titleOrOptions;
    
    if (variant === 'destructive') {
      sonnerToast.error(title || description || 'Error', { description: title ? description : undefined, duration });
    } else if (variant === 'success') {
      sonnerToast.success(title || description || 'Success', { description: title ? description : undefined, duration });
    } else {
      sonnerToast(title || description || 'Notification', { description: title ? description : undefined, duration });
    }
  }
}

// Add useToast hook for compatibility with existing code
export const useToast = () => {
  return {
    toast
  };
};

export default toast;
