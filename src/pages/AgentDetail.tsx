import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bot,
  ArrowLeft,
  Play,
  Settings,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  Clock,
  Globe,
  Shield,
  Zap,
  Target,
} from "lucide-react";
import { BlueprintGenerator } from "@/components/BlueprintGenerator";

const AgentDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock agent data - in real app, fetch based on id
  const agent = {
    id: id || "agent-001",
    name: "Customer Support Bot",
    type: "Customer Support",
    interface: "HTTP Endpoint",
    description: "Handles customer inquiries and support tickets with natural language understanding. Escalates complex issues to human agents when needed.",
    lastScore: 92,
    lastTested: "2 hours ago",
    status: "active",
    tags: ["production", "high-priority"],
    endpoint: "https://api.example.com/agents/customer-support",
    authMethod: "Bearer Token",
    createdAt: "2024-11-01",
    testRuns: 145,
    avgScore: 89,
    successRate: 94,
  };

  const recentTests = [
    { id: "SIM-1247", blueprint: "Service Compliance", score: 92, status: "passed", date: "2 hours ago" },
    { id: "SIM-1234", blueprint: "Response Quality", score: 88, status: "passed", date: "1 day ago" },
    { id: "SIM-1221", blueprint: "Performance Benchmarks", score: 91, status: "passed", date: "2 days ago" },
    { id: "SIM-1208", blueprint: "Service Compliance", score: 87, status: "passed", date: "3 days ago" },
    { id: "SIM-1195", blueprint: "Security Tests", score: 73, status: "failed", date: "4 days ago" },
  ];

  const capabilities = [
    { name: "Natural Language Understanding", coverage: 95 },
    { name: "Sentiment Analysis", coverage: 88 },
    { name: "Context Retention", coverage: 92 },
    { name: "Multi-turn Conversation", coverage: 87 },
    { name: "Escalation Logic", coverage: 90 },
  ];

  const goals = [
    { name: "Maintain >90% customer satisfaction", status: "met" },
    { name: "Response time under 2 seconds", status: "met" },
    { name: "Escalation rate below 15%", status: "at-risk" },
    { name: "Handle 1000+ queries/day", status: "met" },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Back Navigation */}
      <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
        <Link to="/agents">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Agents
        </Link>
      </Button>

      {/* Hero Section */}
      <Card className="p-8 border border-border bg-card">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{agent.name}</h1>
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                  Active
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4">{agent.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  {agent.interface}
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  {agent.authMethod}
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Last tested {agent.lastTested}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
              <Play className="h-4 w-4 mr-2" />
              Run Test
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-6 pt-6 border-t border-border">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Last Score</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-foreground">{agent.lastScore}</p>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Average Score</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-foreground">{agent.avgScore}</p>
              <span className="text-sm text-success flex items-center">
                <TrendingUp className="h-4 w-4" />
                +2.4%
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-foreground">{agent.successRate}%</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Tests</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-foreground">{agent.testRuns}</p>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-6 border-t border-border mt-6">
          {agent.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="goals">Goals & Capabilities</TabsTrigger>
          <TabsTrigger value="coverage">Test Coverage</TabsTrigger>
          <TabsTrigger value="blueprint">Generate Blueprint</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Test Results */}
            <Card className="border border-border bg-card">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Recent Test Results</h3>
              </div>
              <div className="divide-y divide-border">
                {recentTests.map((test) => (
                  <div key={test.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm text-foreground">{test.id}</span>
                      <Badge
                        variant={test.status === "passed" ? "default" : "destructive"}
                        className={test.status === "passed" ? "bg-success text-success-foreground" : ""}
                      >
                        {test.status === "passed" ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {test.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{test.blueprint}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{test.date}</span>
                      <span className="font-semibold text-foreground">{test.score}/100</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Performance Metrics */}
            <Card className="border border-border bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Performance Metrics</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Response Time</span>
                    <span className="text-sm font-medium text-foreground">1.2s avg</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: "85%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Accuracy</span>
                    <span className="text-sm font-medium text-foreground">94%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "94%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Reliability</span>
                    <span className="text-sm font-medium text-foreground">98%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: "98%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Compliance</span>
                    <span className="text-sm font-medium text-foreground">91%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "91%" }} />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="config">
          <Card className="border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Agent Configuration</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Type</p>
                  <p className="text-foreground font-medium">{agent.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Interface</p>
                  <p className="text-foreground font-medium">{agent.interface}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Authentication</p>
                  <p className="text-foreground font-medium">{agent.authMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Created</p>
                  <p className="text-foreground font-medium">{agent.createdAt}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Endpoint URL</p>
                <code className="block p-3 bg-muted rounded-md text-sm text-foreground font-mono">
                  {agent.endpoint}
                </code>
              </div>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Edit Configuration
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Goals & Capabilities Tab */}
        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border border-border bg-card">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Performance Goals
                </h3>
              </div>
              <div className="divide-y divide-border">
                {goals.map((goal, idx) => (
                  <div key={idx} className="p-4">
                    <div className="flex items-start justify-between">
                      <p className="text-sm text-foreground">{goal.name}</p>
                      <Badge
                        variant="secondary"
                        className={
                          goal.status === "met"
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-warning/10 text-warning border-warning/20"
                        }
                      >
                        {goal.status === "met" ? "Met" : "At Risk"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border border-border bg-card">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Capabilities
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {capabilities.map((capability, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground">{capability.name}</span>
                      <span className="text-sm font-medium text-foreground">{capability.coverage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${capability.coverage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Test Coverage Tab */}
        <TabsContent value="coverage">
          <Card className="border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Test Coverage</h3>
            <p className="text-muted-foreground">
              Detailed test coverage analysis and recommendations coming soon.
            </p>
          </Card>
        </TabsContent>

        {/* Blueprint Generator Tab */}
        <TabsContent value="blueprint">
          <BlueprintGenerator 
            agentName={agent.name}
            agentDescription={agent.description}
          />
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card className="border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Test History</h3>
            <p className="text-muted-foreground">
              Complete test history with trend analysis coming soon.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentDetail;
