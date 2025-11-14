import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import {
  Download,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Bot,
} from "lucide-react";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("portfolio");

  const portfolioKPIs = [
    { label: "Agents Tested", value: "24", icon: Bot },
    { label: "Average Score", value: "87", icon: TrendingUp },
    { label: "Below Threshold", value: "3", icon: AlertTriangle },
    { label: "Certified", value: "18", icon: CheckCircle2 },
  ];

  const agentRisks = [
    { id: "agent-002", name: "Data Processor Agent", lastScore: 67, risk: "high", issues: 5 },
    { id: "agent-006", name: "Invoice Parser", lastScore: 71, risk: "medium", issues: 2 },
    { id: "agent-004", name: "Task Scheduler", lastScore: 76, risk: "medium", issues: 1 },
  ];

  const agentReports = [
    { id: "agent-001", name: "Customer Support Bot", lastScore: 92, lastTested: "2 hours ago", status: "certified" },
    { id: "agent-003", name: "Email Classifier", lastScore: 88, lastTested: "6 hours ago", status: "certified" },
    { id: "agent-005", name: "Sentiment Analyzer", lastScore: 94, lastTested: "1 day ago", status: "certified" },
    { id: "agent-002", name: "Data Processor Agent", lastScore: 67, lastTested: "4 hours ago", status: "at-risk" },
    { id: "agent-006", name: "Invoice Parser", lastScore: 71, lastTested: "1 day ago", status: "needs-review" },
    { id: "agent-004", name: "Task Scheduler", lastScore: 76, lastTested: "2 days ago", status: "needs-review" },
  ];

  const getRiskBadge = (risk: string) => {
    const configs = {
      high: { label: "High Risk", className: "bg-destructive/10 text-destructive border-destructive/20" },
      medium: { label: "Medium Risk", className: "bg-warning/10 text-warning border-warning/20" },
      low: { label: "Low Risk", className: "bg-success/10 text-success border-success/20" },
    };
    return configs[risk as keyof typeof configs] || configs.medium;
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      certified: { label: "Certified", className: "bg-success/10 text-success border-success/20" },
      "at-risk": { label: "At Risk", className: "bg-destructive/10 text-destructive border-destructive/20" },
      "needs-review": { label: "Needs Review", className: "bg-warning/10 text-warning border-warning/20" },
    };
    return configs[status as keyof typeof configs] || configs["needs-review"];
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Reports</h1>
          <p className="text-muted-foreground">Portfolio analytics and agent-level insights</p>
        </div>
        <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export All</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="portfolio">Portfolio Overview</TabsTrigger>
          <TabsTrigger value="agents">Agent Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {portfolioKPIs.map((kpi) => (
              <Card key={kpi.label} className="p-6 border border-border bg-card">
                <kpi.icon className="h-8 w-8 text-primary mb-2" />
                <div className="text-3xl font-bold text-foreground mb-1">{kpi.value}</div>
                <div className="text-sm text-muted-foreground">{kpi.label}</div>
              </Card>
            ))}
          </div>

          <Card className="border border-border bg-card">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />Agents Requiring Attention
              </h2>
            </div>
            <div className="divide-y divide-border">
              {agentRisks.map((agent) => {
                const riskBadge = getRiskBadge(agent.risk);
                return (
                  <div key={agent.id} className="p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-foreground">{agent.name}</h3>
                        <Badge variant="secondary" className={riskBadge.className}>{riskBadge.label}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Last score: {agent.lastScore}/100</span>
                        <span>•</span>
                        <span>{agent.issues} open issues</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild><Link to={`/reports/agents/${agent.id}`}>View Report</Link></Button>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6 mt-6">
          <Card className="border border-border bg-card overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">All Agent Reports</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/30">
                  <tr>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase">Agent</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase">Status</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase">Last Score</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {agentReports.map((agent) => {
                    const statusBadge = getStatusBadge(agent.status);
                    return (
                      <tr key={agent.id} className="hover:bg-muted/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Bot className="h-5 w-5 text-primary" />
                            </div>
                            <span className="font-medium text-foreground">{agent.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6"><Badge variant="secondary" className={statusBadge.className}>{statusBadge.label}</Badge></td>
                        <td className="py-4 px-6">
                          <span className="text-lg font-semibold text-foreground">{agent.lastScore}</span>
                          <span className="text-sm text-muted-foreground">/100</span>
                        </td>
                        <td className="py-4 px-6"><Button variant="outline" size="sm" asChild><Link to={`/reports/agents/${agent.id}`}>View Report</Link></Button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
