import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Loader2, 
  CheckCircle2, 
  Radio,
  Zap,
  Target,
  MessageSquare 
} from "lucide-react";

interface ExecutionPhase {
  id: string;
  label: string;
  icon: any;
  duration: number;
}

const executionPhases: ExecutionPhase[] = [
  { id: "init", label: "Initializing test environment", icon: Radio, duration: 1500 },
  { id: "deploy", label: "Deploying test agent", icon: Zap, duration: 2000 },
  { id: "scenarios", label: "Loading scenarios", icon: Target, duration: 1000 },
  { id: "execute", label: "Executing simulations", icon: MessageSquare, duration: 3000 },
  { id: "analyze", label: "Analyzing results", icon: CheckCircle2, duration: 1500 },
];

export default function TestExecution() {
  const location = useLocation();
  const navigate = useNavigate();
  const testData = location.state;

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [scenariosExecuted, setScenariosExecuted] = useState(0);

  const totalScenarios = testData?.scenarios?.length || 8;

  useEffect(() => {
    if (!testData) {
      navigate("/new");
      return;
    }

    // Simulate execution phases
    let phaseTimer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    const executePhase = (index: number) => {
      if (index >= executionPhases.length) {
        // All phases complete, navigate to results
        setTimeout(() => {
          navigate("/run", { state: testData, replace: true });
        }, 500);
        return;
      }

      const phase = executionPhases[index];
      setCurrentPhaseIndex(index);

      // Animate progress bar
      const steps = 50;
      const increment = 100 / steps;
      let currentProgress = 0;

      progressTimer = setInterval(() => {
        currentProgress += increment;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(progressTimer);
        }
        setProgress(currentProgress);

        // Simulate scenario execution during the execute phase
        if (phase.id === "execute" && currentProgress % 12 === 0) {
          setScenariosExecuted((prev) => Math.min(prev + 1, totalScenarios));
        }
      }, phase.duration / steps);

      // Move to next phase after duration
      phaseTimer = setTimeout(() => {
        setCompletedPhases((prev) => [...prev, phase.id]);
        setProgress(0);
        executePhase(index + 1);
      }, phase.duration);
    };

    executePhase(0);

    return () => {
      clearTimeout(phaseTimer);
      clearInterval(progressTimer);
    };
  }, [navigate, testData, totalScenarios]);

  if (!testData) {
    return null;
  }

  const currentPhase = executionPhases[currentPhaseIndex];

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-background via-background to-muted/20">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Running Test: {testData.agentName || "Unnamed Agent"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Testing {totalScenarios} scenarios • This may take a moment
          </p>
        </div>

        {/* Execution Phases */}
        <div className="space-y-4 mb-8">
          {executionPhases.map((phase, index) => {
            const Icon = phase.icon;
            const isCompleted = completedPhases.includes(phase.id);
            const isCurrent = currentPhaseIndex === index;
            const isPending = index > currentPhaseIndex;

            return (
              <div
                key={phase.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                  isCurrent
                    ? "bg-primary/5 border-primary/20"
                    : isCompleted
                    ? "bg-muted/30 border-border"
                    : "bg-muted/10 border-border opacity-50"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Icon className={`w-5 h-5 ${isCurrent ? "animate-pulse" : ""}`} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground">
                      {phase.label}
                    </p>
                    {isCurrent && (
                      <Badge variant="outline" className="text-xs animate-pulse">
                        Running
                      </Badge>
                    )}
                    {isCompleted && (
                      <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                        Complete
                      </Badge>
                    )}
                  </div>
                  
                  {isCurrent && (
                    <div className="space-y-1">
                      <Progress value={progress} className="h-1" />
                      {phase.id === "execute" && (
                        <p className="text-xs text-muted-foreground">
                          {scenariosExecuted} / {totalScenarios} scenarios completed
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Results will appear automatically when complete
          </p>
        </div>
      </Card>
    </div>
  );
}
