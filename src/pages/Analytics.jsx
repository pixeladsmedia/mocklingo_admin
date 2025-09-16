import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Zap,
  MessageSquare,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TokenUsageChart } from "@/components/admin/tokens/TokenUsageChart";
import { UserChart } from "@/components/admin/dashboard/UserChart";
import { StatsCard } from "@/components/admin/dashboard/StatsCard";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getInterviewTrend } from "../api/adminApi";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const feedbackTrendsData = [
  { month: "Aug", positive: 85, neutral: 12, negative: 3 },
  { month: "Sep", positive: 88, neutral: 10, negative: 2 },
  { month: "Oct", positive: 92, neutral: 6, negative: 2 },
  { month: "Nov", positive: 89, neutral: 8, negative: 3 },
  { month: "Dec", positive: 94, neutral: 5, negative: 1 },
  { month: "Jan", positive: 96, neutral: 3, negative: 1 },
];

const peakHoursData = [
  { hour: "6AM", sessions: 12 },
  { hour: "9AM", sessions: 45 },
  { hour: "12PM", sessions: 78 },
  { hour: "3PM", sessions: 92 },
  { hour: "6PM", sessions: 126 },
  { hour: "9PM", sessions: 89 },
  { hour: "12AM", sessions: 34 },
];

const chartConfig = {
  sessions: { color: "var(--chart-1)" },
  positive: { color: "var(--chart-4)" },
  neutral: { color: "var(--chart-2)" },
  negative: { color: "var(--chart-5)" },
};

function calculateFlooredPercentages(data) {
  if (!Array.isArray(data)) {
    throw new Error("Input must be an array of objects");
  }

  const counts = data.reduce((acc, item) => {
    if (
      typeof item !== "object" ||
      !item.type ||
      typeof item.count !== "number"
    ) {
      throw new Error(
        'Each item must have "type" (string) and "count" (number)'
      );
    }
    acc[item.type] = item.count;
    return acc;
  }, {});

  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);

  if (total === 0) {
    return Object.keys(counts).map((key) => ({ type: key, percentage: 0 }));
  }

  const rawPercentages = {};
  Object.keys(counts).forEach((key) => {
    rawPercentages[key] = (counts[key] / total) * 100;
  });

  const floorPercentages = {};
  Object.keys(rawPercentages).forEach((key) => {
    floorPercentages[key] = Math.floor(rawPercentages[key]);
  });

  const sumFloored = Object.values(floorPercentages).reduce(
    (sum, value) => sum + value,
    0
  );
  let remainder = 100 - sumFloored;

  const fractionalParts = {};
  Object.keys(rawPercentages).forEach((key) => {
    fractionalParts[key] = rawPercentages[key] - floorPercentages[key];
  });
  const sortedKeys = Object.keys(fractionalParts).sort(
    (a, b) => fractionalParts[b] - fractionalParts[a]
  );

  for (let i = 0; i < remainder; i++) {
    floorPercentages[sortedKeys[i]] += 1;
  }

  // Convert to array of objects
  return Object.keys(floorPercentages).map((key, idx) => ({
    name: key,
    value: floorPercentages[key],
    color: `var(--chart-${idx+1})`,
  }));
}

export default function Analytics() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [totalFeedbacks, setTotalFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchTotalUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { totalInterviewData } = await dispatch(getInterviewTrend());
      setTotalFeedbacks(calculateFlooredPercentages(totalInterviewData));
      console.log("Total Interviews :", totalInterviewData);
      console.log(
        "Total Interviews :",
        calculateFlooredPercentages(totalInterviewData)
      );
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
          <h1 className="text-3xl font-bold tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Comprehensive insights into platform performance
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Avg Session Duration"
          value="24:30"
          change="+2:15 from last week"
          changeType="positive"
          icon={Clock}
          className="bg-gradient-to-br from-chart-1/5 to-chart-1/10 border-chart-1/20"
        />
        <StatsCard
          title="User Satisfaction"
          value="96%"
          change="+2% from last month"
          changeType="positive"
          icon={TrendingUp}
          className="bg-gradient-to-br from-success/5 to-success/10 border-success/20"
        />
        <StatsCard
          title="Daily Active Users"
          value="2,840"
          change="+180 from yesterday"
          changeType="positive"
          icon={Users}
          className="bg-gradient-to-br from-chart-2/5 to-chart-2/10 border-chart-2/20"
        />
        <StatsCard
          title="Completion Rate"
          value="87%"
          change="+5% from last week"
          changeType="positive"
          icon={BarChart3}
          className="bg-gradient-to-br from-chart-3/5 to-chart-3/10 border-chart-3/20"
        />
      </div>

      <Tabs defaultValue="usage" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Trends</TabsTrigger>
          <TabsTrigger value="tokens">Token Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <UserChart />

            <Card>
              <CardHeader>
                <CardTitle>Session Types Distribution</CardTitle>
                <CardDescription>
                  Breakdown of session types used by users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px]">
                  <PieChart>
                    <Pie
                      data={totalFeedbacks}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {totalFeedbacks.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
                <div className="mt-4 space-y-2">
                  {totalFeedbacks.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Peak Usage Hours</CardTitle>
              <CardDescription>
                Session activity throughout the day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart data={peakHoursData}>
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="sessions"
                    fill="var(--color-sessions)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Sentiment Trends</CardTitle>
              <CardDescription>
                User feedback sentiment over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <LineChart data={feedbackTrendsData}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="positive"
                    stroke="hsl(var(--chart-4))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="neutral"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="negative"
                    stroke="hsl(var(--chart-5))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <StatsCard
              title="Total Tokens Used"
              value="2.4M"
              change="+23% from last month"
              changeType="positive"
              icon={Zap}
            />
            <StatsCard
              title="Cost per Session"
              value="$0.18"
              change="-$0.02 from last month"
              changeType="positive"
              icon={TrendingUp}
            />
            <StatsCard
              title="Efficiency Score"
              value="94%"
              change="+3% improvement"
              changeType="positive"
              icon={BarChart3}
            />
          </div>
          <TokenUsageChart />
        </TabsContent>
      </Tabs>
    </div>
  );
}
