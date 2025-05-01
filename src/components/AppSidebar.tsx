
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  FileText,
  Files,
  PieChart,
  Map,
  Bell,
  Settings,
  User,
  Mail,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function AppSidebar() {
  const location = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  
  // Main navigation items
  const mainNavigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard
    }, 
    {
      name: 'Applications',
      href: '/applications',
      icon: FileText,
      notificationCount: 3
    }, 
    {
      name: 'Documents',
      href: '/documents',
      icon: Files
    }
  ];
  
  // Analytics and tools navigation items
  const analyticsNavigation = [
    {
      name: 'Analytics',
      href: '/analytics',
      icon: PieChart
    }, 
    {
      name: 'Map View',
      href: '/map',
      icon: Map
    }
  ];
  
  // System navigation items
  const systemNavigation = [
    {
      name: 'Notifications',
      href: '/notifications',
      icon: Bell
    }, 
    {
      name: 'Administration',
      href: '/admin',
      icon: Settings
    }
  ];

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isActive = (path: string) => {
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };
  
  return (
    <>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarRail />
        
        <SidebarHeader className="border-b">
          <div className="flex items-center space-x-2 px-1">
            <img alt="Logo" className="h-8 w-8" src="/lovable-uploads/bbd34367-e328-4dff-9103-719d6d3c2bd6.png" />
            <h1 className="text-xl font-bold">eLUNSAD</h1>
          </div>
          <SidebarTrigger />
        </SidebarHeader>
        
        <SidebarContent>
          {/* Main Navigation Group */}
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainNavigation.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive(item.href)}
                      tooltip={item.name}
                    >
                      <Link to={item.href}>
                        <item.icon />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.notificationCount && (
                      <Badge 
                        variant="secondary" 
                        className="absolute right-2 top-1/2 -translate-y-1/2 group-data-[collapsible=icon]:hidden"
                      >
                        {item.notificationCount}
                      </Badge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarSeparator />
          
          {/* Analytics Group */}
          <SidebarGroup>
            <SidebarGroupLabel>Analytics & Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {analyticsNavigation.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive(item.href)}
                      tooltip={item.name}
                    >
                      <Link to={item.href}>
                        <item.icon />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarSeparator />
          
          {/* System Group */}
          <SidebarGroup>
            <SidebarGroupLabel>System</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {systemNavigation.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive(item.href)}
                      tooltip={item.name}
                    >
                      <Link to={item.href}>
                        <item.icon />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter className="border-t">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Profile">
                    <Link to="/profile">
                      <User />
                      <span>Profile</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Help">
                    <Link to="/help">
                      <HelpCircle />
                      <span>Help & Support</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={handleLogout}
                    tooltip="Logout"
                    className="text-destructive hover:text-destructive"
                  >
                    <LogOut />
                    <span>Log out</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
