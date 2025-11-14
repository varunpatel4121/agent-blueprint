import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { agentName, endpoint, description, yamlSpec, inputType, scenarios } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Running ${scenarios.length} tests for agent: ${agentName}`);

    // Build agent context
    let agentContext = `Agent: ${agentName}\n`;
    if (inputType === "endpoint") {
      agentContext += `Endpoint: ${endpoint}\nDescription: ${description}`;
    } else {
      agentContext += `Specification:\n${yamlSpec}`;
    }

    // Run tests for each scenario
    const results = await Promise.all(
      scenarios.map(async (scenario: any, index: number) => {
        console.log(`Testing scenario ${index + 1}/${scenarios.length}: ${scenario.name}`);
        
        const prompt = `You are evaluating an AI agent's behavior against a test scenario.

${agentContext}

Test Scenario:
Name: ${scenario.name}
Description: ${scenario.description}
Tags: ${scenario.tags.join(", ")}

Your task:
1. Simulate testing this scenario against the agent
2. Evaluate if the agent would pass, fail, or partially pass this test
3. Provide a score (0-100)
4. Give specific feedback on what worked or didn't work

Return a JSON object with this exact structure:
{
  "status": "pass" | "fail" | "partial",
  "score": number (0-100),
  "feedback": "detailed feedback string",
  "details": {
    "expected": "what was expected",
    "actual": "what happened",
    "issues": ["issue 1", "issue 2"] or []
  }
}

Return ONLY the JSON object, no other text.`;

        try {
          const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [
                {
                  role: "user",
                  content: prompt,
                },
              ],
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`AI gateway error for scenario ${scenario.id}:`, response.status, errorText);
            throw new Error(`AI gateway error: ${response.status}`);
          }

          const data = await response.json();
          const content = data.choices[0].message.content;

          // Extract JSON from the response
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);
            return {
              scenarioId: scenario.id,
              name: scenario.name,
              description: scenario.description,
              tags: scenario.tags,
              ...result,
            };
          } else {
            throw new Error("Failed to parse result from AI response");
          }
        } catch (error) {
          console.error(`Error testing scenario ${scenario.id}:`, error);
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          return {
            scenarioId: scenario.id,
            name: scenario.name,
            description: scenario.description,
            tags: scenario.tags,
            status: "fail",
            score: 0,
            feedback: `Test execution failed: ${errorMessage}`,
            details: {
              expected: "Valid test execution",
              actual: "Error during test",
              issues: [errorMessage],
            },
          };
        }
      })
    );

    // Calculate overall metrics
    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const averageScore = Math.round(totalScore / results.length);
    const passCount = results.filter(r => r.status === "pass").length;
    const failCount = results.filter(r => r.status === "fail").length;
    const partialCount = results.filter(r => r.status === "partial").length;

    console.log(`Tests complete: ${passCount} passed, ${partialCount} partial, ${failCount} failed`);

    return new Response(
      JSON.stringify({
        results,
        summary: {
          overallScore: averageScore,
          totalTests: results.length,
          passed: passCount,
          failed: failCount,
          partial: partialCount,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in run-agent-tests function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
