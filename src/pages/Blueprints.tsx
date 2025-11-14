import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, MoreVertical } from "lucide-react";

const Blueprints = () => {
  const blueprints = [
    {
      name: "Customer Service Compliance",
      description: "Tests agent adherence to customer service policies and tone guidelines",
      criteria: 12,
      agents: 3,
      lastUsed: "2 hours ago",
      category: "Compliance"
    },
    {
      name: "Data Privacy & Security",
      description: "Validates proper handling of sensitive data and PII protection",
      criteria: 8,
      agents: 5,
      lastUsed: "1 day ago",
      category: "Security"
    },
    {
      name: "Response Quality",
      description: "Measures accuracy, relevance, and completeness of agent responses",
      criteria: 15,
      agents: 7,
      lastUsed: "4 hours ago",
      category: "Quality"
    },
    {
      name: "Performance Benchmarks",
      description: "Tests response time, resource usage, and scalability metrics",
      criteria: 10,
      agents: 4,
      lastUsed: "3 days ago",
      category: "Performance"
    },
  ];

  const categories = ["All", "Compliance", "Security", "Quality", "Performance"];

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Blueprints</h1>
          <p className="text-muted-foreground">Define test criteria and evaluation standards</p>
        </div>
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Create Blueprint
        </Button>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={category === "All" ? "default" : "outline"}
            size="sm"
            className={category === "All" ? "bg-primary hover:bg-primary-hover text-primary-foreground" : ""}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Blueprints List */}
      <div className="space-y-4">
        {blueprints.map((blueprint, index) => (
          <Card key={index} className="p-6 border border-border bg-card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex gap-4 flex-1">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-foreground">{blueprint.name}</h3>
                    <Badge variant="secondary">{blueprint.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{blueprint.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span>{blueprint.criteria} criteria</span>
                    <span>•</span>
                    <span>{blueprint.agents} agents using</span>
                    <span>•</span>
                    <span>Last used {blueprint.lastUsed}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Blueprints;
