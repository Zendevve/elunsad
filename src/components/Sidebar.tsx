
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, FileText, Bell, User, ClipboardList, Settings,
  Menu, Users, BarChart4, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isAdmin: boolean;
  isBusinessOwner: boolean;
}

// Navigation items for business owners
const businessNavigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  }, 
  {
    name: 'Applications',
    href: '/applications',
    icon: FileText
  }, 
  {
    name: 'Notifications',
    href: '/notifications',
    icon: Bell,
    badge: 3 // Example for notification count
  }, 
  {
    name: 'Profile',
    href: '/profile',
    icon: User
  },
  {
    name: 'Status Tracker',
    href: '/status',
    icon: ClipboardList
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings
  }
];

// Navigation items for admin staff
const adminNavigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Administration',
    href: '/admin',
    icon: Users
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart4
  },
  {
    name: 'Map View',
    href: '/map',
    icon: MapPin
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: Bell,
    badge: 5 // Example for notification count
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings
  }
];

const Sidebar: React.FC<SidebarProps> = ({ 
  isSidebarOpen, 
  setIsSidebarOpen,
  isAdmin,
  isBusinessOwner
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Choose navigation items based on user role
  const navigation = isAdmin ? adminNavigation : businessNavigation;

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <img alt="Logo" className="h-8 w-8" src="/lovable-uploads/bbd34367-e328-4dff-9103-719d6d3c2bd6.png" />
          <h1 className="text-xl font-bold">eLUNSAD</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="p-4 border-b">
        <div className="text-sm text-gray-500 font-medium">Business Licensing Office</div>
        <div className="text-xs text-gray-400">City of Lucena</div>
      </div>
      
      <nav className="mt-2 px-2 space-y-1">
        {navigation.map(item => (
          <Link 
            key={item.name} 
            to={item.href}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 ${
              currentPath === item.href || currentPath.startsWith(`${item.href}/`) 
                ? 'bg-gray-100 text-primary' 
                : 'text-gray-600'
            }`}
          >
            <item.icon className="mr-3 h-5 w-5" />
            <span>{item.name}</span>
            
            {/* Badge for notifications */}
            {item.badge && (
              <span className="ml-auto bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
            {isAdmin ? "A" : "U"}
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium">
              {isAdmin ? "Office Staff" : "Business Owner"}
            </div>
            <div className="text-xs text-gray-500">
              {isAdmin ? "Administrator" : "User"}
            </div>
          </div>
          <Badge className="ml-auto" color={isAdmin ? "purple" : "blue"}>
            {isAdmin ? "Staff" : "User"}
          </Badge>
        </div>
      </div>
    </div>
  );
};

// Simple Badge component
const Badge = ({ children, color = "blue", className = "" }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800",
    purple: "bg-purple-100 text-purple-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
  };
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[color]} ${className}`}>
      {children}
    </span>
  );
};

export default Sidebar;
