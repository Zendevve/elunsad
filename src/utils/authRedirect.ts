
import { NavigateFunction } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Redirects a user based on their role after authentication
 */
export const redirectAfterAuth = async (navigate: NavigateFunction): Promise<void> => {
  try {
    // Get current session
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      console.log('No active session found. Redirecting to signin.');
      navigate('/signin');
      return;
    }
    
    const userId = sessionData.session.user.id;
    console.log('User authenticated:', userId);
    
    try {
      // Use a direct query with a function call to avoid RLS recursion issues
      const { data, error } = await supabase.rpc('has_role', {
        role: 'office_staff'
      });
      
      if (error) {
        console.error('Error checking admin role:', error);
        throw error;
      }
      
      const isAdmin = !!data;
      console.log('Admin status determined:', isAdmin);
      
      if (isAdmin) {
        console.log('Admin user detected. Redirecting to admin dashboard.');
        navigate('/admin-dashboard');
        
        toast({
          title: 'Welcome, Administrator',
          description: 'You have been redirected to the admin dashboard.',
        });
      } else {
        console.log('Regular user detected. Redirecting to user dashboard.');
        navigate('/dashboard');
        
        toast({
          title: 'Welcome',
          description: 'You have been redirected to your dashboard.',
        });
      }
    } catch (error) {
      console.error('Role check error:', error);
      // Fallback to user dashboard if role check fails
      toast({
        title: 'Role check failed',
        description: 'Using fallback navigation to user dashboard.',
        variant: 'destructive',
      });
      navigate('/dashboard');
    }
  } catch (error) {
    console.error('Error in redirect logic:', error);
    toast({
      title: 'Navigation error',
      description: 'An unexpected error occurred. Redirecting to user dashboard.',
      variant: 'destructive',
    });
    navigate('/dashboard');
  }
};
