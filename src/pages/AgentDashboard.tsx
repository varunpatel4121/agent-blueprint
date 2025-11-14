import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  ExternalLink,
  Edit,
  PlayCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Archive,
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  description: string;
  type: "endpoint" | "yaml";
  endpoint?: string;
  lastRun: string;
  overallScore: number;
  status: "active" | "draft" | "archived";
  scenarios?: any[];
}

interface TestRun {
  id: string;
  name: string;
  timestamp: string;
  scenarioCount: number;
  overallScore: number;
  status: "completed" | "running" | "failed";
}

interface Scenario {
  id: string;
  name: string;
  tags: string[];
  runCount: number;
  avgScore: number;
}

interface Simulation {
  id: string;
  runId: string;
  scenarioName: string;
  status: "pass" | "fail" | "partial";
  score: number;
}

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [timeRange, setTimeRange] = useState("7d");
  const [agents, setAgents] = useState<Agent[]>([]);

  // Load agents from localStorage
  useEffect(() => {
    // Clear all data to start fresh
    localStorage.removeItem("agents");
    localStorage.removeItem("testRuns");
    
    const loadAgents = () => {
      const savedAgents = localStorage.getItem("agents");
      if (savedAgents) {
        setAgents(JSON.parse(savedAgents));
      }
    };
    
    loadAgents();
    
    // Refresh when window gains focus (user navigates back to dashboard)
    const handleFocus = () => loadAgents();
    window.addEventListener("focus", handleFocus);
    
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const toggleArchiveAgent = (agentId: string) => {
    const savedAgents = JSON.parse(localStorage.getItem("agents") || "[]");
    const agentIndex = savedAgents.findIndex((a: any) => a.id === agentId);
    
    if (agentIndex !== -1) {
      const currentStatus = savedAgents[agentIndex].status;
      savedAgents[agentIndex].status = currentStatus === "archived" ? "active" : "archived";
      localStorage.setItem("agents", JSON.stringify(savedAgents));
      setAgents(savedAgents);
      
      // Update selected agent
      if (selectedAgent?.id === agentId) {
        setSelectedAgent(savedAgents[agentIndex]);
      }
    }
  };

  const mockAgents: Agent[] = agents;

  const mockRuns: TestRun[] = selectedAgent 
    ? JSON.parse(localStorage.getItem("testRuns") || "[]").filter(
        (run: any) => run.agentId === selectedAgent.id
      )
    : [];

  const mockScenarios: Scenario[] = selectedAgent?.scenarios || [];

  const mockSimulations: Simulation[] = [];

  const filteredAgents = mockAgents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || agent.type === typeFilter;
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getScoreBadge = (score: number) => {
    if (score >= 80) {
      return <Badge className="bg-success/10 text-success border-success/20">{score}</Badge>;
    } else if (score >= 60) {
      return <Badge className="bg-warning/10 text-warning border-warning/20">{score}</Badge>;
    } else {
      return <Badge variant="destructive">{score}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "fail":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "partial":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pass":
        return <Badge className="bg-success/10 text-success border-success/20">Pass</Badge>;
      case "fail":
        return <Badge variant="destructive">Fail</Badge>;
      case "partial":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Partial</Badge>;
      default:
        return null;
    }
  };

  // Auto-select first agent on load
  if (!selectedAgent && filteredAgents.length > 0) {
    setSelectedAgent(filteredAgents[0]);
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-4">Agent Dashboard</h1>
        
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agents by name, endpoint, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Agents List */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Agents</h2>
              <Button size="sm" onClick={() => navigate("/new")}>
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </div>

            {/* Filters */}
            <div className="space-y-3 mb-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="endpoint">Endpoint</SelectItem>
                  <SelectItem value="yaml">YAML/JSON</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Agent List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredAgents.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedAgent?.id === agent.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  } ${agent.status === "archived" ? "opacity-60" : ""}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground">{agent.name}</h3>
                      {agent.status === "archived" && (
                        <Badge variant="secondary" className="text-xs">
                          <Archive className="h-3 w-3 mr-1" />
                          Archived
                        </Badge>
                      )}
                    </div>
                    {getScoreBadge(agent.overallScore)}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                    {agent.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {agent.type === "endpoint" ? "Endpoint" : "YAML/JSON"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{agent.lastRun}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Agent Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedAgent ? (
            <>
              {/* Agent Overview */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      {selectedAgent.name}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      {selectedAgent.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Type:</span>
                        <Badge variant="outline">
                          {selectedAgent.type === "endpoint" ? "POST Endpoint" : "YAML/JSON Spec"}
                        </Badge>
                      </div>
                      {selectedAgent.endpoint && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Endpoint:</span>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {selectedAgent.endpoint}
                          </code>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-2">Latest Score</p>
                    <div className="text-4xl font-bold text-foreground">
                      {selectedAgent.overallScore}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={() => navigate("/new", { state: { agentName: selectedAgent.name } })}>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Run New Test
                  </Button>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Spec
                  </Button>
                  <Button 
                    variant={selectedAgent.status === "archived" ? "default" : "outline"}
                    onClick={() => toggleArchiveAgent(selectedAgent.id)}
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    {selectedAgent.status === "archived" ? "Unarchive" : "Archive"}
                  </Button>
                  {selectedAgent.endpoint && (
                    <Button variant="outline" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </Card>

              {/* Recent Test Runs */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Recent Test Runs</h3>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24 hours</SelectItem>
                      <SelectItem value="7d">7 days</SelectItem>
                      <SelectItem value="30d">30 days</SelectItem>
                      <SelectItem value="all">All time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  {mockRuns.map((run) => (
                    <div
                      key={run.id}
                      onClick={() => navigate("/run", { state: { agentName: selectedAgent.name } })}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground mb-1">{run.name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{run.timestamp}</span>
                          <span>•</span>
                          <span>{run.scenarioCount} scenarios</span>
                          <span>•</span>
                          <Badge
                            variant="outline"
                            className={
                              run.status === "completed"
                                ? "border-success/20 text-success"
                                : run.status === "running"
                                ? "border-primary/20 text-primary"
                                : "border-destructive/20 text-destructive"
                            }
                          >
                            {run.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">{getScoreBadge(run.overallScore)}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Scenarios & Simulations */}
              <Card className="p-6">
                <Tabs defaultValue="scenarios">
                  <TabsList className="mb-4">
                    <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
                    <TabsTrigger value="simulations">Simulations</TabsTrigger>
                  </TabsList>

                  <TabsContent value="scenarios" className="space-y-2">
                    {mockScenarios.map((scenario) => (
                      <div
                        key={scenario.id}
                        onClick={() => navigate(`/simulation/${scenario.id}`)}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground mb-2">
                            {scenario.name}
                          </p>
                          <div className="flex items-center gap-2">
                            {scenario.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground mb-1">
                            {scenario.runCount} runs
                          </div>
                          {getScoreBadge(scenario.avgScore)}
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="simulations" className="space-y-2">
                    {mockSimulations.map((sim) => (
                      <div
                        key={sim.id}
                        onClick={() => navigate(`/simulation/${sim.id}`, { 
                          state: { 
                            scenario: {
                              id: sim.id,
                              name: sim.scenarioName,
                              status: sim.status,
                              score: sim.score,
                              type: "constraints",
                              prompt: "I need size M, can only pick up in San Francisco",
                              response: "Size M is available. Our stores are located nationwide.",
                              expected: ["Detect location-specific request", "Query SF store inventory specifically", "Respond with SF-scoped availability"],
                              why: ["Missed the location cue in user request", "Returned generic nationwide inventory response", "Did not perform SF-specific availability check"],
                              impact: "Creates misleading availability results and can cause incorrect orders or wasted customer trips to stores without stock.",
                              suggestions: [
                                "Add explicit location-awareness logic to parse city/store names",
                                "Filter inventory queries by detected store or city parameter",
                                "Include validation ensuring response matches requested location",
                                "If location data unavailable, ask user to confirm their store preference"
                              ]
                            }
                          }
                        })}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {getStatusIcon(sim.status)}
                          <div>
                            <p className="text-sm font-medium text-foreground mb-1">
                              {sim.scenarioName}
                            </p>
                            <p className="text-xs text-muted-foreground">Run: {sim.runId}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(sim.status)}
                          <div className="text-sm font-semibold text-foreground">
                            {sim.score}/100
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </Card>
            </>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Select an agent to view details</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
