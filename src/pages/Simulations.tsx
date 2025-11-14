import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Square, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const Simulations = () => {
  const runningSimulations = [
    {
      agent: "Task Scheduler",
      blueprint: "Performance Benchmarks",
      progress: 65,
      startedAt: "10 minutes ago",
      estimatedCompletion: "5 minutes"
    }
  ];

  const recentSimulations = [
    {
      agent: "Customer Support Bot",
      blueprint: "Customer Service Compliance",
      status: "passed",
      score: 92,
      completedAt: "2 hours ago",
      duration: "12 minutes"
    },
    {
      agent: "Data Processor Agent",
      blueprint: "Data Privacy & Security",
      status: "failed",
      score: 67,
      completedAt: "4 hours ago",
      duration: "8 minutes"
    },
    {
      agent: "Email Classifier",
      blueprint: "Response Quality",
      status: "passed",
      score: 88,
      completedAt: "6 hours ago",
      duration: "15 minutes"
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Simulations</h1>
          <p className="text-muted-foreground">Run and monitor test simulations</p>
        </div>
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
          <Play className="h-4 w-4 mr-2" />
          New Simulation
        </Button>
      </div>

      {/* Running Simulations */}
      {runningSimulations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Running Now</h2>
          {runningSimulations.map((sim, index) => (
            <Card key={index} className="p-6 border border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{sim.agent}</h3>
                  <p className="text-sm text-muted-foreground">{sim.blueprint}</p>
                </div>
                <Button variant="destructive" size="sm">
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${sim.progress}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Started {sim.startedAt}
                  </span>
                  <span className="text-muted-foreground">
                    {sim.progress}% • ~{sim.estimatedCompletion} remaining
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Recent Simulations */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Recent History</h2>
        <Card className="border border-border bg-card">
          <div className="divide-y divide-border">
            {recentSimulations.map((sim, index) => (
              <div key={index} className="p-6 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      sim.status === "passed" 
                        ? "bg-success/10" 
                        : "bg-destructive/10"
                    }`}>
                      {sim.status === "passed" ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium text-foreground">{sim.agent}</h3>
                        <span className="text-sm text-muted-foreground">→</span>
                        <span className="text-sm text-muted-foreground">{sim.blueprint}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {sim.duration}
                        </span>
                        <span>•</span>
                        <span>Completed {sim.completedAt}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-semibold text-foreground">{sim.score}</div>
                      <div className="text-xs text-muted-foreground">score</div>
                    </div>
                    <Badge
                      variant={sim.status === "passed" ? "default" : "destructive"}
                      className={sim.status === "passed" ? "bg-success text-success-foreground" : ""}
                    >
                      {sim.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Report
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Simulations;
