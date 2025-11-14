import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, TrendingUp, TrendingDown, Minus } from "lucide-react";

const Reports = () => {
  const reports = [
    {
      title: "Customer Support Bot - Monthly Review",
      date: "December 2024",
      agent: "Customer Support Bot",
      overallScore: 92,
      trend: "up",
      passRate: 94,
      totalTests: 45,
      insights: [
        { category: "Compliance", score: 96, change: "+4%" },
        { category: "Response Quality", score: 91, change: "+2%" },
        { category: "Performance", score: 89, change: "-1%" },
      ]
    },
    {
      title: "Data Processor Agent - Security Audit",
      date: "December 2024",
      agent: "Data Processor Agent",
      overallScore: 67,
      trend: "down",
      passRate: 72,
      totalTests: 23,
      insights: [
        { category: "Data Privacy", score: 58, change: "-8%" },
        { category: "Security", score: 71, change: "-3%" },
        { category: "Performance", score: 72, change: "0%" },
      ]
    },
    {
      title: "Email Classifier - Weekly Report",
      date: "Week of Dec 8, 2024",
      agent: "Email Classifier",
      overallScore: 88,
      trend: "neutral",
      passRate: 89,
      totalTests: 31,
      insights: [
        { category: "Response Quality", score: 92, change: "+1%" },
        { category: "Performance", score: 86, change: "0%" },
        { category: "Accuracy", score: 87, change: "-1%" },
      ]
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Reports</h1>
          <p className="text-muted-foreground">Review test results and performance scorecards</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Reports List */}
      <div className="space-y-6">
        {reports.map((report, index) => (
          <Card key={index} className="border border-border bg-card">
            {/* Report Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{report.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{report.date}</span>
                    <span>•</span>
                    <span>{report.totalTests} tests run</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Full Report
                </Button>
              </div>
            </div>

            {/* Report Summary */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Overall Score */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{report.overallScore}</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Score</p>
                    <div className="flex items-center gap-2 mt-1">
                      {report.trend === "up" && (
                        <>
                          <TrendingUp className="h-4 w-4 text-success" />
                          <span className="text-sm font-medium text-success">Improving</span>
                        </>
                      )}
                      {report.trend === "down" && (
                        <>
                          <TrendingDown className="h-4 w-4 text-destructive" />
                          <span className="text-sm font-medium text-destructive">Declining</span>
                        </>
                      )}
                      {report.trend === "neutral" && (
                        <>
                          <Minus className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">Stable</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pass Rate */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Pass Rate</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-semibold text-foreground">{report.passRate}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-3">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${report.passRate}%` }}
                    />
                  </div>
                </div>

                {/* Tests Run */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Tests Run</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-semibold text-foreground">{report.totalTests}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">Across all categories</p>
                </div>
              </div>

              {/* Category Breakdown */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Category Performance</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {report.insights.map((insight, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{insight.category}</span>
                        <Badge 
                          variant="secondary"
                          className={
                            insight.change.startsWith("+") 
                              ? "bg-success/10 text-success" 
                              : insight.change.startsWith("-")
                              ? "bg-destructive/10 text-destructive"
                              : ""
                          }
                        >
                          {insight.change}
                        </Badge>
                      </div>
                      <div className="text-2xl font-semibold text-foreground">{insight.score}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reports;
