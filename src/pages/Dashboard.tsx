import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Play, 
  Target, 
  AlertTriangle,
  ArrowRight,
  Plus,
  FileText,
  Zap,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const kpis = [
    { 
      label: "Agents Onboarded", 
      value: "24", 
      change: "+8%", 
      trend: "up",
      icon: Users,
      description: "vs last week"
    },
    { 
      label: "Simulations This Week", 
      value: "156", 
      change: "+23%", 
      trend: "up",
      icon: Play,
      description: "vs last week"
    },
    { 
      label: "Average Goal Success", 
      value: "87%", 
      change: "+2.4%", 
      trend: "up",
      icon: Target,
      description: "across all agents"
    },
    { 
      label: "Critical Failures", 
      value: "7", 
      change: "-3", 
      trend: "down",
      icon: AlertTriangle,
      description: "down from last week"
    },
  ];

  const recentSimulations = [
    { 
      id: "SIM-1247", 
      agent: "Customer Support Bot", 
      blueprint: "Service Compliance", 
      status: "passed", 
      score: 92,
      startedAt: "2 hours ago"
    },
    { 
      id: "SIM-1246", 
      agent: "Data Processor Agent", 
      blueprint: "Privacy & Security", 
      status: "failed", 
      score: 67,
      startedAt: "4 hours ago"
    },
    { 
      id: "SIM-1245", 
      agent: "Email Classifier", 
      blueprint: "Response Quality", 
      status: "passed", 
      score: 88,
      startedAt: "6 hours ago"
    },
    { 
      id: "SIM-1244", 
      agent: "Task Scheduler", 
      blueprint: "Performance Benchmarks", 
      status: "running", 
      score: null,
      startedAt: "Running now"
    },
    { 
      id: "SIM-1243", 
      agent: "Sentiment Analyzer", 
      blueprint: "Accuracy Tests", 
      status: "passed", 
      score: 94,
      startedAt: "1 day ago"
    },
  ];

  const agentsNeedingAttention = [
    {
      name: "Data Processor Agent",
      lastScore: 67,
      lastRun: "4 hours ago",
      issue: "Has 3 failing scenarios",
      severity: "high"
    },
    {
      name: "Invoice Parser",
      lastScore: 71,
      lastRun: "1 day ago",
      issue: "Slow response times",
      severity: "medium"
    },
    {
      name: "Order Fulfillment Bot",
      lastScore: 73,
      lastRun: "2 days ago",
      issue: "Compliance warnings",
      severity: "medium"
    },
  ];

  const quickActions = [
    {
      title: "Connect a new agent",
      description: "Add HTTP, MCP, or SDK endpoints",
      icon: Plus,
      link: "/agents",
      variant: "primary" as const
    },
    {
      title: "Create test blueprint",
      description: "Define evaluation criteria",
      icon: FileText,
      link: "/blueprints",
      variant: "secondary" as const
    },
    {
      title: "Run quick simulation",
      description: "Test an agent now",
      icon: Zap,
      link: "/simulations",
      variant: "secondary" as const
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your AI agent testing platform</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="p-6 border border-border bg-card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <kpi.icon className="h-6 w-6 text-primary" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                kpi.trend === "up" 
                  ? "text-success" 
                  : kpi.trend === "down" 
                  ? "text-destructive" 
                  : "text-muted-foreground"
              }`}>
                {kpi.trend === "up" && <TrendingUp className="h-4 w-4" />}
                {kpi.trend === "down" && <TrendingDown className="h-4 w-4" />}
                {kpi.change}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
              <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Simulations - Takes 2 columns */}
        <Card className="lg:col-span-2 border border-border bg-card">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Recent Simulations</h2>
              <p className="text-sm text-muted-foreground">Latest test runs across all agents</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/simulations">
                View all
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase">Run ID</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase">Agent</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase">Blueprint</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase">Status</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase">Score</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase">Started</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentSimulations.map((sim) => (
                  <tr key={sim.id} className="hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-mono text-sm text-foreground">{sim.id}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-foreground font-medium">{sim.agent}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-muted-foreground">{sim.blueprint}</span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        variant={
                          sim.status === "passed"
                            ? "default"
                            : sim.status === "failed"
                            ? "destructive"
                            : "secondary"
                        }
                        className={
                          sim.status === "passed"
                            ? "bg-success text-success-foreground"
                            : sim.status === "running"
                            ? "bg-warning/10 text-warning border-warning/20"
                            : ""
                        }
                      >
                        {sim.status === "running" && <Activity className="h-3 w-3 mr-1 animate-pulse" />}
                        {sim.status === "passed" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {sim.status === "failed" && <XCircle className="h-3 w-3 mr-1" />}
                        {sim.status.charAt(0).toUpperCase() + sim.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      {sim.score !== null ? (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-semibold text-foreground">{sim.score}</span>
                          <span className="text-sm text-muted-foreground">/100</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {sim.startedAt}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          {/* Agents Needing Attention */}
          <Card className="border border-border bg-card">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Needs Attention
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Agents with issues</p>
            </div>
            <div className="divide-y divide-border">
              {agentsNeedingAttention.map((agent, index) => (
                <div key={index} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-foreground text-sm">{agent.name}</h3>
                    <Badge 
                      variant="secondary"
                      className={
                        agent.severity === "high"
                          ? "bg-destructive/10 text-destructive border-destructive/20"
                          : "bg-warning/10 text-warning border-warning/20"
                      }
                    >
                      {agent.severity}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last score</span>
                      <span className="font-semibold text-foreground">{agent.lastScore}/100</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{agent.issue}</p>
                    <p className="text-xs text-muted-foreground">Last run {agent.lastRun}</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3" asChild>
                    <Link to="/agents">
                      View agent
                      <ArrowRight className="h-3 w-3 ml-2" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Start */}
          <Card className="border border-border bg-card">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Quick Start</h2>
              <p className="text-sm text-muted-foreground mt-1">Common actions</p>
            </div>
            <div className="p-4 space-y-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant === "primary" ? "default" : "outline"}
                  className={`w-full justify-start h-auto py-4 ${
                    action.variant === "primary" 
                      ? "bg-primary hover:bg-primary-hover text-primary-foreground" 
                      : ""
                  }`}
                  asChild
                >
                  <Link to={action.link}>
                    <div className="flex items-center gap-3 w-full">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        action.variant === "primary"
                          ? "bg-primary-foreground/10"
                          : "bg-primary/10"
                      }`}>
                        <action.icon className={`h-5 w-5 ${
                          action.variant === "primary"
                            ? "text-primary-foreground"
                            : "text-primary"
                        }`} />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-sm">{action.title}</div>
                        <div className={`text-xs ${
                          action.variant === "primary"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}>
                          {action.description}
                        </div>
                      </div>
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
