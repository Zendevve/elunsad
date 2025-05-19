import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, User, UserCircle, Phone } from "lucide-react";
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
import { cleanupAuthState } from "@/utils/authUtils";
import { verifyAuthState } from "@/utils/authDebugUtils";

// Define validation schema
const registerSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  middlename: z.string().optional(),
  lastname: z.string().min(1, "Last name is required"),
  extension_name: z.string().optional(),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is already authenticated on page load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log("[Register] Checking if user is already authenticated");
        
        // Use the auth debugger utility to get detailed info
        const authState = await verifyAuthState();
        console.log("[Register] Auth state:", authState);
        
        if (authState.isAuthenticated) {
          console.log("[Register] User already authenticated, redirecting to dashboard");
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("[Register] Error checking auth status:", error);
      }
    };
    
    checkAuthStatus();
  }, [navigate]);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstname: "",
      middlename: "",
      lastname: "",
      extension_name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    
    try {
      console.log("[Register] Starting registration process");
      
      // Clean up any existing auth state to prevent conflicts
      cleanupAuthState();
      
      // Attempt to sign out any existing sessions first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log("[Register] Error during pre-signup cleanup:", err);
      }

      console.log("[Register] Attempting to register new user:", data.email);
      
      // Register with Supabase Auth
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            firstname: data.firstname,
            middlename: data.middlename || null,
            lastname: data.lastname,
            extension_name: data.extension_name || null,
            username: data.username
          }
        }
      });

      if (error) {
        console.error("[Register] Registration error:", error);
        throw error;
      }

      if (!authData.user) {
        console.error("[Register] No user data returned after sign up");
        throw new Error("No user data returned after sign up");
      }
      
      console.log("[Register] Successfully registered user:", authData.user.id);
      
      // Add the business_owner role to the new user
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: 'business_owner'
        });
        
      if (roleError) {
        console.error("[Register] Error adding user role:", roleError);
        // Continue despite role error as the user is created
      } else {
        console.log("[Register] Successfully added business_owner role to user");
      }
      
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully. You can now sign in.",
      });
      
      // Redirect to sign in page
      navigate('/signin');
    } catch (error) {
      console.error("[Register] Error in registration process:", error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred during registration.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Form rendering remains the same
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
              to="/signin" 
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-lg space-y-8">
          {/* Hero Section */}
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">Create Your Account</h1>
            <p className="mt-2 text-sm text-gray-600">
              Register to start managing your business permits
            </p>
          </div>

          {/* Registration Form */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl">Register</CardTitle>
              <CardDescription>
                Fill in your details to create an account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  {/* Name fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <UserCircle className="h-5 w-5" />
                              </span>
                              <Input
                                {...field}
                                placeholder="First name"
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
                      name="lastname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <UserCircle className="h-5 w-5" />
                              </span>
                              <Input
                                {...field}
                                placeholder="Last name"
                                className="pl-10"
                                disabled={isLoading}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="middlename"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Middle Name (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Middle name"
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="extension_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Extension (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Jr., Sr., III, etc."
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                              <User className="h-5 w-5" />
                            </span>
                            <Input
                              {...field}
                              placeholder="Choose a username"
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                              <Mail className="h-5 w-5" />
                            </span>
                            <Input
                              {...field}
                              type="email"
                              placeholder="you@example.com"
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                              <Lock className="h-5 w-5" />
                            </span>
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a strong password"
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

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                              <Lock className="h-5 w-5" />
                            </span>
                            <Input
                              {...field}
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              className="pl-10 pr-10"
                              disabled={isLoading}
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <p className="text-sm text-center text-gray-600">
                Already have an account?{" "}
                <Link to="/signin" className="font-medium text-primary hover:text-primary/80">
                  Sign in here
                </Link>
              </p>
              <p className="text-xs text-center text-gray-500">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-400 text-center">
            &copy; {new Date().getFullYear()} eLUNSAD. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Register;
