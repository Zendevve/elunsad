
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { 
  Eye, EyeOff, Mail, Lock, User, Phone, UserPlus, Facebook, 
  Briefcase, FileText, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Form validation schema
const registerSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  middlename: z.string().optional(),
  lastname: z.string().min(1, "Last name is required"),
  extension_name: z.string().optional(),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .refine(
      (value) => /[A-Z]/.test(value), 
      "Password must contain at least one uppercase letter"
    )
    .refine(
      (value) => /[a-z]/.test(value), 
      "Password must contain at least one lowercase letter"
    )
    .refine(
      (value) => /[0-9]/.test(value), 
      "Password must contain at least one number"
    )
    .refine(
      (value) => /[^A-Za-z0-9]/.test(value), 
      "Password must contain at least one special character"
    ),
  confirmPassword: z.string().min(8, "Please confirm your password"),
  businessName: z.string().optional(),
  registrationNumber: z.string().optional(),
  agreeToTerms: z.boolean().refine(value => value === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      businessName: "",
      registrationNumber: "",
      agreeToTerms: false,
    },
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
    
    const strength = 
      (hasUpperCase ? 1 : 0) + 
      (hasLowerCase ? 1 : 0) + 
      (hasNumbers ? 1 : 0) + 
      (hasSpecialChar ? 1 : 0);
    
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
      // Check if username already exists
      const { data: usernameExists, error: usernameError } = await supabase
        .from('register_account')
        .select('username')
        .eq('username', data.username)
        .maybeSingle();

      if (usernameError && usernameError.code !== 'PGRST116') {
        throw new Error("Error checking username availability");
      }

      if (usernameExists) {
        form.setError("username", { 
          type: "manual", 
          message: "Username already taken" 
        });
        throw new Error("Username already taken");
      }

      // Check if email already exists
      const { data: emailExists, error: emailError } = await supabase
        .from('register_account')
        .select('email')
        .eq('email', data.email)
        .maybeSingle();

      if (emailError && emailError.code !== 'PGRST116') {
        throw new Error("Error checking email availability");
      }

      if (emailExists) {
        form.setError("email", { 
          type: "manual", 
          message: "Email already registered" 
        });
        throw new Error("Email already registered");
      }

      // Insert new user into register_account table
      const { error: insertError } = await supabase
        .from('register_account')
        .insert({
          firstname: data.firstname,
          middlename: data.middlename || null,
          lastname: data.lastname,
          extension_name: data.extension_name || null,
          username: data.username,
          email: data.email,
          password: data.password, // Note: In a production app, this should be hashed!
        });

      if (insertError) {
        console.error("Registration error:", insertError);
        throw new Error("Registration failed: " + insertError.message);
      }
      
      // Registration successful
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully. You can now sign in.",
        variant: "default",
      });
      
      // Redirect to signin page
      navigate('/signin');
      
    } catch (error) {
      console.error("Registration error:", error);
      
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
                  {/* Personal Details Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Personal Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                  <User className="h-5 w-5" />
                                </span>
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="First Name"
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
                        name="middlename"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Middle Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                  <User className="h-5 w-5" />
                                </span>
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Middle Name"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="lastname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                  <User className="h-5 w-5" />
                                </span>
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Last Name"
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
                        name="extension_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Extension Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                  <User className="h-5 w-5" />
                                </span>
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Jr., Sr., III, etc."
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

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address <span className="text-red-500">*</span></FormLabel>
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
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <Phone className="h-5 w-5" />
                              </span>
                              <Input
                                {...field}
                                type="tel"
                                placeholder="Enter your phone number"
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

                  {/* Account Details Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Account Details</h3>
                    
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <User className="h-5 w-5" />
                              </span>
                              <Input
                                {...field}
                                type="text"
                                placeholder="Choose a username (3-30 characters)"
                                className="pl-10"
                                disabled={isLoading}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Username must be between 3-30 characters and unique.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <Lock className="h-5 w-5" />
                              </span>
                              <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                className="pl-10 pr-10"
                                disabled={isLoading}
                                onChange={(e) => {
                                  field.onChange(e);
                                  checkPasswordStrength(e.target.value);
                                }}
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
                          {passwordStrength && (
                            <div className="mt-2">
                              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${passwordStrengthColors[passwordStrength]} ${
                                    passwordStrength === "weak" ? "w-1/3" : 
                                    passwordStrength === "medium" ? "w-2/3" : "w-full"
                                  }`}
                                />
                              </div>
                              <p className="text-xs mt-1 text-gray-600">
                                Password strength: {passwordStrength}
                              </p>
                            </div>
                          )}
                          <FormDescription>
                            Password should be at least 8 characters and include uppercase, lowercase, numbers and special characters.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password <span className="text-red-500">*</span></FormLabel>
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
                  </div>

                  {/* Business Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Business Information (Optional)</h3>
                    
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <Briefcase className="h-5 w-5" />
                              </span>
                              <Input
                                {...field}
                                type="text"
                                placeholder="Enter business name (optional)"
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
                      name="registrationNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Registration Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <FileText className="h-5 w-5" />
                              </span>
                              <Input
                                {...field}
                                type="text"
                                placeholder="Enter registration number (optional)"
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

                  {/* Terms & Conditions */}
                  <FormField
                    control={form.control}
                    name="agreeToTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
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
                      </FormItem>
                    )}
                  />

                  {/* Call-to-Action */}
                  <Button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2"
                    disabled={isLoading}
                  >
                    <UserPlus className="h-5 w-5" />
                    {isLoading ? "Registering..." : "Register"}
                  </Button>
                </form>
              </Form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or register with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button variant="outline" className="flex items-center justify-center gap-2 w-full">
                    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                      <path
                        d="M12.545, 10.239v3.821h5.445c-0.712, 2.315-2.647, 3.972-5.445, 3.972-3.332, 0-6.033-2.701-6.033-6.032s2.701-6.032, 6.033-6.032c1.498, 0, 2.866, 0.549, 3.921, 1.453l2.814-2.814C17.503, 2.988, 15.139, 2, 12.545, 2 7.021, 2, 2.543, 6.477, 2.543, 12s4.478, 10, 10.002, 10c8.396, 0, 10.249-7.85, 9.426-11.748l-9.426, 0.013z"
                        fill="#4285F4"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center gap-2 w-full">
                    <Facebook className="h-5 w-5 text-blue-600" />
                    Facebook
                  </Button>
                </div>
              </div>
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
          <div className="flex flex-col md:flex-row justify-between space-y-6 md:space-y-0">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Terms of Service</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Data Usage Policy</a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">FAQs</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Contact Us</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Help Center</a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Contact</h3>
              <p className="text-sm text-gray-600">
                Business Permit Licensing Office<br />
                123 Main Street, Suite 101<br />
                City, State 12345<br />
                support@elunsad.gov
              </p>
            </div>
          </div>
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

export default Register;
