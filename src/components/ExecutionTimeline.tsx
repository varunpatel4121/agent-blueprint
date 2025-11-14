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
}

export const ExecutionTimeline = ({ currentPhase }: { currentPhase: "searching" | "evaluating" | "selecting" | "interacting" }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const steps: TimelineStep[] = [
    {
      id: "init",
      title: "Simulation Initialized",
      description: "Test Agent enters sandbox with initial prompt and context",
      data: "Prompt: I need headphones under $100 with 2-day delivery",
      icon: Circle,
      color: "hsl(195, 100%, 50%)",
      bgColor: "hsl(195, 100%, 95%)",
    },
    {
      id: "search",
      title: "Scanning Available Agents",
      description: "Test Agent evaluates all candidate agents for relevance",
      data: "Candidates: Inventory API, Pricing API, Delivery API, Catalog API",
      icon: Search,
      color: "hsl(195, 90%, 55%)",
      bgColor: "hsl(195, 90%, 95%)",
    },
    {
      id: "evaluate",
      title: "Evaluating Relevance",
      description: "Test Agent compares capabilities, tool access, and expected results",
      data: "Top candidates: Inventory API (90%), Delivery API (70%), Pricing API (60%)",
      icon: BarChart3,
      color: "hsl(270, 75%, 60%)",
      bgColor: "hsl(270, 75%, 95%)",
    },
    {
      id: "select",
      title: "Selected Target Agent: Inventory API Agent",
      description: "Test Agent selects the best agent to handle this request",
      data: "Reason: Inventory API has real-time stock data and delivery time integration",
      icon: Target,
      color: "hsl(142, 76%, 45%)",
      bgColor: "hsl(142, 76%, 95%)",
    },
    {
      id: "send",
      title: "Sending Instruction Payload",
      description: "Test Agent sends structured input to the selected agent",
      data: '{"query": "headphones", "maxPrice": 100, "deliveryDays": 2}',
      icon: Send,
      color: "hsl(25, 95%, 53%)",
      bgColor: "hsl(25, 95%, 95%)",
    },
    {
      id: "receive",
      title: "Received Response",
      description: "Selected agent returns data and results for the request",
      data: "Found: XR-2000 headphones ($89.99) • 2-day delivery available",
      icon: MessageSquare,
      color: "hsl(264, 80%, 60%)",
      bgColor: "hsl(264, 80%, 95%)",
    },
    {
      id: "final",
      title: "Final Decision",
      description: "Test Agent uses returned data to produce the final output",
      data: "Result: Partial pass • Product found within budget but delivery filtering incomplete",
      icon: CheckCircle2,
      color: "hsl(142, 76%, 45%)",
      bgColor: "hsl(142, 76%, 95%)",
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

            return (
              <div
                key={step.id}
                className={`relative transition-all duration-500 ${
                  isActive ? "opacity-100 translate-x-0" : "opacity-30 translate-x-2"
                }`}
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
                      }`}
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
                      {isCurrent && (
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

                    <p
                      className={`text-sm mb-3 transition-colors ${
                        isActive ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.description}
                    </p>

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
