import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreVertical, Bot } from "lucide-react";

const Agents = () => {
  const agents = [
    { 
      name: "Customer Support Bot", 
      type: "HTTP Endpoint", 
      status: "active", 
      lastTest: "2 hours ago",
      score: 92,
      tests: 45
    },
    { 
      name: "Data Processor Agent", 
      type: "MCP", 
      status: "active", 
      lastTest: "4 hours ago",
      score: 67,
      tests: 23
    },
    { 
      name: "Email Classifier", 
      type: "SDK", 
      status: "active", 
      lastTest: "6 hours ago",
      score: 88,
      tests: 31
    },
    { 
      name: "Task Scheduler", 
      type: "HTTP Endpoint", 
      status: "inactive", 
      lastTest: "2 days ago",
      score: 76,
      tests: 12
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Agents</h1>
          <p className="text-muted-foreground">Manage and monitor your AI agents</p>
        </div>
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Add Agent
        </Button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, index) => (
          <Card key={index} className="p-6 border border-border bg-card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
            
            <h3 className="font-semibold text-foreground mb-1">{agent.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{agent.type}</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge 
                  variant={agent.status === "active" ? "default" : "secondary"}
                  className={agent.status === "active" ? "bg-success text-success-foreground" : ""}
                >
                  {agent.status}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg. Score</span>
                <span className="text-sm font-medium text-foreground">{agent.score}/100</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tests Run</span>
                <span className="text-sm font-medium text-foreground">{agent.tests}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Test</span>
                <span className="text-sm font-medium text-foreground">{agent.lastTest}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border">
              <Button variant="outline" className="w-full">
                Run Test
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Agents;
