
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
          console.log("Processing auth callback with hash");
          
          // Let Supabase handle the rest - it will extract tokens from the URL
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Authentication error:", error);
            toast({
              variant: "destructive",
              title: "Authentication error",
              description: error.message
            });
          } else if (data?.session) {
            console.log("Authentication successful");
            toast({
              title: "Authentication successful",
              description: "Your email has been confirmed."
            });
          }
        } else {
          console.log("No hash params found in callback URL");
        }
      } catch (error) {
        console.error("Error processing authentication callback:", error);
        toast({
          variant: "destructive",
          title: "Error processing authentication",
          description: "Please try signing in again."
        });
      } finally {
        // Redirect to sign in page regardless of outcome
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
