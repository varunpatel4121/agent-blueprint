import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const RunsHistory = () => {
  const navigate = useNavigate();

  const mockRuns = [
    {
      id: "run-001",
      agentName: "Shopify Assistant",
      timestamp: "2025-11-14 14:32",
      inputType: "Endpoint",
      overallScore: 81,
      status: "completed",
    },
    {
      id: "run-002",
      agentName: "Shopify Assistant",
      timestamp: "2025-11-14 12:15",
      inputType: "Endpoint",
      overallScore: 62,
      status: "completed",
    },
    {
      id: "run-003",
      agentName: "Support Bot",
      timestamp: "2025-11-13 16:45",
      inputType: "YAML",
      overallScore: 74,
      status: "completed",
    },
    {
      id: "run-004",
      agentName: "Inventory Agent",
      timestamp: "2025-11-13 09:22",
      inputType: "JSON",
      overallScore: 88,
      status: "completed",
    },
  ];

  const getScoreBadge = (score: number) => {
    if (score >= 80) {
      return <Badge className="bg-success/10 text-success border-success/20">{score}</Badge>;
    } else if (score >= 60) {
      return <Badge className="bg-warning/10 text-warning border-warning/20">{score}</Badge>;
    } else {
      return <Badge variant="destructive">{score}</Badge>;
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Test Runs</h1>
        <p className="text-sm text-muted-foreground">
          History of all agent test runs
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-2">
          {mockRuns.map((run) => (
            <div
              key={run.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">{run.agentName}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{run.timestamp}</span>
                  <span>•</span>
                  <span>{run.inputType}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  {getScoreBadge(run.overallScore)}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/run")}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default RunsHistory;
