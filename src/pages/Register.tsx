import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, User, UserPlus, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Define validation schema
const registerSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  middlename: z.string().optional(),
  lastname: z.string().min(1, "Last name is required"),
  extension_name: z.string().optional(),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters").refine(password => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  }, {
    message: "Password must include uppercase, lowercase, numbers and special characters"
  }),
  verifyPassword: z.string().min(1, "Please confirm your password"),
  email: z.string().email("Invalid email address"),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  })
}).refine(data => data.password === data.verifyPassword, {
  message: "Passwords do not match",
  path: ["verifyPassword"]
});
type RegisterFormData = z.infer<typeof registerSchema>;
const passwordStrengthColors = {
  weak: "bg-red-500",
  medium: "bg-yellow-500",
  strong: "bg-green-500"
};
const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong" | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstname: "",
      middlename: "",
      lastname: "",
      extension_name: "",
      username: "",
      password: "",
      verifyPassword: "",
      email: "",
      agreeToTerms: false
    }
  });
  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(null);
      return;
    }
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const strength = (hasUpperCase ? 1 : 0) + (hasLowerCase ? 1 : 0) + (hasNumbers ? 1 : 0) + (hasSpecialChar ? 1 : 0);
    if (password.length < 8 || strength < 2) {
      setPasswordStrength("weak");
    } else if (strength < 4 || password.length < 10) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("strong");
    }
  };
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      // Sign up with Supabase Auth
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            firstname: data.firstname,
            middlename: data.middlename || null,
            lastname: data.lastname,
            extension_name: data.extension_name || null,
            username: data.username,
          },
          emailRedirectTo: `${window.location.origin}/signin`,
        },
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account."
      });

      // Redirect to sign in page
      navigate('/signin');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred during registration."
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img src="/lovable-uploads/bbd34367-e328-4dff-9103-719d6d3c2bd6.png" alt="eLUNSAD Logo" className="h-8 w-auto mr-3" />
              <span className="text-xl font-bold text-gray-900">eLUNSAD</span>
            </div>
            <Link to="/signin" className="text-sm font-medium text-primary hover:text-primary/80">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-xl w-full space-y-8">
          {/* Page Title and Introduction */}
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">Create Your Account</h1>
            <p className="mt-2 text-sm text-gray-600">
              Join our platform to streamline your business permit applications and renewals
            </p>
          </div>

          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Register</CardTitle>
              <CardDescription>
                Please fill in the information below to create your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Registrant Profile Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Registrant Profile</h3>
                    
                    <FormField control={form.control} name="firstname" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>First name *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <User className="h-5 w-5" />
                              </span>
                              <Input {...field} type="text" placeholder="Firstname" className="pl-10" disabled={isLoading} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />

                    <FormField control={form.control} name="middlename" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Middle name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <User className="h-5 w-5" />
                              </span>
                              <Input {...field} type="text" placeholder="Middlename" className="pl-10" disabled={isLoading} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />

                    <FormField control={form.control} name="lastname" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Last name *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <User className="h-5 w-5" />
                              </span>
                              <Input {...field} type="text" placeholder="Lastname" className="pl-10" disabled={isLoading} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />

                    <FormField control={form.control} name="extension_name" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Extension Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <User className="h-5 w-5" />
                              </span>
                              <Input {...field} type="text" placeholder="e.g. Jr, III" className="pl-10" disabled={isLoading} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>

                  {/* Account Details Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Account Details</h3>
                    
                    <FormField control={form.control} name="username" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Username *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <User className="h-5 w-5" />
                              </span>
                              <Input {...field} type="text" placeholder="Username" className="pl-10" disabled={isLoading} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />

                    <FormField control={form.control} name="password" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Password *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <Lock className="h-5 w-5" />
                              </span>
                              <Input {...field} type={showPassword ? "text" : "password"} placeholder="Password" className="pl-10 pr-10" disabled={isLoading} onChange={e => {
                          field.onChange(e);
                          checkPasswordStrength(e.target.value);
                        }} />
                              <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                            </div>
                          </FormControl>
                          {passwordStrength && <div className="mt-2">
                              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div className={`h-full ${passwordStrengthColors[passwordStrength]} ${passwordStrength === "weak" ? "w-1/3" : passwordStrength === "medium" ? "w-2/3" : "w-full"}`} />
                              </div>
                              <p className="text-xs mt-1 text-gray-600">
                                Password strength: {passwordStrength}
                              </p>
                            </div>}
                          <FormMessage />
                        </FormItem>} />

                    <FormField control={form.control} name="verifyPassword" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Verify Password *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <Lock className="h-5 w-5" />
                              </span>
                              <Input {...field} type={showVerifyPassword ? "text" : "password"} placeholder="Verify Password" className="pl-10 pr-10" disabled={isLoading} />
                              <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500" onClick={() => setShowVerifyPassword(!showVerifyPassword)}>
                                {showVerifyPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />

                    <FormField control={form.control} name="email" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <Mail className="h-5 w-5" />
                              </span>
                              <Input {...field} type="email" placeholder="Email Address" className="pl-10" disabled={isLoading} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>

                  {/* Terms & Conditions */}
                  <FormField control={form.control} name="agreeToTerms" render={({
                  field
                }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            I agree to the{" "}
                            <a href="#" className="text-primary hover:text-primary/80">
                              Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="text-primary hover:text-primary/80">
                              Privacy Policy
                            </a>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>} />

                  {/* Call-to-Action */}
                  <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={isLoading}>
                    <UserPlus className="h-5 w-5" />
                    {isLoading ? "Registering..." : "Register"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <HelpCircle className="h-4 w-4" />
                <p>Need help? <a href="#" className="text-primary hover:text-primary/80">Contact Support</a></p>
              </div>
              <p className="text-sm text-center text-gray-600">
                Already have an account?{" "}
                <Link to="/signin" className="font-medium text-primary hover:text-primary/80">
                  Sign in here
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
    </div>;
};
export default Register;
