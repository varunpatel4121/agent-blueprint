import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";

interface Agent {
  id: string;
  name: string;
  role: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  brightness: number;
  isSelected: boolean;
  evaluationProgress: number;
}

interface Message {
  progress: number;
  direction: "outgoing" | "incoming";
}

interface ScanWave {
  radius: number;
  opacity: number;
}

export const SimulationVisualizer = ({ 
  scenario,
  onPhaseChange 
}: { 
  scenario: any;
  onPhaseChange?: (phase: "searching" | "evaluating" | "selecting" | "interacting") => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phaseLabel, setPhaseLabel] = useState("Initializing...");
  const animationRef = useRef<number>();
  const agentsRef = useRef<Agent[]>([]);
  const messagesRef = useRef<Message[]>([]);
  const scanWavesRef = useRef<ScanWave[]>([]);
  const phaseRef = useRef<"searching" | "evaluating" | "selecting" | "interacting">("searching");
  const timeRef = useRef(0);
  const selectionLineProgressRef = useRef(0);

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

    // Fixed node positions
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    const centerX = w / 2;
    const centerY = h / 2;

    // Test Agent (center, larger)
    const testAgent: Agent = {
      id: "test",
      name: "Shopify Assistant",
      role: "Test Agent",
      x: centerX,
      y: centerY,
      radius: 45,
      color: "hsl(195, 100%, 50%)",
      brightness: 1,
      isSelected: false,
      evaluationProgress: 0,
    };

    // Target agents (fixed positions around center)
    const targetAgents: Agent[] = [
      {
        id: "inventory",
        name: "Inventory API Agent",
        role: "Stock Management",
        x: centerX + 220,
        y: centerY - 80,
        radius: 32,
        color: "hsl(195, 80%, 55%)",
        brightness: 0.3,
        isSelected: true,
        evaluationProgress: 0,
      },
      {
        id: "pricing",
        name: "Pricing API Agent",
        role: "Price Calculator",
        x: centerX - 200,
        y: centerY + 100,
        radius: 32,
        color: "hsl(195, 80%, 55%)",
        brightness: 0.3,
        isSelected: false,
        evaluationProgress: 0,
      },
      {
        id: "delivery",
        name: "Delivery API Agent",
        role: "Shipping Options",
        x: centerX + 180,
        y: centerY + 130,
        radius: 32,
        color: "hsl(195, 80%, 55%)",
        brightness: 0.3,
        isSelected: false,
        evaluationProgress: 0,
      },
      {
        id: "catalog",
        name: "Catalog API Agent",
        role: "Product Search",
        x: centerX - 220,
        y: centerY - 100,
        radius: 32,
        color: "hsl(195, 80%, 55%)",
        brightness: 0.3,
        isSelected: false,
        evaluationProgress: 0,
      },
    ];

    agentsRef.current = [testAgent, ...targetAgents];

    // Animation phase timeline
    const timeline = [
      { time: 0, phase: "searching" as const, label: "Searching..." },
      { time: 1500, phase: "evaluating" as const, label: "Evaluating agents..." },
      { time: 3000, phase: "selecting" as const, label: "Selecting Inventory API Agent..." },
      { time: 4000, phase: "interacting" as const, label: "Exchanging messages..." },
    ];

    timeline.forEach(({ time, phase, label }) => {
      setTimeout(() => {
        phaseRef.current = phase;
        setPhaseLabel(label);
        onPhaseChange?.(phase);
      }, time);
    });

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      timeRef.current += 0.016;

      const testAgent = agentsRef.current[0];
      const selectedAgent = agentsRef.current.find(a => a.isSelected);

      // Phase 1: Searching (0-1.5s) - Scanning waves
      if (phaseRef.current === "searching") {
        // Emit scanning waves from test agent
        if (Math.random() < 0.05) {
          scanWavesRef.current.push({ radius: 0, opacity: 1 });
        }

        scanWavesRef.current = scanWavesRef.current.filter((wave) => {
          wave.radius += 4;
          wave.opacity *= 0.96;

          if (wave.opacity < 0.05) return false;

          // Draw wave
          ctx.strokeStyle = `hsla(195, 100%, 60%, ${wave.opacity * 0.4})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(testAgent.x, testAgent.y, wave.radius, 0, Math.PI * 2);
          ctx.stroke();

          // Check if wave hits target agents
          agentsRef.current.forEach((agent) => {
            if (agent.id !== "test") {
              const dist = Math.sqrt((agent.x - testAgent.x) ** 2 + (agent.y - testAgent.y) ** 2);
              if (Math.abs(dist - wave.radius) < 10) {
                agent.brightness = Math.min(agent.brightness + 0.1, 0.7);
              }
            }
          });

          return true;
        });
      }

      // Phase 2: Evaluating (1.5-3s) - Lines to candidates
      if (phaseRef.current === "evaluating") {
        agentsRef.current.forEach((agent) => {
          if (agent.id === "test") return;

          // Increase evaluation progress
          agent.evaluationProgress = Math.min(agent.evaluationProgress + 0.008, 1);

          // Draw evaluation line
          const lineProgress = agent.evaluationProgress;
          const endX = testAgent.x + (agent.x - testAgent.x) * lineProgress;
          const endY = testAgent.y + (agent.y - testAgent.y) * lineProgress;

          const pulse = Math.sin(timeRef.current * 4 + agent.id.length) * 0.3 + 0.7;
          ctx.strokeStyle = `hsla(195, 80%, 60%, ${pulse * 0.3})`;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(testAgent.x, testAgent.y);
          ctx.lineTo(endX, endY);
          ctx.stroke();
          ctx.setLineDash([]);

          // Selected agent brightens more
          if (agent.isSelected) {
            agent.brightness = Math.min(agent.brightness + 0.02, 1);
          } else {
            agent.brightness = Math.max(agent.brightness - 0.01, 0.2);
          }
        });
      }

      // Phase 3: Selecting (3-4s) - Bright line to selected
      if (phaseRef.current === "selecting" && selectedAgent) {
        selectionLineProgressRef.current = Math.min(selectionLineProgressRef.current + 0.03, 1);
        const progress = selectionLineProgressRef.current;

        // Dim non-selected agents
        agentsRef.current.forEach((agent) => {
          if (agent.id !== "test" && !agent.isSelected) {
            agent.brightness = Math.max(agent.brightness - 0.02, 0.15);
          }
        });

        // Brighten selected agent
        selectedAgent.brightness = Math.min(selectedAgent.brightness + 0.03, 1);

        // Draw bright selection line
        const endX = testAgent.x + (selectedAgent.x - testAgent.x) * progress;
        const endY = testAgent.y + (selectedAgent.y - testAgent.y) * progress;

        const pulse = Math.sin(timeRef.current * 5) * 0.2 + 0.8;
        const gradient = ctx.createLinearGradient(testAgent.x, testAgent.y, endX, endY);
        gradient.addColorStop(0, `hsla(195, 100%, 60%, ${pulse})`);
        gradient.addColorStop(0.5, `hsla(142, 76%, 50%, ${pulse * 0.8})`);
        gradient.addColorStop(1, `hsla(195, 100%, 60%, ${pulse})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "hsla(195, 100%, 60%, 0.5)";
        ctx.beginPath();
        ctx.moveTo(testAgent.x, testAgent.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw selection label if line is complete
        if (progress > 0.9) {
          const midX = (testAgent.x + selectedAgent.x) / 2;
          const midY = (testAgent.y + selectedAgent.y) / 2 - 20;

          ctx.fillStyle = "hsla(220, 28%, 12%, 0.9)";
          ctx.font = "600 12px system-ui, -apple-system, sans-serif";
          ctx.textAlign = "center";
          const label = `Selected: ${selectedAgent.name}`;
          const metrics = ctx.measureText(label);
          const padding = 8;
          ctx.fillRect(
            midX - metrics.width / 2 - padding,
            midY - 10,
            metrics.width + padding * 2,
            20
          );

          ctx.fillStyle = "hsl(195, 100%, 60%)";
          ctx.fillText(label, midX, midY + 4);
        }
      }

      // Phase 4: Interacting (4-5s) - Message packets
      if (phaseRef.current === "interacting" && selectedAgent) {
        // Create new messages periodically
        if (messagesRef.current.length < 3 && Math.random() < 0.03) {
          const direction = messagesRef.current.length % 2 === 0 ? "outgoing" : "incoming";
          messagesRef.current.push({ progress: 0, direction });
        }

        // Draw connection line
        const pulse = Math.sin(timeRef.current * 3) * 0.3 + 0.7;
        ctx.strokeStyle = `hsla(195, 90%, 60%, ${pulse * 0.5})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 3]);
        ctx.beginPath();
        ctx.moveTo(testAgent.x, testAgent.y);
        ctx.lineTo(selectedAgent.x, selectedAgent.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Update and draw messages
        messagesRef.current = messagesRef.current.filter((msg) => {
          msg.progress += 0.015;
          if (msg.progress > 1) return false;

          const isOutgoing = msg.direction === "outgoing";
          const startX = isOutgoing ? testAgent.x : selectedAgent.x;
          const startY = isOutgoing ? testAgent.y : selectedAgent.y;
          const endX = isOutgoing ? selectedAgent.x : testAgent.x;
          const endY = isOutgoing ? selectedAgent.y : testAgent.y;

          const x = startX + (endX - startX) * msg.progress;
          const y = startY + (endY - startY) * msg.progress;

          const color = isOutgoing ? "hsl(195, 100%, 60%)" : "hsl(142, 76%, 50%)";

          // Glow
          ctx.fillStyle = color.replace(")", ", 0.3)");
          ctx.beginPath();
          ctx.arc(x, y, 7, 0, Math.PI * 2);
          ctx.fill();

          // Core
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(x, y, 3.5, 0, Math.PI * 2);
          ctx.fill();

          return true;
        });
      }

      // Draw all agents
      agentsRef.current.forEach((agent) => {
        const isTest = agent.id === "test";
        
        // Subtle idle pulse for all agents
        const idlePulse = Math.sin(timeRef.current * 2 + agent.id.length) * 0.05 + 0.95;
        const displayRadius = agent.radius * idlePulse;

        // Outer glow
        const glowIntensity = isTest ? 0.6 : agent.brightness;
        const glowSize = displayRadius + 15 * glowIntensity;
        const gradient = ctx.createRadialGradient(
          agent.x,
          agent.y,
          displayRadius * 0.5,
          agent.x,
          agent.y,
          glowSize
        );
        gradient.addColorStop(0, agent.color.replace(")", `, ${glowIntensity * 0.4})`));
        gradient.addColorStop(1, agent.color.replace(")", ", 0)"));
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Main circle
        ctx.fillStyle = agent.color;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, displayRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Inner highlight
        const highlightGradient = ctx.createRadialGradient(
          agent.x - displayRadius * 0.35,
          agent.y - displayRadius * 0.35,
          0,
          agent.x,
          agent.y,
          displayRadius
        );
        highlightGradient.addColorStop(0, "rgba(255, 255, 255, 0.5)");
        highlightGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = highlightGradient;
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, displayRadius, 0, Math.PI * 2);
        ctx.fill();

        // Border
        ctx.strokeStyle = isTest ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, displayRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Agent name label
        ctx.fillStyle = "hsl(220, 30%, 12%)";
        ctx.font = `${isTest ? "700" : "600"} ${isTest ? "14" : "12"}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(agent.name, agent.x, agent.y - displayRadius - 12);

        // Role label
        ctx.font = "400 10px system-ui, -apple-system, sans-serif";
        ctx.fillStyle = "hsl(220, 15%, 55%)";
        ctx.fillText(agent.role, agent.x, agent.y - displayRadius + 2);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <Card className="p-8 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Simulation Replay</h2>
        <div className="text-sm text-muted-foreground font-medium">
          {phaseLabel}
        </div>
      </div>
      
      <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-background to-muted/20 border border-border">
        <canvas
          ref={canvasRef}
          className="w-full h-[500px]"
          style={{ display: "block" }}
        />
      </div>

      <div className="mt-4 text-xs text-muted-foreground text-center">
        Automated replay of agent interaction and selection process
      </div>
    </Card>
  );
};
