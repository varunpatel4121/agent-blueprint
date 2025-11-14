import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ChevronRight,
  ArrowLeft
} from "lucide-react";

const RunResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const testData = location.state;
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowCards(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Use real test results if available
  const scenarioResults = testData?.testResults || [];
  const summary = testData?.summary || {
    overallScore: 0,
    totalTests: 0,
    passed: 0,
    failed: 0,
    partial: 0,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "fail": return <XCircle className="h-5 w-5 text-red-500" />;
      case "partial": return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pass": 
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Pass</Badge>;
      case "fail": 
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Fail</Badge>;
      case "partial": 
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Partial</Badge>;
      default: 
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate("/new")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to New Test
        </Button>

        {/* Run Summary */}
        <Card 
          className={`p-6 transition-all duration-700 ${
            showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} 
          style={{ transitionDelay: '100ms' }}
        >
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-foreground mb-1">Run Results</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{testData?.agentName || "Test Agent"}</span>
              <span>•</span>
              <span>{new Date().toLocaleString()}</span>
              <span>•</span>
              <span>{testData?.inputType === "endpoint" ? "Endpoint" : "YAML/JSON"}</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 pt-6 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Overall Score</p>
              <p className="text-4xl font-bold text-foreground">{summary.overallScore}</p>
              <p className="text-sm text-muted-foreground">/ 100</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Total Tests</p>
              <p className="text-3xl font-semibold text-foreground">{summary.totalTests}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Passed</p>
              <p className="text-3xl font-semibold text-green-600">{summary.passed}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Failed</p>
              <p className="text-3xl font-semibold text-red-600">{summary.failed}</p>
            </div>
          </div>
        </Card>

        {/* Scenario Results */}
        <Card 
          className={`p-6 transition-all duration-700 ${
            showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} 
          style={{ transitionDelay: '400ms' }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Scenario Results</h2>
          
          <div className="space-y-2">
            {scenarioResults.length > 0 ? (
              scenarioResults.map((result: any) => (
                <div
                  key={result.scenarioId}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/simulation/${result.scenarioId}`, { 
                    state: { scenario: result } 
                  })}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground">{result.name}</h3>
                        {getStatusBadge(result.status)}
                        <div className="flex gap-1">
                          {result.tags?.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{result.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-semibold text-foreground">{result.score}</p>
                        <p className="text-xs text-muted-foreground">/ 100</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No test results available
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RunResults;
