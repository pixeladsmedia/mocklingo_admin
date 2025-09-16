import {
  Users,
  MessageSquare,
  Activity,
  Zap,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { StatsCard } from "@/components/admin/dashboard/StatsCard";
import { UserChart } from "@/components/admin/dashboard/UserChart";
import { FeedbackTable } from "@/components/admin/feedback/FeedbackTable";
import { TokenUsageChart } from "@/components/admin/tokens/TokenUsageChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getTotalUsers,
  getTotalActiveSession,
  getTotalTokenUsage,
  getTotalFeedback,
  getUserList,
} from "../api/adminApi";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const realtimeStats = {
  totalUsers: 15420,
  activeUsers: 2840,
  activeSessions: 156,
  totalFeedback: 1240,
  tokenUsage: 45680,
  newUsers: "+12% from last month",
  sessionsChange: "+8% from last hour",
  feedbackChange: "+5% from last week",
  tokenChange: "+23% from last month",
};

function timeAgo(isoString) {
  if (isoString == null) {
    return "no interview";
  }

  const now = new Date();
  const other = new Date(isoString); // works with the trailing “Z”

  const sec = Math.round((now - other) / 1_000); // Δ in seconds
  const min = Math.floor(sec / 60);
  const hrs = Math.floor(min / 60);
  const days = Math.floor(hrs / 24);
  const months = Math.floor(days / 30); // rough “calendar” month

  if (sec < 60) return "just now";
  if (min < 60) return `${min} min ago`;
  if (hrs < 24) return `${hrs} hours ago`;
  if (days < 30) return `${days} days ago`;

  return `${months} month${months === 1 ? " ago" : "s ago"}`;
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState(0);
  const [activeSessions, setActiveSessions] = useState(0);
  const [tokenUsage, setTokenUsage] = useState(0);
  const [feedbacks, setFeedbacks] = useState(0);
  const [totalUsers, setTotalUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTotalUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { totalUser } = await dispatch(getTotalUsers());
      const { totalActiveSessions } = await dispatch(getTotalActiveSession());
      const { totalTokenUsageCount } = await dispatch(getTotalTokenUsage());
      const { totalFeedbackCount } = await dispatch(getTotalFeedback());
      const { totalUserList } = await dispatch(getUserList());
      console.log("Total users :", totalUser);
      console.log("Total activesession :", totalActiveSessions);
      console.log("Total Tokens :", totalTokenUsageCount);
      console.log("Total Feedbacks :", totalFeedbackCount);
      console.log("Total User :", totalUserList);
      setUsers(totalUser);
      setActiveSessions(totalActiveSessions);
      setTokenUsage(totalTokenUsageCount);
      setFeedbacks(totalFeedbackCount);
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
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the MOCKLINGO Admin Panel
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            variant="outline"
            className="bg-success/10 text-success border-success/20"
          >
            <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
            System Online
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={users}
          change={realtimeStats.newUsers}
          changeType="positive"
          icon={Users}
          className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
        />
        <StatsCard
          title="Active Sessions"
          value={activeSessions}
          change={realtimeStats.sessionsChange}
          changeType="positive"
          icon={Activity}
          className="bg-gradient-to-br from-chart-2/5 to-chart-2/10 border-chart-2/20"
        />
        <StatsCard
          title="User Feedback"
          value={feedbacks}
          change={realtimeStats.feedbackChange}
          changeType="positive"
          icon={MessageSquare}
          className="bg-gradient-to-br from-chart-3/5 to-chart-3/10 border-chart-3/20"
        />
        <StatsCard
          title="Token Usage"
          value={`${(tokenUsage / 1000).toFixed(1)}K`}
          change={realtimeStats.tokenChange}
          changeType="positive"
          icon={Zap}
          className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <UserChart />
        <TokenUsageChart />
      </div>

      {/* Live Sessions Card */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Live Sessions
            </CardTitle>
            <CardDescription>
              Currently active interview sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">
                  {realtimeStats.activeSessions}
                </span>
                <Badge className="bg-success/10 text-success border-success/20">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Interview Practice
                  </span>
                  <span className="font-medium">124</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Communication Practice
                  </span>
                  <span className="font-medium">32</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Recent User Activity
            </CardTitle>
            <CardDescription>
              Latest user registrations and activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 h-[300px] overflow-scroll">
              {totalUsers.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {activity.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {activity.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total {activity.total_interviews} interview given
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {timeAgo(activity.last_interview)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Feedback Table */}
      <FeedbackTable />
    </div>
  );
}
