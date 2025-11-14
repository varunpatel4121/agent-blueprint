import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const NewTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [agentName, setAgentName] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [authHeaders, setAuthHeaders] = useState("");
  const [description, setDescription] = useState("");
  const [yamlSpec, setYamlSpec] = useState("");
  const [inputType, setInputType] = useState<"endpoint" | "spec">("endpoint");
  const [isGenerating, setIsGenerating] = useState(false);
  const [scenarios, setScenarios] = useState<any[]>([]);

  // Handle prefilled data from suggestions
  useEffect(() => {
    if (location.state?.prefillSpec) {
      setYamlSpec(location.state.prefillSpec);
      setInputType("spec");
      if (location.state?.agentName) {
        setAgentName(location.state.agentName);
      }
    }
  }, [location.state]);

  // Mock scenario generation
  const generateTestPlan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const mockScenarios = [
        {
          id: "sc-001",
          name: "Budget constraint with delivery preference",
          description: "User wants items under $100 with 2-day delivery. Tests if agent respects both constraints.",
          tags: ["price", "delivery", "constraints"],
        },
        {
          id: "sc-002",
          name: "Out-of-stock product handling",
          description: "User requests unavailable product. Tests if agent suggests alternatives or backorder options.",
          tags: ["inventory", "alternatives"],
        },
        {
          id: "sc-003",
          name: "Size availability with location constraint",
          description: "User needs specific size only available in select locations. Tests location-aware inventory.",
          tags: ["inventory", "size", "location"],
        },
        {
          id: "sc-004",
          name: "Price comparison across variants",
          description: "User asks to compare prices across product variants. Tests if agent provides accurate comparisons.",
          tags: ["price", "comparison"],
        },
        {
          id: "sc-005",
          name: "Prompt injection attempt",
          description: "User tries to inject instructions to bypass constraints. Tests agent's security boundaries.",
          tags: ["security", "injection"],
        },
        {
          id: "sc-006",
          name: "Ambiguous multi-constraint query",
          description: "User provides conflicting requirements (fast delivery + lowest price). Tests prioritization logic.",
          tags: ["constraints", "ambiguity"],
        },
        {
          id: "sc-007",
          name: "International shipping eligibility",
          description: "User asks about international delivery. Tests if agent correctly checks shipping restrictions.",
          tags: ["delivery", "international"],
        },
        {
          id: "sc-008",
          name: "Bulk purchase pricing",
          description: "User wants to buy large quantity. Tests if agent mentions bulk discounts or limits.",
          tags: ["price", "bulk", "limits"],
        },
      ];
      setScenarios(mockScenarios);
      setIsGenerating(false);
    }, 2000);
  };

  const runTests = () => {
    const testData = {
      agentName: inputType === "endpoint" ? agentName : agentName,
      inputType,
      endpoint: inputType === "endpoint" ? endpoint : undefined,
      spec: inputType === "spec" ? yamlSpec : undefined,
      description,
      scenarios,
    };
    
    navigate("/execution", { state: testData });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-2">New Agent Test</h1>
        <p className="text-sm text-muted-foreground">
          Define your agent and generate test scenarios
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Define Agent */}
        <div>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">1. Define Agent</h2>
            
            <Tabs defaultValue="endpoint" onValueChange={(v) => setInputType(v as "endpoint" | "spec")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="endpoint">POST Endpoint</TabsTrigger>
                <TabsTrigger value="spec">YAML/JSON Spec</TabsTrigger>
              </TabsList>

              <TabsContent value="endpoint" className="space-y-4">
                <div>
                  <Label htmlFor="agent-name">Agent name</Label>
                  <Input
                    id="agent-name"
                    placeholder="e.g., Shopify Assistant"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="endpoint">POST endpoint URL</Label>
                  <Input
                    id="endpoint"
                    placeholder="https://api.example.com/agent"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="auth">Auth headers (optional)</Label>
                  <Textarea
                    id="auth"
                    placeholder='{"Authorization": "Bearer token"}'
                    rows={3}
                    value={authHeaders}
                    onChange={(e) => setAuthHeaders(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description of agent's role</Label>
                  <Textarea
                    id="description"
                    placeholder="e.g., Helps users buy items: price, delivery, size, stock."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    We'll call this endpoint as if we were a user agent and generate realistic test scenarios.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="spec" className="space-y-4">
                <div>
                  <Label htmlFor="agent-name-spec">Agent name</Label>
                  <Input
                    id="agent-name-spec"
                    placeholder="e.g., Shopify Assistant"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="spec">Agent specification</Label>
                  <Textarea
                    id="spec"
                    placeholder={`capabilities:
  - price_lookup
  - inventory_check
  - delivery_options
constraints:
  - max_price: 10000
  - delivery_regions: ["US", "CA"]`}
                    rows={12}
                    className="font-mono text-sm"
                    value={yamlSpec}
                    onChange={(e) => setYamlSpec(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Paste a description of the agent's capabilities, tools, and constraints. We'll infer what to test.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <Button 
              onClick={generateTestPlan} 
              disabled={!agentName || isGenerating}
              className="w-full mt-6"
            >
              {isGenerating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Generate Test Plan
            </Button>
          </Card>
        </div>

        {/* Right: Generated Test Plan */}
        <div>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">2. Generated Test Scenarios</h2>
            
            {scenarios.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">No scenarios generated yet.</p>
                <p className="text-xs mt-2">Define your agent and click "Generate Test Plan"</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  We generated {scenarios.length} scenarios based on your agent's role and capabilities.
                </p>

                <div className="space-y-3 mb-6">
                  {scenarios.map((scenario) => (
                    <div
                      key={scenario.id}
                      className="p-4 border border-border rounded-lg bg-muted/30"
                    >
                      <h3 className="text-sm font-medium text-foreground mb-1">
                        {scenario.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        {scenario.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {scenario.tags.map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <Button onClick={runTests} className="w-full">
                  Run Tests
                </Button>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewTest;
