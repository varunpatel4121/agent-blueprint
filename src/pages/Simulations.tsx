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
import { Play, Search, Activity, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Simulations = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterEnvironment, setFilterEnvironment] = useState("all");
  const [filterAgent, setFilterAgent] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const simulations = [
    {
      id: "sim-1247",
      name: "Service Compliance Check",
      agent: "Customer Support Bot",
      blueprint: "Service Compliance",
      environment: "production",
      status: "passed",
      score: 92,
      startedAt: "2024-12-14 14:23:15",
      duration: "12 min"
    },
    {
      id: "sim-1246",
      name: "Privacy Audit",
      agent: "Data Processor Agent",
      blueprint: "Privacy & Security",
      environment: "staging",
      status: "failed",
      score: 67,
      startedAt: "2024-12-14 10:15:42",
      duration: "8 min"
    },
    {
      id: "sim-1245",
      name: "Quality Assessment",
      agent: "Email Classifier",
      blueprint: "Response Quality",
      environment: "production",
      status: "passed",
      score: 88,
      startedAt: "2024-12-14 08:30:21",
      duration: "15 min"
    },
    {
      id: "sim-1244",
      name: "Performance Benchmarks",
      agent: "Task Scheduler",
      blueprint: "Performance Tests",
      environment: "dev",
      status: "running",
      score: null,
      startedAt: "2024-12-14 16:45:00",
      duration: "In progress"
    },
    {
      id: "sim-1243",
      name: "Accuracy Tests",
      agent: "Sentiment Analyzer",
      blueprint: "Accuracy Tests",
      environment: "production",
      status: "passed",
      score: 94,
      startedAt: "2024-12-13 15:20:33",
      duration: "10 min"
    },
    {
      id: "sim-1242",
      name: "Edge Case Testing",
      agent: "Invoice Parser",
      blueprint: "Edge Cases",
      environment: "staging",
      status: "failed",
      score: 71,
      startedAt: "2024-12-13 12:10:15",
      duration: "18 min"
    },
  ];

  const getStatusConfig = (status: string) => {
    const configs = {
      running: {
        icon: Activity,
        className: "bg-warning/10 text-warning border-warning/20",
        label: "Running"
      },
      passed: {
        icon: CheckCircle2,
        className: "bg-success/10 text-success border-success/20",
        label: "Passed"
      },
      failed: {
        icon: XCircle,
        className: "bg-destructive/10 text-destructive border-destructive/20",
        label: "Failed"
      },
      queued: {
        icon: Clock,
        className: "bg-muted text-muted-foreground border-border",
        label: "Queued"
      }
    };
    return configs[status as keyof typeof configs] || configs.queued;
  };

  const getEnvironmentBadge = (env: string) => {
    const configs = {
      production: "bg-success/10 text-success border-success/20",
      staging: "bg-warning/10 text-warning border-warning/20",
      dev: "bg-primary/10 text-primary border-primary/20"
    };
    return configs[env as keyof typeof configs] || configs.dev;
  };

  const getScoreBadgeColor = (score: number | null) => {
    if (score === null) return "bg-muted text-muted-foreground";
    if (score >= 90) return "bg-success text-success-foreground";
    if (score >= 75) return "bg-warning/10 text-warning border-warning/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Simulations</h1>
          <p className="text-muted-foreground">Run and monitor test simulations across your agents</p>
        </div>
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
          <Play className="h-4 w-4 mr-2" />
          New Simulation
        </Button>
      </div>

      {/* Filters Bar */}
      <Card className="p-4 border border-border bg-card">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search simulations..."
              className="pl-9 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[160px] bg-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="passed">Passed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="queued">Queued</SelectItem>
            </SelectContent>
          </Select>

          {/* Environment Filter */}
          <Select value={filterEnvironment} onValueChange={setFilterEnvironment}>
            <SelectTrigger className="w-full sm:w-[160px] bg-background">
              <SelectValue placeholder="Environment" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              <SelectItem value="all">All Environments</SelectItem>
              <SelectItem value="production">Production</SelectItem>
              <SelectItem value="staging">Staging</SelectItem>
              <SelectItem value="dev">Development</SelectItem>
            </SelectContent>
          </Select>

          {/* Agent Filter */}
          <Select value={filterAgent} onValueChange={setFilterAgent}>
            <SelectTrigger className="w-full sm:w-[200px] bg-background">
              <SelectValue placeholder="Agent" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              <SelectItem value="all">All Agents</SelectItem>
              <SelectItem value="customer-support">Customer Support Bot</SelectItem>
              <SelectItem value="data-processor">Data Processor Agent</SelectItem>
              <SelectItem value="email-classifier">Email Classifier</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Simulations Table */}
      <Card className="border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase">Run ID</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase">Name</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase">Agent</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase">Blueprint</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase">Environment</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase">Score</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase">Started At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {simulations.map((sim) => {
                const statusConfig = getStatusConfig(sim.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <tr key={sim.id} className="hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-6">
                      <Link 
                        to={`/simulations/${sim.id}`}
                        className="font-mono text-sm text-primary hover:underline"
                      >
                        {sim.id}
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium text-foreground">{sim.name}</span>
                    </td>
                    <td className="py-4 px-6">
                      <Link to="/agents" className="text-sm text-foreground hover:text-primary hover:underline">
                        {sim.agent}
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-muted-foreground">{sim.blueprint}</span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="secondary" className={getEnvironmentBadge(sim.environment)}>
                        {sim.environment}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="secondary" className={statusConfig.className}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      {sim.score !== null ? (
                        <Badge variant="secondary" className={getScoreBadgeColor(sim.score)}>
                          {sim.score}/100
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-muted-foreground">
                        <div>{sim.startedAt.split(' ')[0]}</div>
                        <div className="text-xs">{sim.startedAt.split(' ')[1]}</div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Simulations;
