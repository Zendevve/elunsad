
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Bell, User, ClipboardList, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

// Navigation items for both applicants and staff
const navigation = [
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

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();
  const currentPath = location.pathname;

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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
              JD
            </div>
            <div>
              <div className="text-sm font-medium">John Doe</div>
              <div className="text-xs text-gray-500">Business Owner</div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
