import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Bell, ChevronDown, Building2, User, Settings, LogOut } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Top App Bar */}
          <header className="h-16 border-b border-border bg-card flex items-center px-6 gap-6 flex-shrink-0">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground -ml-2" />
            
            {/* Workspace Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-3 hover:bg-accent">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">Acme Corp</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-popover border-border z-50">
                <DropdownMenuLabel className="text-xs text-muted-foreground uppercase">
                  Workspaces
                </DropdownMenuLabel>
                <DropdownMenuItem className="cursor-pointer">
                  <Building2 className="h-4 w-4 mr-2" />
                  Acme Corp
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Building2 className="h-4 w-4 mr-2" />
                  Personal Workspace
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <span className="text-primary">+ Create Workspace</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Environment Badge */}
            <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20 hover:bg-warning/10">
              <span className="w-1.5 h-1.5 rounded-full bg-warning mr-1.5" />
              Staging
            </Badge>

            {/* Global Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search agents, tests, reports..."
                  className="pl-9 bg-muted/50 border-border focus-visible:ring-primary"
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative hover:bg-accent">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-popover border-border z-50">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-96 overflow-auto">
                    <DropdownMenuItem className="cursor-pointer py-3 flex-col items-start">
                      <div className="font-medium text-foreground">Simulation completed</div>
                      <div className="text-sm text-muted-foreground">Customer Support Bot scored 92/100</div>
                      <div className="text-xs text-muted-foreground mt-1">2 hours ago</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer py-3 flex-col items-start">
                      <div className="font-medium text-foreground">Test failed</div>
                      <div className="text-sm text-muted-foreground">Data Processor Agent failed security checks</div>
                      <div className="text-xs text-muted-foreground mt-1">4 hours ago</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer py-3 flex-col items-start">
                      <div className="font-medium text-foreground">New agent connected</div>
                      <div className="text-sm text-muted-foreground">Email Classifier is now active</div>
                      <div className="text-xs text-muted-foreground mt-1">6 hours ago</div>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer justify-center text-primary">
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-2 hover:bg-accent">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">JD</AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:flex flex-col items-start">
                      <span className="text-sm font-medium text-foreground">John Doe</span>
                      <span className="text-xs text-muted-foreground">john@acme.com</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground hidden lg:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover border-border z-50">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">John Doe</span>
                      <span className="text-xs text-muted-foreground font-normal">john@acme.com</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
