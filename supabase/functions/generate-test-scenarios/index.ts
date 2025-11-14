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
    const { agentName, inputType, description, yamlSpec } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the prompt based on the input type
    let prompt = `Generate 8 comprehensive test scenarios for an AI agent called "${agentName}". `;

    if (inputType === "endpoint") {
      prompt += `This agent is described as: "${description}". `;
    } else {
      prompt += `Here is the agent specification:\n${yamlSpec}\n\n`;
    }

    prompt += `
Please generate 8 diverse test scenarios that cover:
1. Core functionality testing
2. Edge cases and error handling
3. Security and prompt injection attempts
4. Multi-constraint scenarios
5. Boundary testing
6. Real-world usage patterns
7. Performance under complex queries
8. Compliance with specified constraints

Format the response as a JSON array where each object has:
- id: a unique identifier like "sc-001"
- name: a concise, descriptive title
- description: 1-2 sentences explaining what's being tested
- tags: array of relevant categories (e.g., ["price", "delivery", "security"])

Return ONLY the JSON array, no other text.`;

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
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extract JSON from the response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const scenarios = JSON.parse(jsonMatch[0]);
      return new Response(
        JSON.stringify({ scenarios }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      throw new Error("Failed to parse scenarios from AI response");
    }
  } catch (error) {
    console.error("Error in generate-test-scenarios function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
