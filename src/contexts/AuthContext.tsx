
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { cleanupAuthState } from '@/utils/authUtils';

export type UserRole = 'office_staff' | 'business_owner';

interface AuthContextType {
  user: any | null;
  session: any | null;
  userRoles: UserRole[];
  isAdmin: boolean;
  isBusinessOwner: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshRoles: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Fetch user roles from the database
  const fetchUserRoles = useCallback(async (userId: string) => {
    try {
      console.log("[AuthContext] Fetching roles for user:", userId);
      
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
        
      if (roleError) {
        console.error("[AuthContext] Error fetching user roles:", roleError);
        throw roleError;
      }
      
      console.log("[AuthContext] User role data received:", roleData);
      
      // Extract roles from the data
      const roles: UserRole[] = roleData ? 
        roleData.map(item => item.role as UserRole) : [];
        
      console.log("[AuthContext] Parsed user roles:", roles);
      setUserRoles(roles);
      
      return roles;
    } catch (error) {
      console.error("[AuthContext] Error fetching user roles:", error);
      setUserRoles([]);
      return [];
    }
  }, []);

  // Refresh user roles
  const refreshRoles = useCallback(async () => {
    if (user?.id) {
      await fetchUserRoles(user.id);
    }
  }, [user, fetchUserRoles]);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("[AuthContext] Signing in user with email:", email);
      
      // Clean up existing auth state to prevent conflicts
      cleanupAuthState();
      
      // Attempt to sign out any existing session first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log("[AuthContext] Error during pre-signin cleanup:", err);
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("[AuthContext] Sign in error:", error);
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: error.message,
        });
        throw error;
      }

      if (!data.user) {
        throw new Error("No user data returned after sign in");
      }
      
      console.log("[AuthContext] Successfully signed in user:", data.user.id);
      
      // Fetch user roles after successful login
      await fetchUserRoles(data.user.id);
      
      toast({
        title: "Sign in successful",
        description: "You have been signed in successfully",
      });
      
      return data;
    } catch (error) {
      console.error("[AuthContext] Error in signIn function:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setIsLoading(true);
      console.log("[AuthContext] Signing out user");
      
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error("[AuthContext] Sign out error:", error);
        toast({
          variant: "destructive",
          title: "Sign out failed",
          description: error.message,
        });
        throw error;
      }
      
      // Clear local state
      setUser(null);
      setSession(null);
      setUserRoles([]);
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      
      // Force page reload for a clean state
      window.location.href = '/';
    } catch (error) {
      console.error("[AuthContext] Error in signOut function:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize auth state on component mount
  useEffect(() => {
    console.log("[AuthContext] Initializing auth context");
    
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Set up auth state change listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            console.log("[AuthContext] Auth state changed:", event);
            
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            
            // Fetch roles on auth state change if needed
            if (currentSession?.user && event === 'SIGNED_IN') {
              console.log("[AuthContext] User signed in, fetching roles");
              // Use setTimeout to avoid potential deadlocks with Supabase client
              setTimeout(() => fetchUserRoles(currentSession.user.id), 0);
            } else if (event === 'SIGNED_OUT') {
              console.log("[AuthContext] User signed out, clearing roles");
              setUserRoles([]);
            }
          }
        );
        
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("[AuthContext] Initial session:", initialSession ? "Found" : "None");
        
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        // Fetch roles for initial session if it exists
        if (initialSession?.user) {
          await fetchUserRoles(initialSession.user.id);
        }
        
        return () => {
          console.log("[AuthContext] Cleaning up auth subscription");
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("[AuthContext] Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
  }, [fetchUserRoles]);

  // Computed properties based on userRoles
  const isAdmin = userRoles.includes('office_staff');
  const isBusinessOwner = userRoles.includes('business_owner');
  const isAuthenticated = !!user;

  const value = {
    user,
    session,
    userRoles,
    isAdmin,
    isBusinessOwner,
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
    refreshRoles,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
