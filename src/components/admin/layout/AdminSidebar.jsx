import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Shield,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigation = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    href: "/users",
    icon: Users,
  },
  {
    title: "Roles & Permissions",
    href: "/roles",
    icon: Shield,
  },
  {
    title: "Feedback",
    href: "/feedback",
    icon: MessageSquare,
  },
  {
    title: "Token Usage",
    href: "/tokens",
    icon: Zap,
  },
  {
    title: "Live Sessions",
    href: "/sessions",
    icon: Activity,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar
      className={cn(
        "border-r border-border/50 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <SidebarContent className="bg-gradient-to-b from-mocklingo-dark to-secondary">
        {/* Logo Section */}
        <div className="flex items-center p-4 border-b border-border/20">
          {!collapsed ? (
            <div className="flex items-center space-x-2">
              <div className="text-xl font-bold text-primary">MOCKLINGO</div>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                Admin
              </span>
            </div>
          ) : (
            <div className="text-xl font-bold text-primary text-center w-full">
              M
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel
            className={cn(
              "text-muted-foreground px-4 py-2",
              collapsed && "sr-only"
            )}
          >
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "w-full justify-start transition-colors hover:bg-primary/10",
                      isActive(item.href) &&
                        "bg-primary/20 text-primary border-r-2 border-primary"
                    )}
                  >
                    <NavLink
                      to={item.href}
                      className="flex items-center space-x-3 p-2 rounded-lg"
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
