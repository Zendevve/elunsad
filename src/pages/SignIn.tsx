import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { redirectAfterAuth } from "@/utils/authRedirect";

// Define validation schema
const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is already authenticated on page load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          console.log("User already authenticated, determining route");
          // Using central utility to redirect based on role
          await redirectAfterAuth(navigate);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };
    
    checkAuthStatus();
  }, [navigate]);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    
    try {
      console.log("Attempting sign in with email:", data.email);
      
      // Sign in with Supabase Auth
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error("Authentication error:", error);
        throw error;
      }

      if (!authData.user) {
        console.error("No user data returned after sign in");
        throw new Error("No user data returned after sign in");
      }
      
      console.log("Successfully signed in user:", authData.user.id);

      // Fetch user profile from the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('firstname, lastname')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      }

      const firstname = profileData?.firstname || authData.user.user_metadata?.firstname || '';
      
      // Show success message
      toast({
        title: "Sign in successful",
        description: `Welcome back, ${firstname}!`,
      });
      
      // Using central utility to redirect based on role
      await redirectAfterAuth(navigate);
      
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "An error occurred during sign in.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of the component remains unchanged
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/bbd34367-e328-4dff-9103-719d6d3c2bd6.png" 
                alt="eLUNSAD Logo" 
                className="h-8 w-auto mr-3"
              />
              <span className="text-xl font-bold text-gray-900">eLUNSAD</span>
            </div>
            <Link 
              to="/register" 
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Hero Section */}
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access your business permits and applications
            </p>
          </div>

          {/* Sign In Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                              <Mail className="h-5 w-5" />
                            </span>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Enter your email address"
                              className="pl-10"
                              disabled={isLoading}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Password</FormLabel>
                          <Link
                            to="/forgot-password"
                            className="text-xs text-primary hover:text-primary/80"
                          >
                            Forgot Password?
                          </Link>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                              <Lock className="h-5 w-5" />
                            </span>
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="pl-10 pr-10"
                              disabled={isLoading}
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2"
                    disabled={isLoading}
                  >
                    <LogIn className="h-5 w-5" />
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <p className="text-sm text-center text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="font-medium text-primary hover:text-primary/80">
                  Register here
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-400 text-center">
              &copy; {new Date().getFullYear()} eLUNSAD. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SignIn;
