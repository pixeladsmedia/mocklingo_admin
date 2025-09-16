import {
  Users as UsersIcon,
  Search,
  Filter,
  UserPlus,
  MoreHorizontal,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserList } from "../api/adminApi";

// const userData = [
//   {
//     id: "U001",
//     name: "John Doe",
//     email: "john.doe@email.com",
//     role: "premium",
//     status: "active",
//     lastActive: "2024-01-15T10:30:00",
//     joinDate: "2023-08-15",
//     sessionsCount: 45,
//   },
//   {
//     id: "U002",
//     name: "Jane Smith",
//     email: "jane.smith@email.com",
//     role: "user",
//     status: "active",
//     lastActive: "2024-01-14T16:45:00",
//     joinDate: "2023-11-20",
//     sessionsCount: 23,
//   },
//   {
//     id: "U003",
//     name: "Mike Johnson",
//     email: "mike.johnson@email.com",
//     role: "user",
//     status: "inactive",
//     lastActive: "2024-01-10T09:15:00",
//     joinDate: "2023-09-10",
//     sessionsCount: 12,
//   },
//   {
//     id: "U004",
//     name: "Sarah Wilson",
//     email: "sarah.wilson@email.com",
//     role: "admin",
//     status: "active",
//     lastActive: "2024-01-15T14:20:00",
//     joinDate: "2023-06-05",
//     sessionsCount: 67,
//   },
// ];

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [totalUsers, setTotalUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // const filteredUsers = userData.filter((user) => {
  //   const matchesSearch =
  //     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.email.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesRole = roleFilter === "all" || user.role === roleFilter;
  //   const matchesStatus =
  //     statusFilter === "all" || user.status === statusFilter;

  //   return matchesSearch && matchesRole && matchesStatus;
  // });

  // const getRoleBadge = (role) => {
  //   switch (role) {
  //     case "admin":
  //       return (
  //         <Badge className="bg-destructive/10 text-destructive border-destructive/20">
  //           Admin
  //         </Badge>
  //       );
  //     case "premium":
  //       return (
  //         <Badge className="bg-primary/10 text-primary border-primary/20">
  //           Premium
  //         </Badge>
  //       );
  //     case "user":
  //       return <Badge variant="outline">User</Badge>;
  //     default:
  //       return <Badge variant="outline">{role}</Badge>;
  //   }
  // };

  // const getStatusBadge = (status) => {
  //   switch (status) {
  //     case "active":
  //       return (
  //         <Badge className="bg-success/10 text-success border-success/20">
  //           Active
  //         </Badge>
  //       );
  //     case "inactive":
  //       return <Badge variant="secondary">Inactive</Badge>;
  //     case "suspended":
  //       return <Badge variant="destructive">Suspended</Badge>;
  //     default:
  //       return <Badge variant="outline">{status}</Badge>;
  //   }
  // };

  const formatDate = (dateString) => {
    if(dateString === null){
      return "No Interview"
    }
    return new Date(dateString).toLocaleDateString();
  };

  // const formatLastActive = (dateString) => {
  //   const date = new Date(dateString);
  //   const now = new Date();
  //   const diffInHours = Math.floor(
  //     (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  //   );

  //   if (diffInHours < 1) return "Just now";
  //   if (diffInHours < 24) return `${diffInHours}h ago`;
  //   if (diffInHours < 48) return "Yesterday";
  //   return formatDate(dateString);
  // };

  const fetchTotalUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { totalUserList } = await dispatch(getUserList());
      console.log("Total User :", totalUserList);
      setTotalUsers(totalUserList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTotalUsers();
    }
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor user accounts
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            Users ({totalUsers.length})
          </CardTitle>
          <CardDescription>
            View and manage all registered users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Avg Score</TableHead>
                <TableHead>Total Interviews</TableHead>
                <TableHead>Last Interview</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {totalUsers.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`/api/placeholder/32/32`}
                          alt={user.full_name}
                        />
                        <AvatarFallback>
                          {user.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.full_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>User</TableCell>
                  {/* <TableCell>{getRoleBadge(user.role)}</TableCell> */}
                  <TableCell>{Math.floor(user.average_score)}</TableCell>
                  <TableCell className="font-medium">
                    {user.total_interviews}
                  </TableCell>
                  <TableCell>{formatDate(user.last_interview)}</TableCell>
                  <TableCell>{formatDate(user.registration_date)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Suspend User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
