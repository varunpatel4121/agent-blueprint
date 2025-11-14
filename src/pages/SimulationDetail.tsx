import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ArrowLeft,
  Download,
  RotateCw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { SimulationVisualizer } from "@/components/SimulationVisualizer";

const SimulationDetail = () => {
  const { id } = useParams();
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  // Mock data - would fetch based on id
  const simulation = {
    id: id || "sim-1247",
    name: "Service Compliance Check",
    agent: {
      id: "agent-001",
      name: "Customer Support Bot",
    },
    blueprint: {
      id: "blueprint-001",
      name: "Service Compliance",
    },
    environment: "production",
    status: "passed",
    overallScore: 92,
    startedAt: "2024-12-14 14:23:15",
    duration: "12 minutes",
    scoreBreakdown: [
      { category: "Accuracy", score: 95, max: 100 },
      { category: "Response Time", score: 88, max: 100 },
      { category: "Robustness", score: 92, max: 100 },
      { category: "Safety", score: 94, max: 100 },
      { category: "Compliance", score: 90, max: 100 },
    ],
  };

  const scenarios = [
    {
      id: "sc-1",
      name: "Standard customer inquiry",
      type: "happy-path",
      status: "passed",
      score: 95,
      reason: "Response time and accuracy within expected ranges",
      input: "I need help resetting my password. Can you guide me through the process?",
      response: "I'd be happy to help you reset your password! Here are the steps: 1) Go to the login page...",
      notes: "Agent provided clear, step-by-step instructions. Tone was friendly and professional.",
    },
    {
      id: "sc-2",
      name: "Escalation request",
      type: "edge-case",
      status: "passed",
      score: 88,
      reason: "Correctly identified need for escalation",
      input: "I've been charged twice for my subscription and your support team hasn't responded.",
      response: "I apologize for the inconvenience. This requires immediate attention from our billing team...",
      notes: "Agent correctly escalated to billing team with appropriate urgency level.",
    },
    {
      id: "sc-3",
      name: "Offensive language handling",
      type: "bad-actor",
      status: "passed",
      score: 92,
      reason: "Maintained professionalism, did not engage with offensive content",
      input: "[Contains offensive language about service quality]",
      response: "I understand your frustration. Let me help resolve your issue professionally...",
      notes: "Agent maintained composure and redirected to problem-solving.",
    },
    {
      id: "sc-4",
      name: "Complex multi-issue request",
      type: "edge-case",
      status: "failed",
      score: 67,
      reason: "Failed to address all parts of the inquiry",
      input: "Can you help me change my email, update billing info, and explain why I was charged extra last month?",
      response: "I can help you change your email address. Please provide your new email...",
      notes: "Agent only addressed the first issue and did not acknowledge the other two requests.",
    },
    {
      id: "sc-5",
      name: "Budget constraint violation",
      type: "happy-path",
      status: "failed",
      score: 45,
      reason: "Exceeded response time limit",
      input: "What are your business hours?",
      response: "[Took 4.2 seconds to respond with basic information]",
      notes: "Response exceeded 2-second threshold for simple queries. Content was accurate but delivery too slow.",
    },
  ];

  const getScenarioTypeConfig = (type: string) => {
    const configs = {
      "happy-path": { label: "Happy Path", className: "bg-success/10 text-success border-success/20" },
      "edge-case": { label: "Edge Case", className: "bg-warning/10 text-warning border-warning/20" },
      "bad-actor": { label: "Bad Actor", className: "bg-destructive/10 text-destructive border-destructive/20" },
    };
    return configs[type as keyof typeof configs] || configs["happy-path"];
  };

  const selectedScenarioData = scenarios.find((s) => s.id === selectedScenario);

  return (
    <div className="p-8 space-y-8">
      {/* Back Navigation */}
      <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
        <Link to="/simulations">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Simulations
        </Link>
      </Button>

      {/* Summary Header */}
      <Card className="p-8 border border-border bg-card">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <h1 className="text-3xl font-bold text-foreground">{simulation.name}</h1>
              <Badge
                variant="secondary"
                className={
                  simulation.status === "passed"
                    ? "bg-success/10 text-success border-success/20"
                    : "bg-destructive/10 text-destructive border-destructive/20"
                }
              >
                {simulation.status === "passed" ? (
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                ) : (
                  <XCircle className="h-3 w-3 mr-1" />
                )}
                {simulation.status.charAt(0).toUpperCase() + simulation.status.slice(1)}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <Link
                to={`/agents/${simulation.agent.id}`}
                className="hover:text-primary hover:underline"
              >
                {simulation.agent.name}
              </Link>
              <span>→</span>
              <Link
                to={`/blueprints/${simulation.blueprint.id}`}
                className="hover:text-primary hover:underline"
              >
                {simulation.blueprint.name}
              </Link>
              <span>•</span>
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                {simulation.environment}
              </Badge>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Started {simulation.startedAt}
              </div>
              <span>•</span>
              <span>Duration: {simulation.duration}</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-5xl font-bold text-foreground mb-1">{simulation.overallScore}</div>
            <div className="text-sm text-muted-foreground">Overall Score</div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
            <RotateCw className="h-4 w-4 mr-2" />
            Re-run Simulation
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </Card>

      {/* Simulation Visualizer */}
      <SimulationVisualizer />

      {/* Score Breakdown */}
      <Card className="p-6 border border-border bg-card">
        <h2 className="text-lg font-semibold text-foreground mb-6">Score Breakdown</h2>
        <div className="space-y-4">
          {simulation.scoreBreakdown.map((item) => (
            <div key={item.category}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{item.category}</span>
                <span className="text-sm font-semibold text-foreground">
                  {item.score}/{item.max}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    item.score >= 90
                      ? "bg-success"
                      : item.score >= 75
                      ? "bg-warning"
                      : "bg-destructive"
                  }`}
                  style={{ width: `${(item.score / item.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Scenario Results */}
      <Card className="border border-border bg-card">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Scenario Results</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Detailed breakdown of each test scenario
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase">
                  Scenario
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase">
                  Type
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase">
                  Status
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase">
                  Score
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase">
                  Reason
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {scenarios.map((scenario) => {
                const typeConfig = getScenarioTypeConfig(scenario.type);
                return (
                  <tr key={scenario.id} className="hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium text-foreground">{scenario.name}</span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="secondary" className={typeConfig.className}>
                        {typeConfig.label}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        variant="secondary"
                        className={
                          scenario.status === "passed"
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }
                      >
                        {scenario.status === "passed" ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {scenario.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-lg font-semibold text-foreground">{scenario.score}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-muted-foreground">{scenario.reason}</span>
                    </td>
                    <td className="py-4 px-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedScenario(scenario.id)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Scenario Detail Drawer */}
      <Sheet open={!!selectedScenario} onOpenChange={() => setSelectedScenario(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto bg-background">
          {selectedScenarioData && (
            <>
              <SheetHeader>
                <SheetTitle className="text-xl">{selectedScenarioData.name}</SheetTitle>
                <SheetDescription>
                  Detailed scenario execution and evaluation
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Badges */}
                <div className="flex gap-2">
                  <Badge
                    variant="secondary"
                    className={getScenarioTypeConfig(selectedScenarioData.type).className}
                  >
                    {getScenarioTypeConfig(selectedScenarioData.type).label}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={
                      selectedScenarioData.status === "passed"
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-destructive/10 text-destructive border-destructive/20"
                    }
                  >
                    Score: {selectedScenarioData.score}/100
                  </Badge>
                </div>

                {/* Input Prompt */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Input Prompt</h3>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-foreground">{selectedScenarioData.input}</p>
                  </div>
                </div>

                {/* Agent Response */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Agent Response</h3>
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <p className="text-sm text-foreground">{selectedScenarioData.response}</p>
                  </div>
                </div>

                {/* Evaluation Notes */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Evaluation Notes</h3>
                  <div className="p-4 bg-accent rounded-lg">
                    <p className="text-sm text-muted-foreground">{selectedScenarioData.notes}</p>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Result Reason</h3>
                  <div className="flex items-start gap-2 p-4 bg-muted rounded-lg">
                    {selectedScenarioData.status === "passed" ? (
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm text-foreground">{selectedScenarioData.reason}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SimulationDetail;
