
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { redirectToUserDashboard } from '@/utils/authRedirect';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // The hash contains all auth data 
        const hashParams = window.location.hash;
        
        // If we have hash params, handle the authentication
        if (hashParams && hashParams.length > 1) {
          console.log("Processing auth callback with hash:", hashParams);
          
          // Let Supabase handle the rest - it will extract tokens from the URL
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Authentication error:", error);
            toast({
              variant: "destructive",
              title: "Authentication error",
              description: error.message
            });
            navigate('/signin');
            return;
          }
          
          if (data?.session) {
            console.log("Authentication successful, session found:", data.session);
            
            // Check if email is verified
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
              console.log("User data retrieved:", user);
              
              if (user.email_confirmed_at || user.confirmed_at) {
                toast({
                  title: "Authentication successful",
                  description: "Your email has been confirmed."
                });

                // Use our utility function for role-based redirection
                await redirectToUserDashboard(user.id, navigate);
              } else {
                toast({
                  variant: "default",
                  title: "Email verification required",
                  description: "Please check your inbox and confirm your email address before signing in."
                });
                navigate('/signin');
              }
            } else {
              toast({
                title: "Authentication successful",
                description: "Welcome back!"
              });
              navigate('/dashboard');
            }
          } else {
            console.log("No session found in callback");
            toast({
              variant: "destructive", 
              title: "Authentication issue",
              description: "No session was created. Please try signing in again."
            });
            navigate('/signin');
          }
        } else {
          console.log("No hash params found in callback URL");
          navigate('/signin');
        }
      } catch (error) {
        console.error("Error processing authentication callback:", error);
        toast({
          variant: "destructive",
          title: "Error processing authentication",
          description: "Please try signing in again."
        });
        navigate('/signin');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Processing authentication...</h2>
        <p className="text-gray-600">Please wait while we verify your account.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
