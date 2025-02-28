
import { Bell, User, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface UserToolsProps {
  user?: {
    name: string;
    avatar: string;
  };
  settings?: {
    title: string;
    options: {
      label: string;
      action: () => void;
    }[];
  };
}

const UserTools: React.FC<UserToolsProps> = ({ user, settings }) => {
  const { toast } = useToast();

  const handleLogout = () => {
    // In a real app, this would call an authentication service
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Notifications */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" aria-hidden="true"></span>
        <span className="sr-only">You have unread notifications</span>
      </Button>

      {/* User Menu */}
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="relative rounded-full flex items-center gap-2 p-1 px-2"
              aria-label="User menu"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="hidden md:block text-sm font-medium">{user.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem asChild>
              <Link 
                to="/profile" 
                className="flex items-center cursor-pointer"
                aria-label="View profile"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link 
                to="/settings" 
                className="flex items-center cursor-pointer"
                aria-label="View settings"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            
            {/* Custom settings options if provided */}
            {settings && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>{settings.title}</DropdownMenuLabel>
                {settings.options.map((option, index) => (
                  <DropdownMenuItem 
                    key={index} 
                    onClick={option.action}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </>
            )}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600 cursor-pointer"
              onClick={handleLogout}
              aria-label="Log out of your account"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default UserTools;
