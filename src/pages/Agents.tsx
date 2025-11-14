import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Bot, MoreVertical, Play, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { AddAgentDialog } from "@/components/AddAgentDialog";

const Agents = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterTag, setFilterTag] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const agents = [
    {
      id: "agent-001",
      name: "Customer Support Bot",
      type: "Customer Support",
      interface: "HTTP Endpoint",
      lastTested: "2 hours ago",
      lastScore: 92,
      status: "active",
      tags: ["production", "high-priority"],
      description: "Handles customer inquiries and support tickets"
    },
    {
      id: "agent-002",
      name: "Data Processor Agent",
      type: "Data Processing",
      interface: "MCP Server",
      lastTested: "4 hours ago",
      lastScore: 67,
      status: "warning",
      tags: ["staging", "experimental"],
      description: "Processes and validates incoming data streams"
    },
    {
      id: "agent-003",
      name: "Email Classifier",
      type: "Classification",
      interface: "SDK",
      lastTested: "6 hours ago",
      lastScore: 88,
      status: "active",
      tags: ["production"],
      description: "Categorizes and routes incoming emails"
    },
    {
      id: "agent-004",
      name: "Task Scheduler",
      type: "Automation",
      interface: "HTTP Endpoint",
      lastTested: "2 days ago",
      lastScore: 76,
      status: "inactive",
      tags: ["staging"],
      description: "Schedules and manages automated tasks"
    },
    {
      id: "agent-005",
      name: "Sentiment Analyzer",
      type: "Analysis",
      interface: "HTTP Endpoint",
      lastTested: "1 day ago",
      lastScore: 94,
      status: "active",
      tags: ["production", "analytics"],
      description: "Analyzes sentiment in customer feedback"
    },
    {
      id: "agent-006",
      name: "Invoice Parser",
      type: "Financial Ops",
      interface: "SDK",
      lastTested: "1 day ago",
      lastScore: 71,
      status: "warning",
      tags: ["production", "finance"],
      description: "Extracts data from invoice documents"
    },
  ];

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-success text-success-foreground";
    if (score >= 75) return "bg-warning/10 text-warning border-warning/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: "Active", className: "bg-success/10 text-success border-success/20" },
      warning: { label: "Issues", className: "bg-warning/10 text-warning border-warning/20" },
      inactive: { label: "Inactive", className: "bg-muted text-muted-foreground border-border" },
    };
    return config[status as keyof typeof config] || config.inactive;
  };

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Agents</h1>
          <p className="text-muted-foreground">Manage and monitor your AI agents</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary-hover text-primary-foreground"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Agent
        </Button>
      </div>

      {/* Filters Bar */}
      <Card className="p-4 border border-border bg-card">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agents..."
              className="pl-9 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[200px] bg-background">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="customer-support">Customer Support</SelectItem>
              <SelectItem value="data-processing">Data Processing</SelectItem>
              <SelectItem value="classification">Classification</SelectItem>
              <SelectItem value="automation">Automation</SelectItem>
              <SelectItem value="analysis">Analysis</SelectItem>
              <SelectItem value="financial-ops">Financial Ops</SelectItem>
            </SelectContent>
          </Select>

          {/* Tag Filter */}
          <Select value={filterTag} onValueChange={setFilterTag}>
            <SelectTrigger className="w-full sm:w-[200px] bg-background">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              <SelectItem value="all">All Tags</SelectItem>
              <SelectItem value="production">Production</SelectItem>
              <SelectItem value="staging">Staging</SelectItem>
              <SelectItem value="experimental">Experimental</SelectItem>
              <SelectItem value="high-priority">High Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Agents Table */}
      <Card className="border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase">Agent</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase">Type</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase">Interface</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase">Last Score</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase">Last Tested</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase">Tags</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-muted/50 transition-colors">
                  <td className="py-4 px-6">
                    <Link to={`/agents/${agent.id}`} className="hover:underline">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{agent.name}</div>
                          <div className="text-sm text-muted-foreground">{agent.description}</div>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-foreground">{agent.type}</span>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant="secondary" className="font-normal">
                      {agent.interface}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant="secondary" className={getStatusBadge(agent.status).className}>
                      {getStatusBadge(agent.status).label}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant="secondary" className={getScoreBadgeColor(agent.lastScore)}>
                      {agent.lastScore}/100
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-muted-foreground">{agent.lastTested}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {agent.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border z-50">
                        <DropdownMenuItem className="cursor-pointer" asChild>
                          <Link to={`/agents/${agent.id}`}>
                            <Bot className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Play className="h-4 w-4 mr-2" />
                          Run Test
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Agent Dialog */}
      <AddAgentDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
};

export default Agents;
