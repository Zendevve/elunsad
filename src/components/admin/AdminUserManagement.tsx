
import React, { useState, useEffect } from "react";
import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody, TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserPlus, Edit, Trash2, Lock, Check, X, Shield } from "lucide-react";
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

interface User {
  id: string;
  email: string;
  created_at: string;
  user_metadata: {
    firstname?: string;
    lastname?: string;
  };
  last_sign_in_at: string | null;
  roles: UserRole[];
}

const AdminUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();
  
  // Fetch users and their roles
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch all users
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        throw error;
      }
      
      // Convert to our User interface with empty roles array
      const usersData: User[] = data.users.map((user) => ({
        id: user.id,
        email: user.email || '',
        created_at: user.created_at || '',
        user_metadata: user.user_metadata as { firstname?: string; lastname?: string },
        last_sign_in_at: user.last_sign_in_at,
        roles: []
      }));
      
      // For each user, fetch their roles
      for (const user of usersData) {
        const { data: rolesData, error: rolesError } = await supabase.rpc('get_user_roles', {
          _user_id: user.id
        });
        
        if (!rolesError && rolesData) {
          user.roles = rolesData;
        }
      }
      
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Handle adding a role to a user
  const handleAddRole = async (userId: string, role: UserRole) => {
    try {
      const success = await addRoleToUser(userId, role);
      
      if (success) {
        toast({
          title: "Role Added",
          description: `User has been granted ${role} role.`
        });
        await fetchUsers(); // Refresh data
      } else {
        throw new Error("Failed to add role");
      }
    } catch (error) {
      console.error("Error adding role:", error);
      toast({
        title: "Error",
        description: "Failed to add role. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle removing a role from a user
  const handleRemoveRole = async (userId: string, role: UserRole) => {
    try {
      const success = await removeRoleFromUser(userId, role);
      
      if (success) {
        toast({
          title: "Role Removed",
          description: `${role} role has been removed from user.`
        });
        await fetchUsers(); // Refresh data
      } else {
        throw new Error("Failed to remove role");
      }
    } catch (error) {
      console.error("Error removing role:", error);
      toast({
        title: "Error",
        description: "Failed to remove role. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Filter users based on search query and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (user.user_metadata.firstname || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.user_metadata.lastname || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = 
      roleFilter === "all" || 
      (roleFilter === "office_staff" && user.roles.includes("office_staff")) ||
      (roleFilter === "business_owner" && user.roles.includes("business_owner"));
    
    return matchesSearch && matchesRole;
  });
  
  // Format the user's name
  const getUserName = (user: User) => {
    const { firstname, lastname } = user.user_metadata;
    if (firstname && lastname) {
      return `${firstname} ${lastname}`;
    }
    return user.email.split('@')[0];
  };
  
  // Get role badge
  const getRoleBadges = (roles: UserRole[]) => {
    return (
      <div className="flex flex-wrap gap-1">
        {roles.includes("office_staff") && (
          <Badge className="bg-purple-500">Admin</Badge>
        )}
        {roles.includes("business_owner") && (
          <Badge className="bg-blue-500">Business Owner</Badge>
        )}
        {roles.length === 0 && (
          <Badge variant="outline" className="text-gray-500">No Roles</Badge>
        )}
      </div>
    );
  };
  
  // Get active status badge
  const getActiveStatusBadge = (lastSignIn: string | null) => {
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
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="office_staff">Administrators</SelectItem>
              <SelectItem value="business_owner">Business Owners</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            className="pl-9 w-[300px]" 
            placeholder="Search users..." 
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
            <TableHead>Roles</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                <div className="mt-2 text-sm text-gray-500">Loading users...</div>
              </TableCell>
            </TableRow>
          ) : filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="text-sm text-gray-500">No users found</div>
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{getUserName(user)}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleBadges(user.roles)}</TableCell>
                <TableCell>{getActiveStatusBadge(user.last_sign_in_at)}</TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedUser(user)}>
                          <Shield className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Manage User Roles</DialogTitle>
                          <DialogDescription>
                            Add or remove roles for {selectedUser?.email}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <h3 className="font-medium mb-2">Current Roles:</h3>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {selectedUser?.roles.map(role => (
                              <Badge key={role} className="flex items-center gap-1">
                                {role === 'office_staff' ? 'Administrator' : 'Business Owner'}
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1">
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Remove Role</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to remove the {role} role from this user?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => {
                                          if (selectedUser) {
                                            handleRemoveRole(selectedUser.id, role);
                                          }
                                        }}
                                      >
                                        Remove
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </Badge>
                            ))}
                            {selectedUser?.roles.length === 0 && (
                              <span className="text-sm text-gray-500">No roles assigned</span>
                            )}
                          </div>
                          
                          <h3 className="font-medium mb-2">Add Role:</h3>
                          <div className="flex gap-2">
                            {!selectedUser?.roles.includes('office_staff') && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  if (selectedUser) {
                                    handleAddRole(selectedUser.id, 'office_staff');
                                  }
                                }}
                                className="flex items-center gap-1"
                              >
                                <Shield className="h-4 w-4" />
                                Administrator
                              </Button>
                            )}
                            {!selectedUser?.roles.includes('business_owner') && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  if (selectedUser) {
                                    handleAddRole(selectedUser.id, 'business_owner');
                                  }
                                }}
                                className="flex items-center gap-1"
                              >
                                <UserPlus className="h-4 w-4" />
                                Business Owner
                              </Button>
                            )}
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setSelectedUser(null)}>
                            Close
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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

export default AdminUserManagement;
