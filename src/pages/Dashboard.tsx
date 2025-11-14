import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle2, AlertCircle, Clock } from "lucide-react";

const Dashboard = () => {
  const stats = [
    { label: "Active Agents", value: "12", change: "+2 this week", icon: Activity, trend: "up" },
    { label: "Passed Tests", value: "847", change: "94% success rate", icon: CheckCircle2, trend: "neutral" },
    { label: "Active Simulations", value: "3", change: "2 queued", icon: Clock, trend: "neutral" },
    { label: "Issues Found", value: "23", change: "-5 from last week", icon: AlertCircle, trend: "down" },
  ];

  const recentActivity = [
    { agent: "Customer Support Bot", status: "passed", score: 92, time: "2 hours ago" },
    { agent: "Data Processor Agent", status: "failed", score: 67, time: "4 hours ago" },
    { agent: "Email Classifier", status: "passed", score: 88, time: "6 hours ago" },
    { agent: "Task Scheduler", status: "running", score: null, time: "Running now" },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Monitor your AI agents and test results</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6 border border-border bg-card">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="border border-border bg-card">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Recent Simulations</h2>
        </div>
        <div className="divide-y divide-border">
          {recentActivity.map((activity, index) => (
            <div key={index} className="p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{activity.agent}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {activity.score !== null && (
                  <span className="text-2xl font-semibold text-foreground">{activity.score}</span>
                )}
                <Badge
                  variant={
                    activity.status === "passed"
                      ? "default"
                      : activity.status === "failed"
                      ? "destructive"
                      : "secondary"
                  }
                  className={
                    activity.status === "passed"
                      ? "bg-success text-success-foreground"
                      : activity.status === "failed"
                      ? ""
                      : ""
                  }
                >
                  {activity.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
