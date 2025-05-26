
import React, { useState, useEffect } from "react";
import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody, TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserPlus, Shield, Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { UserRole } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { addRoleToUser, removeRoleFromUser } from "@/utils/roleUtils";

interface BusinessOwner {
  id: string;
  email: string;
  created_at: string;
  user_metadata: {
    firstname?: string;
    lastname?: string;
  };
  last_sign_in_at: string | null;
  roles: UserRole[];
  applicationCount?: number;
}

const BusinessOwnerManagement = () => {
  const [businessOwners, setBusinessOwners] = useState<BusinessOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<BusinessOwner | null>(null);
  const { toast } = useToast();
  
  // Fetch business owners and their data
  const fetchBusinessOwners = async () => {
    setLoading(true);
    try {
      // Fetch all users
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        throw error;
      }
      
      // Convert to our BusinessOwner interface
      const usersData: BusinessOwner[] = data.users.map((user) => ({
        id: user.id,
        email: user.email || '',
        created_at: user.created_at || '',
        user_metadata: user.user_metadata as { firstname?: string; lastname?: string },
        last_sign_in_at: user.last_sign_in_at,
        roles: [],
        applicationCount: 0
      }));
      
      // For each user, fetch their roles and application count
      for (const user of usersData) {
        // Get roles
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
        
        if (!rolesError && rolesData) {
          user.roles = rolesData.map(item => item.role as UserRole);
        }
        
        // Get application count for business owners
        if (user.roles.includes('business_owner')) {
          const { count, error: countError } = await supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
          
          if (!countError) {
            user.applicationCount = count || 0;
          }
        }
      }
      
      // Filter to show only business owners and users without roles (potential business owners)
      const filteredUsers = usersData.filter(user => 
        user.roles.includes('business_owner') || 
        (user.roles.length === 0 && !user.roles.includes('office_staff'))
      );
      
      setBusinessOwners(filteredUsers);
    } catch (error) {
      console.error("Error fetching business owners:", error);
      toast({
        title: "Error",
        description: "Failed to load business owners. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBusinessOwners();
  }, []);
  
  // Handle adding business owner role
  const handleAddBusinessOwnerRole = async (userId: string) => {
    try {
      const success = await addRoleToUser(userId, 'business_owner');
      
      if (success) {
        toast({
          title: "Business Owner Role Added",
          description: "User has been granted business owner access."
        });
        await fetchBusinessOwners(); // Refresh data
      } else {
        throw new Error("Failed to add business owner role");
      }
    } catch (error) {
      console.error("Error adding business owner role:", error);
      toast({
        title: "Error",
        description: "Failed to add business owner role. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle removing business owner role
  const handleRemoveBusinessOwnerRole = async (userId: string) => {
    try {
      const success = await removeRoleFromUser(userId, 'business_owner');
      
      if (success) {
        toast({
          title: "Business Owner Role Removed",
          description: "Business owner access has been revoked."
        });
        await fetchBusinessOwners(); // Refresh data
      } else {
        throw new Error("Failed to remove business owner role");
      }
    } catch (error) {
      console.error("Error removing business owner role:", error);
      toast({
        title: "Error",
        description: "Failed to remove business owner role. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Filter business owners based on search query and status filter
  const filteredBusinessOwners = businessOwners.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (user.user_metadata.firstname || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.user_metadata.lastname || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && user.roles.includes("business_owner")) ||
      (statusFilter === "pending" && !user.roles.includes("business_owner"));
    
    return matchesSearch && matchesStatus;
  });
  
  // Format the user's name
  const getUserName = (user: BusinessOwner) => {
    const { firstname, lastname } = user.user_metadata;
    if (firstname && lastname) {
      return `${firstname} ${lastname}`;
    }
    return user.email.split('@')[0];
  };
  
  // Get status badge
  const getStatusBadge = (user: BusinessOwner) => {
    if (user.roles.includes("business_owner")) {
      return <Badge className="bg-green-500">Active Business Owner</Badge>;
    } else {
      return <Badge variant="outline" className="text-orange-600 border-orange-600">Pending Access</Badge>;
    }
  };
  
  // Get activity status badge
  const getActivityStatusBadge = (lastSignIn: string | null) => {
    if (!lastSignIn) {
      return <Badge variant="outline" className="bg-gray-100 text-gray-600">Never Signed In</Badge>;
    }
    
    const lastActive = new Date(lastSignIn);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) {
      return <Badge className="bg-green-500">Active</Badge>;
    } else if (diffDays < 30) {
      return <Badge className="bg-yellow-500">Inactive</Badge>;
    } else {
      return <Badge variant="outline" className="bg-gray-200 text-gray-800">Dormant</Badge>;
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active Business Owners</SelectItem>
              <SelectItem value="pending">Pending Access</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            className="pl-9 w-[300px]" 
            placeholder="Search business owners..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Activity</TableHead>
            <TableHead>Applications</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                <div className="mt-2 text-sm text-gray-500">Loading business owners...</div>
              </TableCell>
            </TableRow>
          ) : filteredBusinessOwners.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="text-sm text-gray-500">No business owners found</div>
              </TableCell>
            </TableRow>
          ) : (
            filteredBusinessOwners.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{getUserName(user)}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getStatusBadge(user)}</TableCell>
                <TableCell>{getActivityStatusBadge(user.last_sign_in_at)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span>{user.applicationCount || 0}</span>
                  </div>
                </TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {user.roles.includes('business_owner') ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                            <Shield className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Business Owner Access</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove business owner access for {user.email}? 
                              They will no longer be able to create or manage business applications.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleRemoveBusinessOwnerRole(user.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Remove Access
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleAddBusinessOwnerRole(user.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BusinessOwnerManagement;
