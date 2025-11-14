import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";

interface Agent {
  id: string;
  name: string;
  role: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  brightness: number;
  isTarget: boolean;
  relevanceScore: number;
}

interface Message {
  x: number;
  y: number;
  progress: number;
  fromAgent: Agent;
  toAgent: Agent;
}

interface ScanBeam {
  angle: number;
  opacity: number;
  targetId: string;
}

export const SimulationVisualizer = ({ scenario }: { scenario: any }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredAgent, setHoveredAgent] = useState<Agent | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const animationRef = useRef<number>();
  const agentsRef = useRef<Agent[]>([]);
  const messagesRef = useRef<Message[]>([]);
  const scanBeamsRef = useRef<ScanBeam[]>([]);
  const phaseRef = useRef<"entering" | "scanning" | "selecting" | "connected">("entering");
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize agents
    const centerX = canvas.width / window.devicePixelRatio / 2;
    const centerY = canvas.height / window.devicePixelRatio / 2;

    // Test Agent (starts center)
    const testAgent: Agent = {
      id: "test",
      name: "Test Agent",
      role: "Shopify Assistant",
      x: centerX,
      y: centerY,
      vx: 0,
      vy: 0,
      radius: 40,
      color: "hsl(195, 100%, 50%)",
      brightness: 0,
      isTarget: false,
      relevanceScore: 0,
    };

    // Target agents (orbit around center)
    const targetAgents: Agent[] = [
      {
        id: "inventory",
        name: "Inventory API",
        role: "Stock Management",
        x: centerX + 200,
        y: centerY - 100,
        vx: 0,
        vy: 0,
        radius: 35,
        color: "hsl(142, 76%, 45%)",
        brightness: 0,
        isTarget: true,
        relevanceScore: 0.9,
      },
      {
        id: "pricing",
        name: "Pricing API",
        role: "Price Calculator",
        x: centerX - 180,
        y: centerY + 80,
        vx: 0,
        vy: 0,
        radius: 30,
        color: "hsl(270, 75%, 65%)",
        brightness: 0,
        isTarget: true,
        relevanceScore: 0.6,
      },
      {
        id: "delivery",
        name: "Delivery API",
        role: "Shipping Options",
        x: centerX + 150,
        y: centerY + 120,
        vx: 0,
        vy: 0,
        radius: 30,
        color: "hsl(25, 95%, 53%)",
        brightness: 0,
        isTarget: true,
        relevanceScore: 0.7,
      },
      {
        id: "catalog",
        name: "Catalog API",
        role: "Product Search",
        x: centerX - 200,
        y: centerY - 80,
        vx: 0,
        vy: 0,
        radius: 28,
        color: "hsl(264, 80%, 60%)",
        brightness: 0,
        isTarget: true,
        relevanceScore: 0.4,
      },
    ];

    agentsRef.current = [testAgent, ...targetAgents];

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let found = false;
      for (const agent of agentsRef.current) {
        const dx = x - agent.x;
        const dy = y - agent.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < agent.radius) {
          setHoveredAgent(agent);
          found = true;
          break;
        }
      }
      if (!found) setHoveredAgent(null);
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (const agent of agentsRef.current) {
        const dx = x - agent.x;
        const dy = y - agent.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < agent.radius) {
          setSelectedAgent(agent);
          break;
        }
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);

    // Animation phases
    setTimeout(() => {
      phaseRef.current = "scanning";
      // Create scan beams
      targetAgents.forEach((agent, idx) => {
        setTimeout(() => {
          scanBeamsRef.current.push({
            angle: Math.atan2(agent.y - testAgent.y, agent.x - testAgent.x),
            opacity: 1,
            targetId: agent.id,
          });
        }, idx * 300);
      });
    }, 1000);

    setTimeout(() => {
      phaseRef.current = "selecting";
    }, 3000);

    setTimeout(() => {
      phaseRef.current = "connected";
      // Start message flow
      const createMessage = () => {
        const mostRelevant = targetAgents.reduce((prev, curr) => 
          curr.relevanceScore > prev.relevanceScore ? curr : prev
        );
        messagesRef.current.push({
          x: testAgent.x,
          y: testAgent.y,
          progress: 0,
          fromAgent: testAgent,
          toAgent: mostRelevant,
        });
      };
      
      createMessage();
      setInterval(createMessage, 1500);
    }, 4000);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      timeRef.current += 0.016;

      const centerX = canvas.width / window.devicePixelRatio / 2;
      const centerY = canvas.height / window.devicePixelRatio / 2;

      // Update agent positions (orbital drift)
      agentsRef.current.forEach((agent) => {
        if (agent.isTarget && phaseRef.current !== "connected") {
          const dx = agent.x - centerX;
          const dy = agent.y - centerY;
          const angle = Math.atan2(dy, dx);
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Orbital motion
          const orbitSpeed = 0.0003;
          const newAngle = angle + orbitSpeed;
          agent.x = centerX + Math.cos(newAngle) * distance;
          agent.y = centerY + Math.sin(newAngle) * distance;
          
          // Add gentle floating
          agent.y += Math.sin(timeRef.current + agent.id.length) * 0.3;
          agent.x += Math.cos(timeRef.current * 0.7 + agent.id.length) * 0.2;
        }

        // Test agent breathing
        if (agent.id === "test") {
          agent.brightness = 0.5 + Math.sin(timeRef.current * 2) * 0.3;
        }

        // Brightness during scanning
        if (phaseRef.current === "scanning") {
          const beam = scanBeamsRef.current.find(b => b.targetId === agent.id);
          if (beam && agent.isTarget) {
            agent.brightness = 0.3 + Math.sin(timeRef.current * 5) * 0.7;
          }
        }

        // Brightness during selection
        if (phaseRef.current === "selecting" || phaseRef.current === "connected") {
          if (agent.isTarget) {
            agent.brightness = agent.relevanceScore;
          }
        }
      });

      // Draw scan beams
      if (phaseRef.current === "scanning") {
        const testAgent = agentsRef.current[0];
        scanBeamsRef.current.forEach((beam) => {
          const target = agentsRef.current.find(a => a.id === beam.targetId);
          if (!target) return;

          const gradient = ctx.createLinearGradient(testAgent.x, testAgent.y, target.x, target.y);
          gradient.addColorStop(0, `hsla(195, 100%, 50%, ${beam.opacity * 0.6})`);
          gradient.addColorStop(1, `hsla(195, 100%, 50%, 0)`);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(testAgent.x, testAgent.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();

          // Pulsing circle at beam end
          ctx.fillStyle = `hsla(195, 100%, 50%, ${beam.opacity * 0.3})`;
          ctx.beginPath();
          ctx.arc(target.x, target.y, target.radius + 10, 0, Math.PI * 2);
          ctx.fill();

          beam.opacity *= 0.98;
        });
      }

      // Draw connection to most relevant agent
      if (phaseRef.current === "connected") {
        const testAgent = agentsRef.current[0];
        const mostRelevant = agentsRef.current.find(a => a.id === "inventory");
        
        if (mostRelevant) {
          // Animated connection line
          const pulse = Math.sin(timeRef.current * 3) * 0.5 + 0.5;
          const gradient = ctx.createLinearGradient(testAgent.x, testAgent.y, mostRelevant.x, mostRelevant.y);
          gradient.addColorStop(0, `hsla(142, 76%, 45%, ${0.6 + pulse * 0.4})`);
          gradient.addColorStop(0.5, `hsla(195, 100%, 50%, ${0.4 + pulse * 0.4})`);
          gradient.addColorStop(1, `hsla(142, 76%, 45%, ${0.6 + pulse * 0.4})`);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(testAgent.x, testAgent.y);
          ctx.lineTo(mostRelevant.x, mostRelevant.y);
          ctx.stroke();

          // Dim other agents
          agentsRef.current.forEach((agent) => {
            if (agent.isTarget && agent.id !== "inventory") {
              agent.brightness *= 0.95;
              agent.brightness = Math.max(agent.brightness, 0.1);
            }
          });
        }
      }

      // Update and draw messages
      messagesRef.current = messagesRef.current.filter((msg) => {
        msg.progress += 0.02;
        
        if (msg.progress >= 1) {
          // Create return message
          if (msg.fromAgent.id === "test") {
            messagesRef.current.push({
              x: msg.toAgent.x,
              y: msg.toAgent.y,
              progress: 0,
              fromAgent: msg.toAgent,
              toAgent: msg.fromAgent,
            });
          }
          return false;
        }

        const x = msg.fromAgent.x + (msg.toAgent.x - msg.fromAgent.x) * msg.progress;
        const y = msg.fromAgent.y + (msg.toAgent.y - msg.fromAgent.y) * msg.progress;

        // Draw message particle
        const isFromTest = msg.fromAgent.id === "test";
        const color = isFromTest ? "hsl(195, 100%, 50%)" : "hsl(142, 76%, 45%)";
        
        // Glow
        ctx.fillStyle = `${color.replace(")", ", 0.2)")}`;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Trail
        for (let i = 0; i < 3; i++) {
          const trailProgress = msg.progress - (i + 1) * 0.05;
          if (trailProgress > 0) {
            const tx = msg.fromAgent.x + (msg.toAgent.x - msg.fromAgent.x) * trailProgress;
            const ty = msg.fromAgent.y + (msg.toAgent.y - msg.fromAgent.y) * trailProgress;
            ctx.fillStyle = `${color.replace(")", `, ${0.3 - i * 0.1})`)}`;
            ctx.beginPath();
            ctx.arc(tx, ty, 3 - i, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        return true;
      });

      // Draw agents
      agentsRef.current.forEach((agent) => {
        const isHovered = hoveredAgent?.id === agent.id;
        const scale = isHovered ? 1.1 : 1;
        const radius = agent.radius * scale;

        // Outer glow
        const glowSize = radius + 20 * agent.brightness;
        const gradient = ctx.createRadialGradient(agent.x, agent.y, radius, agent.x, agent.y, glowSize);
        gradient.addColorStop(0, agent.color.replace(")", `, ${agent.brightness * 0.4})`));
        gradient.addColorStop(1, agent.color.replace(")", ", 0)"));
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Main circle
        ctx.fillStyle = agent.color;
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Inner highlight
        const highlightGradient = ctx.createRadialGradient(
          agent.x - radius * 0.3,
          agent.y - radius * 0.3,
          0,
          agent.x,
          agent.y,
          radius
        );
        highlightGradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
        highlightGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = highlightGradient;
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Border
        ctx.strokeStyle = isHovered ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = isHovered ? 3 : 2;
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Label (if hovered)
        if (isHovered) {
          ctx.fillStyle = "hsl(220, 28%, 12%)";
          ctx.font = "600 13px system-ui, -apple-system, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(agent.name, agent.x, agent.y - radius - 15);
          
          ctx.font = "400 11px system-ui, -apple-system, sans-serif";
          ctx.fillStyle = "hsl(220, 15%, 45%)";
          ctx.fillText(agent.role, agent.x, agent.y - radius - 2);
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [hoveredAgent]);

  return (
    <Card className="p-8 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Agent Interaction Sandbox</h2>
        <div className="text-xs text-muted-foreground">
          {phaseRef.current === "entering" && "Initializing..."}
          {phaseRef.current === "scanning" && "Scanning candidate agents..."}
          {phaseRef.current === "selecting" && "Evaluating relevance..."}
          {phaseRef.current === "connected" && "Active connection"}
        </div>
      </div>
      
      <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-background to-muted/30 border border-border">
        <canvas
          ref={canvasRef}
          className="w-full h-[500px] cursor-pointer"
          style={{ display: "block" }}
        />
        
        {hoveredAgent && (
          <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg">
            <p className="text-sm font-semibold text-foreground mb-1">{hoveredAgent.name}</p>
            <p className="text-xs text-muted-foreground mb-2">{hoveredAgent.role}</p>
            {hoveredAgent.isTarget && (
              <div className="text-xs text-muted-foreground">
                Relevance: {(hoveredAgent.relevanceScore * 100).toFixed(0)}%
              </div>
            )}
          </div>
        )}

        {selectedAgent && (
          <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg max-w-xs">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-foreground">{selectedAgent.name}</p>
              <button
                onClick={() => setSelectedAgent(null)}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{selectedAgent.role}</p>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-muted/50 rounded">
                <p className="text-muted-foreground">Status: <span className="text-foreground">Active</span></p>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <p className="text-muted-foreground">Messages: <span className="text-foreground">12</span></p>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <p className="text-muted-foreground">Latency: <span className="text-foreground">45ms</span></p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-muted-foreground text-center">
        Hover over agents to see details • Click to view interaction logs
      </div>
    </Card>
  );
};
