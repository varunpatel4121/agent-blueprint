import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";

const agentSchema = z.object({
  name: z.string().trim().min(1, "Agent name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().trim().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  type: z.string().min(1, "Type is required"),
  interface: z.string().min(1, "Interface type is required"),
  endpointUrl: z.string().trim().url("Must be a valid URL"),
  authMethod: z.string().min(1, "Auth method is required"),
});

type AgentFormData = z.infer<typeof agentSchema>;

interface AddAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddAgentDialog({ open, onOpenChange }: AddAgentDialogProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      type: "",
      interface: "",
      authMethod: "",
    },
  });

  const selectedType = watch("type");
  const selectedInterface = watch("interface");
  const selectedAuth = watch("authMethod");

  const onSubmit = (data: AgentFormData) => {
    console.log("Agent data:", { ...data, tags });
    toast.success("Agent created successfully!", {
      description: `${data.name} has been added to your workspace.`,
    });
    handleClose();
  };

  const handleClose = () => {
    reset();
    setTags([]);
    setTagInput("");
    onOpenChange(false);
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-foreground">Add New Agent</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Connect a new AI agent to your testing platform. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Agent Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Agent Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Customer Support Bot"
              className="bg-background border-border"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-foreground">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what this agent does and its primary purpose..."
              className="bg-background border-border min-h-[80px] resize-none"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Type and Interface Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium text-foreground">
                Type <span className="text-destructive">*</span>
              </Label>
              <Select value={selectedType} onValueChange={(value) => setValue("type", value)}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border z-50">
                  <SelectItem value="customer-support">Customer Support</SelectItem>
                  <SelectItem value="data-processing">Data Processing</SelectItem>
                  <SelectItem value="classification">Classification</SelectItem>
                  <SelectItem value="automation">Automation</SelectItem>
                  <SelectItem value="analysis">Analysis</SelectItem>
                  <SelectItem value="financial-ops">Financial Ops</SelectItem>
                  <SelectItem value="recommender">Recommender</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-destructive">{errors.type.message}</p>
              )}
            </div>

            {/* Interface */}
            <div className="space-y-2">
              <Label htmlFor="interface" className="text-sm font-medium text-foreground">
                Interface <span className="text-destructive">*</span>
              </Label>
              <Select value={selectedInterface} onValueChange={(value) => setValue("interface", value)}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select interface" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border z-50">
                  <SelectItem value="http">HTTP Endpoint</SelectItem>
                  <SelectItem value="mcp">MCP Server</SelectItem>
                  <SelectItem value="sdk">SDK Integration</SelectItem>
                </SelectContent>
              </Select>
              {errors.interface && (
                <p className="text-sm text-destructive">{errors.interface.message}</p>
              )}
            </div>
          </div>

          {/* Endpoint URL */}
          <div className="space-y-2">
            <Label htmlFor="endpointUrl" className="text-sm font-medium text-foreground">
              Endpoint URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="endpointUrl"
              type="url"
              placeholder="https://api.example.com/agent"
              className="bg-background border-border"
              {...register("endpointUrl")}
            />
            {errors.endpointUrl && (
              <p className="text-sm text-destructive">{errors.endpointUrl.message}</p>
            )}
          </div>

          {/* Auth Method */}
          <div className="space-y-2">
            <Label htmlFor="authMethod" className="text-sm font-medium text-foreground">
              Authentication <span className="text-destructive">*</span>
            </Label>
            <Select value={selectedAuth} onValueChange={(value) => setValue("authMethod", value)}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select auth method" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="api-key">API Key</SelectItem>
                <SelectItem value="bearer">Bearer Token</SelectItem>
                <SelectItem value="oauth">OAuth 2.0</SelectItem>
              </SelectContent>
            </Select>
            {errors.authMethod && (
              <p className="text-sm text-destructive">{errors.authMethod.message}</p>
            )}
            {selectedAuth && selectedAuth !== "none" && (
              <p className="text-xs text-muted-foreground mt-1">
                You can configure credentials in the agent settings after creation.
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium text-foreground">
              Tags (Optional)
            </Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add a tag (max 5)"
                className="bg-background border-border"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                disabled={tags.length >= 5}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addTag}
                disabled={!tagInput.trim() || tags.length >= 5}
              >
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Tags help organize and filter your agents (e.g., production, staging, experimental)
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-hover text-primary-foreground">
              Save Agent
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
