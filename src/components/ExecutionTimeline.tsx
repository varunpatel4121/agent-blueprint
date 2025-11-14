import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Circle,
  Search,
  BarChart3,
  Target,
  Send,
  MessageSquare,
  CheckCircle2
} from "lucide-react";

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  data?: string;
  icon: any;
  color: string;
  bgColor: string;
  status?: "success" | "warning" | "failure";
  failureDescription?: string;
  expectedBehavior?: string;
  actualBehavior?: string;
}

export const ExecutionTimeline = ({ currentPhase }: { currentPhase: "searching" | "evaluating" | "selecting" | "interacting" }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const steps: TimelineStep[] = [
    {
      id: "init",
      title: "Simulation Initialized",
      description: "Test Agent enters sandbox with initial prompt and context",
      data: "Prompt: I need headphones under $100 with 2-day delivery in San Francisco",
      icon: Circle,
      color: "hsl(195, 100%, 50%)",
      bgColor: "hsl(195, 100%, 95%)",
      status: "success",
    },
    {
      id: "search",
      title: "Scanning Available Agents",
      description: "Test Agent evaluates all candidate agents for relevance",
      data: "Candidates: Inventory API, Pricing API, Delivery API, Catalog API",
      icon: Search,
      color: "hsl(195, 90%, 55%)",
      bgColor: "hsl(195, 90%, 95%)",
      status: "success",
    },
    {
      id: "evaluate",
      title: "Evaluating Relevance",
      description: "Test Agent compares capabilities, tool access, and expected results",
      data: "Top candidates: Inventory API (90%), Delivery API (70%), Pricing API (60%)",
      icon: BarChart3,
      color: "hsl(0, 84%, 60%)",
      bgColor: "hsl(0, 84%, 97%)",
      status: "failure",
      failureDescription: "Agent scanned candidate agents but failed to detect SF-specific location requirement in the user query.",
      expectedBehavior: "Identify location parameter ('San Francisco') and prioritize agents with location-aware filtering capabilities.",
      actualBehavior: "Evaluated agents based only on product type and price, ignoring the location constraint entirely.",
    },
    {
      id: "select",
      title: "Selected Target Agent: Inventory API Agent",
      description: "Test Agent selects the best agent to handle this request",
      data: "Reason: Inventory API has real-time stock data and delivery time integration",
      icon: Target,
      color: "hsl(142, 76%, 45%)",
      bgColor: "hsl(142, 76%, 95%)",
      status: "warning",
    },
    {
      id: "send",
      title: "Sending Instruction Payload",
      description: "Test Agent sends structured input to the selected agent",
      data: '{"query": "headphones", "maxPrice": 100, "deliveryDays": 2}',
      icon: Send,
      color: "hsl(25, 95%, 53%)",
      bgColor: "hsl(25, 95%, 95%)",
      status: "success",
    },
    {
      id: "receive",
      title: "Received Response",
      description: "Selected agent returns data and results for the request",
      data: "Found: XR-2000 headphones ($89.99) • 2-day delivery available",
      icon: MessageSquare,
      color: "hsl(264, 80%, 60%)",
      bgColor: "hsl(264, 80%, 95%)",
      status: "success",
    },
    {
      id: "final",
      title: "Final Decision",
      description: "Test Agent uses returned data to produce the final output",
      data: "Result: Partial pass • Product found within budget but delivery filtering incomplete",
      icon: CheckCircle2,
      color: "hsl(142, 76%, 45%)",
      bgColor: "hsl(142, 76%, 95%)",
      status: "success",
    },
  ];

  useEffect(() => {
    const phaseToStep: Record<string, number> = {
      searching: 1,
      evaluating: 2,
      selecting: 3,
      interacting: 5,
    };

    const targetStep = phaseToStep[currentPhase] || 0;
    
    // Gradually advance through steps
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < targetStep) return prev + 1;
        return prev;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [currentPhase]);

  return (
    <Card className="p-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">Execution Timeline</h2>
        <p className="text-sm text-muted-foreground">
          Replay of the agent's reasoning and decisions during this simulation
        </p>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

        {/* Timeline steps */}
        <div className="space-y-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx <= activeStepIndex;
            const isCurrent = idx === activeStepIndex;
            const isFailed = step.status === "failure";
            const isWarning = step.status === "warning";

            return (
              <div
                key={step.id}
                className={`relative transition-all duration-500 ${
                  isActive ? "opacity-100 translate-x-0" : "opacity-30 translate-x-2"
                } ${isFailed && isActive ? "ring-2 ring-destructive/30 rounded-lg -ml-2 pl-2 -mr-2 pr-2 py-2" : ""}`}
              >
                <div className="flex gap-6">
                  {/* Icon */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isCurrent
                          ? "scale-110 shadow-lg"
                          : isActive
                          ? "scale-100"
                          : "scale-95"
                      } ${isFailed && isActive ? "shadow-[0_0_20px_rgba(239,68,68,0.3)]" : ""}`}
                      style={{
                        backgroundColor: isActive ? step.bgColor : "hsl(var(--muted))",
                        borderColor: isActive ? step.color : "hsl(var(--border))",
                      }}
                    >
                      <Icon
                        className="h-5 w-5"
                        style={{ color: isActive ? step.color : "hsl(var(--muted-foreground))" }}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1 pb-2">
                    <div className="flex items-start justify-between mb-2">
                      <h3
                        className={`text-sm font-semibold transition-colors ${
                          isActive ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {isFailed && isActive && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-destructive/10 border-destructive/30 text-destructive"
                          >
                            Failure
                          </Badge>
                        )}
                        {isWarning && isActive && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-500"
                          >
                            Warning
                          </Badge>
                        )}
                        {isCurrent && !isFailed && !isWarning && (
                          <Badge
                            variant="outline"
                            className="text-xs animate-pulse"
                            style={{
                              borderColor: step.color,
                              color: step.color,
                            }}
                          >
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p
                      className={`text-sm mb-3 transition-colors ${
                        isActive ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.description}
                    </p>

                    {/* Failure Information */}
                    {isFailed && isActive && step.failureDescription && (
                      <div className="mb-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                        <div className="flex items-start gap-2 mb-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-destructive mb-1">
                              Failure at this stage
                            </p>
                            <p className="text-sm text-foreground">
                              {step.failureDescription}
                            </p>
                          </div>
                        </div>
                        
                        {(step.expectedBehavior || step.actualBehavior) && (
                          <div className="mt-3 pt-3 border-t border-destructive/10 space-y-2">
                            {step.expectedBehavior && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                  Expected Behavior:
                                </p>
                                <p className="text-sm text-foreground">
                                  {step.expectedBehavior}
                                </p>
                              </div>
                            )}
                            {step.actualBehavior && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                  Actual Behavior:
                                </p>
                                <p className="text-sm text-foreground">
                                  {step.actualBehavior}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {step.data && isActive && (
                      <div
                        className="rounded-lg p-3 border text-xs font-mono transition-all duration-300"
                        style={{
                          backgroundColor: `${step.color.replace(")", ", 0.05)")}`,
                          borderColor: `${step.color.replace(")", ", 0.2)")}`,
                        }}
                      >
                        <div className="text-muted-foreground whitespace-pre-wrap">
                          {step.data}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
