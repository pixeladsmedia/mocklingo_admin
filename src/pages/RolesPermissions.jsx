import { Shield, Users, Settings, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const roles = [
  {
    id: "admin",
    name: "Administrator",
    description: "Full system access and management capabilities",
    userCount: 3,
    color: "destructive"
  },
  {
    id: "moderator",
    name: "Moderator", 
    description: "Can moderate content and manage users",
    userCount: 8,
    color: "primary"
  },
  {
    id: "premium",
    name: "Premium User",
    description: "Enhanced features and priority support",
    userCount: 245,
    color: "warning"
  },
  {
    id: "user",
    name: "Basic User",
    description: "Standard platform access",
    userCount: 15164,
    color: "secondary"
  }
]

const permissions = [
  { id: "user_management", name: "User Management", category: "Users" },
  { id: "content_moderation", name: "Content Moderation", category: "Content" },
  { id: "analytics_view", name: "View Analytics", category: "Analytics" },
  { id: "system_settings", name: "System Settings", category: "System" },
  { id: "feedback_management", name: "Feedback Management", category: "Support" },
  { id: "token_management", name: "Token Management", category: "System" },
  { id: "session_monitoring", name: "Session Monitoring", category: "Monitoring" },
  { id: "role_management", name: "Role Management", category: "Users" }
]

const rolePermissions = {
  admin: ["user_management", "content_moderation", "analytics_view", "system_settings", "feedback_management", "token_management", "session_monitoring", "role_management"],
  moderator: ["user_management", "content_moderation", "feedback_management", "session_monitoring"],
  premium: ["analytics_view"],
  user: []
}

export default function RolesPermissions() {
  const getColorClasses = (color) => {
    switch (color) {
      case "destructive":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "primary":
        return "bg-primary/10 text-primary border-primary/20"
      case "warning":
        return "bg-warning/10 text-warning border-warning/20"
      case "secondary":
        return "bg-secondary/10 text-secondary-foreground border-secondary/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
          <p className="text-muted-foreground">
            Manage user roles and access permissions
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      </div>

      <Tabs defaultValue="roles" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
          {/* Roles Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {roles.map((role) => (
              <Card key={role.id} className="transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <Badge className={getColorClasses(role.color)}>
                      {role.userCount} users
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h3 className="font-semibold">{role.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {role.description}
                    </p>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Users className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          {/* Permissions Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
              <CardDescription>
                Configure permissions for each role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Permission</th>
                      <th className="text-left p-4 font-medium">Category</th>
                      {roles.map((role) => (
                        <th key={role.id} className="text-center p-4 font-medium">
                          {role.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((permission) => (
                      <tr key={permission.id} className="border-b hover:bg-muted/50">
                        <td className="p-4 font-medium">{permission.name}</td>
                        <td className="p-4">
                          <Badge variant="outline">{permission.category}</Badge>
                        </td>
                        {roles.map((role) => (
                          <td key={role.id} className="p-4 text-center">
                            <Switch
                              checked={rolePermissions[role.id]?.includes(permission.id)}
                              disabled={role.id === "admin"} // Admin always has all permissions
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
