import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SimulationVisualizer } from "@/components/SimulationVisualizer";
import { ExecutionTimeline } from "@/components/ExecutionTimeline";
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
  const [currentPhase, setCurrentPhase] = useState<"searching" | "evaluating" | "selecting" | "interacting">("searching");

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
      <SimulationVisualizer scenario={scenario} onPhaseChange={setCurrentPhase} />

      {/* Execution Timeline */}
      <ExecutionTimeline currentPhase={currentPhase} />

      {/* Summary + Improvements */}
      <Card className="p-8">
        <h2 className="text-lg font-semibold text-foreground mb-6">Analysis & Improvements</h2>
        
        <div className="space-y-6">
          {/* Expected Behavior */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Expected Behavior</h3>
            <ul className="space-y-2">
              {(Array.isArray(scenario.expected) ? scenario.expected : [scenario.expected]).map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 bg-primary" />
                  <p className="text-sm text-foreground flex-1">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* What Happened */}
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

          {/* Why It Matters */}
          {scenario.impact && (
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Why It Matters</h3>
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <p className="text-sm text-foreground leading-relaxed">{scenario.impact}</p>
              </div>
            </div>
          )}

          {/* Suggested Improvements */}
          {scenario.suggestions && (
            <div className="pt-4 border-t border-border">
              <h3 className="text-sm font-medium text-foreground mb-3">Suggested Improvements</h3>
              <ul className="space-y-2.5 mb-4">
                {scenario.suggestions.map((suggestion: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-semibold text-accent">{idx + 1}</span>
                    </div>
                    <p className="text-sm text-foreground flex-1">{suggestion}</p>
                  </li>
                ))}
              </ul>
              <Button className="w-full">
                Apply Suggested Improvements
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SimulationDetail;
