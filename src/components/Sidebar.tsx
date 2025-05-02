
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

// Streamlined navigation for business owners/applicants
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
    icon: Bell
  }, 
  {
    name: 'Profile',
    href: '/profile',
    icon: User
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
      <nav className="mt-5 px-2 space-y-1">
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
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
