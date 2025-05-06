
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
    console.log('Checking role for user:', userId);
    
    // Check if user has admin role
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'office_staff')
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error('Error checking admin role:', error);
      toast({
        title: 'Role check failed',
        description: 'Unable to verify your access level. Redirecting to user dashboard.',
        variant: 'destructive',
      });
      navigate('/dashboard');
      return;
    }
    
    const isAdmin = !!data;
    console.log('User admin status determined:', isAdmin);
    
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
