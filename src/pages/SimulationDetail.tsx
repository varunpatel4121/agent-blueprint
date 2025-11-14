import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ArrowLeft,
  PlayCircle,
  Network,
  Cpu,
  MessageSquare
} from "lucide-react";

const SimulationDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scenario = location.state?.scenario;
  
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // Simulate loading sequence
    const loadingSequence = [
      { delay: 500, step: 0 },
      { delay: 1000, step: 1 },
      { delay: 1500, step: 2 },
      { delay: 2000, step: 3 },
    ];

    loadingSequence.forEach(({ delay }) => {
      setTimeout(() => setActiveStep((prev) => prev + 1), delay);
    });

    setTimeout(() => setLoading(false), 2500);
  }, []);

  if (!scenario) {
    navigate("/run");
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "fail":
        return <XCircle className="h-5 w-5 text-destructive" />;
      case "partial":
        return <AlertCircle className="h-5 w-5 text-warning" />;
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

  const loadingSteps = [
    { icon: Network, text: "Preparing simulation environment..." },
    { icon: Cpu, text: "Selecting target agent..." },
    { icon: Network, text: "Constructing interaction graph..." },
    { icon: PlayCircle, text: "Executing prompt..." },
  ];

  const timelineSteps = [
    {
      title: "User Prompt",
      icon: MessageSquare,
      description: scenario.prompt,
      timestamp: "0ms"
    },
    {
      title: "Agent Processing",
      icon: Cpu,
      description: "Agent analyzes request and determines required actions",
      timestamp: "45ms"
    },
    {
      title: "API Calls",
      icon: Network,
      description: "Agent queries inventory, pricing, and delivery APIs",
      timestamp: "120ms"
    },
    {
      title: "Decision Making",
      icon: Cpu,
      description: "Agent evaluates options against constraints",
      timestamp: "180ms"
    },
    {
      title: "Response Generated",
      icon: MessageSquare,
      description: scenario.response,
      timestamp: "210ms"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-12 max-w-2xl w-full">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Initializing Simulation
              </h2>
              <p className="text-sm text-muted-foreground">
                Setting up test environment
              </p>
            </div>

            <div className="space-y-6">
              {loadingSteps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = idx === activeStep;
                const isComplete = idx < activeStep;
                
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-4 transition-all duration-300 ${
                      isActive ? "opacity-100 scale-100" : isComplete ? "opacity-50 scale-95" : "opacity-30 scale-95"
                    }`}
                  >
                    <div className={`relative ${isActive ? "animate-pulse" : ""}`}>
                      <Icon className={`h-8 w-8 ${
                        isComplete ? "text-success" :
                        isActive ? "text-primary" :
                        "text-muted-foreground"
                      }`} />
                      {isActive && (
                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        isActive ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {step.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-6 border-t border-border">
              <div className="flex items-center justify-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse delay-75" style={{ animationDelay: "150ms" }} />
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse delay-150" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Button variant="ghost" onClick={() => navigate("/run")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Results
      </Button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(scenario.status)}
              <h1 className="text-2xl font-semibold text-foreground">{scenario.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">{scenario.type}</Badge>
              {getStatusBadge(scenario.status)}
              <span className="text-sm text-muted-foreground ml-2">Score: {scenario.score}/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Interaction Visualization */}
      <Card className="p-8 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Agent Interaction Flow</h2>
        
        <div className="relative">
          {/* Agent Nodes */}
          <div className="grid grid-cols-3 gap-8 mb-12">
            {/* Test Agent */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-3">
                <Cpu className="h-10 w-10 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">Test Agent</p>
              <p className="text-xs text-muted-foreground">Shopify Assistant</p>
            </div>

            {/* Arrow and Message */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-full">
                <svg className="w-full h-16" viewBox="0 0 100 60">
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="10"
                      refX="9"
                      refY="3"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 10 3, 0 6"
                        className="fill-primary"
                      />
                    </marker>
                  </defs>
                  <line
                    x1="0"
                    y1="30"
                    x2="100"
                    y2="30"
                    className={`stroke-primary ${scenario.status === "pass" ? "stroke-success" : scenario.status === "fail" ? "stroke-destructive" : "stroke-warning"}`}
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded px-3 py-1">
                  <p className="text-xs text-foreground whitespace-nowrap">Query → Response</p>
                </div>
              </div>
            </div>

            {/* Target Agent */}
            <div className="flex flex-col items-center">
              <div className={`w-24 h-24 rounded-full ${
                scenario.status === "pass" ? "bg-success/10 border-success" :
                scenario.status === "fail" ? "bg-destructive/10 border-destructive" :
                "bg-warning/10 border-warning"
              } border-2 flex items-center justify-center mb-3`}>
                <Network className={`h-10 w-10 ${
                  scenario.status === "pass" ? "text-success" :
                  scenario.status === "fail" ? "text-destructive" :
                  "text-warning"
                }`} />
              </div>
              <p className="text-sm font-medium text-foreground">Target Agent</p>
              <p className="text-xs text-muted-foreground">Inventory API</p>
            </div>
          </div>

          {/* Interaction Details */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
                <MessageSquare className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Prompt Sent</p>
                  <p className="text-sm text-foreground">{scenario.prompt}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className={`flex items-start gap-3 p-4 rounded-lg ${
                scenario.status === "pass" ? "bg-success/5 border-success/20" :
                scenario.status === "fail" ? "bg-destructive/5 border-destructive/20" :
                "bg-warning/5 border-warning/20"
              } border`}>
                <MessageSquare className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                  scenario.status === "pass" ? "text-success" :
                  scenario.status === "fail" ? "text-destructive" :
                  "text-warning"
                }`} />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Response Returned</p>
                  <p className="text-sm text-foreground">{scenario.response}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Timeline Playback */}
      <Card className="p-8 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Execution Timeline</h2>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
          
          {/* Timeline steps */}
          <div className="space-y-6">
            {timelineSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="relative flex gap-6 group">
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-full bg-card border-2 border-primary flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                      <span className="text-xs text-muted-foreground font-mono">{step.timestamp}</span>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 border border-border group-hover:bg-muted/50 transition-colors">
                      <p className="text-sm text-foreground">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Summary + Improvements */}
      <Card className="p-8">
        <h2 className="text-lg font-semibold text-foreground mb-6">Analysis & Improvements</h2>
        
        <div className="space-y-6">
          {/* Expected Behavior */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-2">Expected Behavior</h3>
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <p className="text-sm text-foreground">{scenario.expected}</p>
            </div>
          </div>

          {/* Analysis */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">What Happened</h3>
            <ul className="space-y-2">
              {scenario.why.map((reason: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full mt-2 ${
                    scenario.status === "pass" ? "bg-success" :
                    scenario.status === "fail" ? "bg-destructive" :
                    "bg-warning"
                  }`} />
                  <p className="text-sm text-foreground flex-1">{reason}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Suggested Fix */}
          {scenario.suggestion && (
            <div className="pt-6 border-t border-border">
              <h3 className="text-sm font-medium text-foreground mb-3">Suggested Improvement</h3>
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-4">
                <p className="text-sm text-foreground font-mono">{scenario.suggestion}</p>
              </div>
              <Button className="w-full">
                Apply Suggested Fix
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SimulationDetail;
