
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      // Get the access_token from the URL hash
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');

      if (accessToken) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: accessToken,
          type: 'email',
        });

        if (error) {
          toast({
            variant: "destructive",
            title: "Error confirming email",
            description: error.message
          });
        } else {
          toast({
            title: "Email confirmed",
            description: "Your email has been confirmed. You can now sign in."
          });
        }
      }

      // Redirect to sign in page regardless of outcome
      navigate('/signin');
    };

    handleEmailConfirmation();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Confirming your email...</h2>
        <p className="text-gray-600">Please wait while we verify your email address.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
