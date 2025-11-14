import { Home, Plus, PlayCircle } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "New Test", url: "/new", icon: Plus },
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Runs", url: "/runs", icon: PlayCircle },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar className="border-r border-border">
      <SidebarContent>
        {/* Logo/Brand */}
        <div className="px-6 py-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            {open && (
              <div>
                <h1 className="text-foreground font-semibold text-base">Arena</h1>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup className="px-3 py-4">
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium border-l-2 border-primary -ml-3 pl-[10px]"
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {open && <span className="text-sm">{item.title}</span>}
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
