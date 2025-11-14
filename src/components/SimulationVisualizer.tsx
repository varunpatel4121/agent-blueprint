import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface AgentNodeProps {
  id: string;
  name: string;
  isSelected?: boolean;
  isTarget?: boolean;
  position: { x: number; y: number };
  delay?: number;
}

const AgentNode = ({ name, isSelected, isTarget, position, delay = 0 }: AgentNodeProps) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 20 }}
      className="absolute"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
    >
      <motion.div
        className={`relative flex items-center justify-center ${
          isTarget ? "w-20 h-20" : "w-16 h-16"
        }`}
        animate={
          isSelected || isTarget
            ? {
                scale: [1, 1.1, 1],
                opacity: [1, 0.8, 1],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Outer glow */}
        <div
          className={`absolute inset-0 rounded-full ${
            isTarget
              ? "bg-primary"
              : isSelected
              ? "bg-primary"
              : "bg-primary/30"
          } blur-xl opacity-50`}
        />
        
        {/* Node circle */}
        <div
          className={`relative rounded-full ${
            isTarget
              ? "w-20 h-20 bg-primary/20 border-4 border-primary"
              : isSelected
              ? "w-16 h-16 bg-primary/20 border-3 border-primary"
              : "w-12 h-12 bg-primary/10 border-2 border-primary/50"
          } backdrop-blur-sm flex items-center justify-center`}
        >
          <div className="w-2 h-2 bg-primary rounded-full" />
        </div>

        {/* Label */}
        {(isSelected || isTarget) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded"
          >
            {name}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

interface DataPacketProps {
  path: string;
  delay?: number;
}

const DataPacket = ({ path, delay = 0 }: DataPacketProps) => {
  return (
    <motion.circle
      r="4"
      fill="currentColor"
      className="text-primary"
      initial={{ offsetDistance: "0%", opacity: 0 }}
      animate={{
        offsetDistance: ["0%", "100%"],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{ offsetPath: `path('${path}')` }}
    />
  );
};

interface InteractionTimelineProps {
  interactions: Array<{
    id: string;
    type: "request" | "response";
    message: string;
    timestamp: string;
  }>;
}

const InteractionTimeline = ({ interactions }: InteractionTimelineProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground mb-4">Interaction Timeline</h3>
      <div className="space-y-2">
        {interactions.map((interaction, index) => (
          <motion.div
            key={interaction.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            className={`p-3 rounded-lg border ${
              interaction.type === "request"
                ? "bg-primary/5 border-primary/20"
                : "bg-success/5 border-success/20"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-foreground">
                {interaction.type === "request" ? "→ Request" : "← Response"}
              </span>
              <span className="text-xs text-muted-foreground">{interaction.timestamp}</span>
            </div>
            <p className="text-xs text-muted-foreground">{interaction.message}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const SimulationVisualizer = () => {
  const [selectedAgentIndex, setSelectedAgentIndex] = useState<number>(0);
  const [showConnection, setShowConnection] = useState(false);

  const targetAgent = { id: "target", name: "Test Agent", position: { x: 10, y: 50 } };
  
  const agents = [
    { id: "agent-1", name: "Agent A", position: { x: 70, y: 20 } },
    { id: "agent-2", name: "Agent B", position: { x: 75, y: 35 } },
    { id: "agent-3", name: "Agent C", position: { x: 80, y: 50 } },
    { id: "agent-4", name: "Agent D", position: { x: 75, y: 65 } },
    { id: "agent-5", name: "Agent E", position: { x: 70, y: 80 } },
  ];

  const interactions = [
    {
      id: "int-1",
      type: "request" as const,
      message: "Classify customer sentiment for ticket #1247",
      timestamp: "0.2s",
    },
    {
      id: "int-2",
      type: "response" as const,
      message: "Sentiment: Positive (confidence: 0.92)",
      timestamp: "0.8s",
    },
    {
      id: "int-3",
      type: "request" as const,
      message: "Generate response for positive sentiment",
      timestamp: "1.1s",
    },
    {
      id: "int-4",
      type: "response" as const,
      message: "Response generated: 'Thank you for your feedback...'",
      timestamp: "1.9s",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConnection(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Calculate path between target and selected agent
  const selectedAgent = agents[selectedAgentIndex];
  const pathData = `M ${targetAgent.position.x},${targetAgent.position.y} Q ${
    (targetAgent.position.x + selectedAgent.position.x) / 2
  },${(targetAgent.position.y + selectedAgent.position.y) / 2 - 10} ${
    selectedAgent.position.x
  },${selectedAgent.position.y}`;

  return (
    <Card className="border border-border bg-card/50 backdrop-blur-sm p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-2">Simulation Visualizer</h2>
        <p className="text-sm text-muted-foreground">
          Real-time visualization of agent interactions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Network Visualization */}
        <div className="lg:col-span-2">
          <div className="relative w-full h-[400px] bg-background/50 rounded-lg border border-border overflow-hidden">
            {/* Scanning beam animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Target agent */}
            <AgentNode
              id={targetAgent.id}
              name={targetAgent.name}
              isTarget
              position={targetAgent.position}
            />

            {/* Other agents */}
            {agents.map((agent, index) => (
              <AgentNode
                key={agent.id}
                id={agent.id}
                name={agent.name}
                isSelected={index === selectedAgentIndex}
                position={agent.position}
                delay={index * 0.1 + 0.3}
              />
            ))}

            {/* Connection line and data packets */}
            {showConnection && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                
                <motion.path
                  d={pathData}
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
                
                {/* Data packets */}
                {[0, 0.5, 1, 1.5].map((delay) => (
                  <DataPacket key={delay} path={pathData} delay={delay} />
                ))}
              </svg>
            )}

            {/* Selection info */}
            <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground">
                Selected: <span className="text-foreground font-medium">{selectedAgent.name}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Interaction Timeline */}
        <div className="lg:col-span-1">
          <Card className="h-[400px] overflow-y-auto p-4 bg-background/50 border-border">
            <InteractionTimeline interactions={interactions} />
          </Card>
        </div>
      </div>
    </Card>
  );
};
