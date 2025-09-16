import { StatsCard } from "@/components/admin/dashboard/StatsCard";
import TokenUsageTable from "@/components/admin/tokens/TokenUsageTable";
import React from "react";
import {
  Users,
  MessageSquare,
  Activity,
  Zap,
  TrendingUp,
  UserCheck,
  Clock,
  BarChart3,
} from "lucide-react";

const TokenUsage = () => {
  const dashboardStats = {
    totalRecords: 1247,
    totalTokens: 89654,
    totalAudioMinutes: 2347.5,
    avgTokensPerInterview: 71.9,
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Token Usage Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor AI token consumption and interview metrics
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Records"
          value={dashboardStats.totalRecords}
          change="+12% from last month"
          changeType="positive"
          icon={BarChart3}
          className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
        />

        <StatsCard
          title="Total Tokens"
          value={dashboardStats.totalTokens}
          change="+8.2% from last month"
          changeType="positive"
          icon={Zap}
          className="bg-gradient-to-br from-chart-2/5 to-chart-2/10 border-chart-2/20"
        />

        <StatsCard
          title="Total Audio Minutes"
          value={Math.floor(dashboardStats.totalAudioMinutes)}
          change="+15.3% from last month"
          changeType="positive"
          icon={Clock}
          className="bg-gradient-to-br from-chart-3/5 to-chart-3/10 border-chart-3/20"
        />

        <StatsCard
          title="Avg. Tokens Per Interview"
          value={dashboardStats.avgTokensPerInterview}
          change="2.1% from last month"
          changeType="positive"
          icon={Activity}
          className="bg-gradient-to-br from-success/5 to-success/10 border-success/20"
        />
      </div>

      <TokenUsageTable />
    </div>
  );
};

export default TokenUsage;
