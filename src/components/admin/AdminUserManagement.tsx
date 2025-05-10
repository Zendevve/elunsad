
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/utils/toastCompat';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface User {
  id: string;
  email: string;
  created_at: string;
}

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Changed query to get user data from auth.users instead of profiles
      // since email is in auth.users and not in profiles
      const { data: authUsers, error: authError } = await supabase
        .from('auth.users')
        .select('id, email, created_at');

      if (authError) {
        console.error("Error fetching users:", authError);
        toast("Error fetching users", {
          description: "Failed to retrieve user data. Please try again."
        });
        setUsers([]);
      } else if (authUsers) {
        setUsers(authUsers as User[]);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Unexpected error fetching users:", error);
      toast("Unexpected error", {
        description: "An unexpected error occurred while fetching users."
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteToAdmin = async (userId: string) => {
    try {
      // First, check if the user already has the 'office_staff' role
      const { data: existingRole, error: roleError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .eq('role', 'office_staff')
        .single();

      if (roleError && roleError.code !== 'PGRST116') {
        // An error occurred other than "no rows found"
        console.error("Error checking existing role:", roleError);
        toast('Error promoting user', {
          description: "Failed to promote user. Please try again."
        });
        return;
      }

      if (existingRole) {
        // User already has the role
        toast('User is already an admin', {
          description: "This user already has administrator privileges."
        });
        return;
      }

      // If the user doesn't have the role, proceed to insert it
      const { error } = await supabase
        .from('user_roles')
        .insert([{ user_id: userId, role: 'office_staff' }]);

      if (error) {
        console.error("Error promoting user:", error);
        toast('Error promoting user', {
          description: "Failed to promote user. Please try again."
        });
      } else {
        toast('User promoted', {
          description: "User has been successfully promoted to administrator."
        });
        fetchUsers(); // Refresh user list
      }
    } catch (error) {
      console.error("Unexpected error promoting user:", error);
      toast('Unexpected error', {
        description: "An unexpected error occurred while promoting the user."
      });
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'office_staff');

      if (error) {
        console.error("Error removing admin:", error);
        toast('Error removing admin', {
          description: "Failed to remove administrator privileges. Please try again."
        });
      } else {
        toast('Admin privileges removed', {
          description: "Administrator privileges have been successfully removed."
        });
        fetchUsers(); // Refresh user list
      }
    } catch (error) {
      console.error("Unexpected error removing admin:", error);
      toast('Unexpected error', {
        description: "An unexpected error occurred while removing administrator privileges."
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search users by email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="container mx-auto">
          <Table>
            <TableCaption>A list of your registered users.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handlePromoteToAdmin(user.id)}>
                          Promote to Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRemoveAdmin(user.id)}>
                          Remove Admin
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
