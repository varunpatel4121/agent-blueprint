import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and platform preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6 max-w-3xl">
        {/* Account Settings */}
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-lg font-semibold text-foreground mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="john@example.com" defaultValue="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" placeholder="Acme Inc." defaultValue="Acme Inc." />
            </div>
            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">Save Changes</Button>
          </div>
        </Card>

        {/* Notification Preferences */}
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-lg font-semibold text-foreground mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Simulation Complete</p>
                <p className="text-sm text-muted-foreground">Get notified when simulations finish</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Test Failures</p>
                <p className="text-sm text-muted-foreground">Alert me when tests fail</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Weekly Reports</p>
                <p className="text-sm text-muted-foreground">Receive weekly performance summaries</p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        {/* API Settings */}
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-lg font-semibold text-foreground mb-4">API Access</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <div className="flex gap-2">
                <Input 
                  id="api-key" 
                  type="password" 
                  value="sk_test_4eC39HqLyjWDarjtT1zdp7dc" 
                  readOnly 
                />
                <Button variant="outline">Copy</Button>
              </div>
              <p className="text-sm text-muted-foreground">Use this key to integrate with your agents</p>
            </div>
            <Button variant="destructive">Regenerate API Key</Button>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border border-destructive/50 bg-card">
          <h2 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/5">
              <div>
                <p className="font-medium text-foreground">Delete Account</p>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive">Delete</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
