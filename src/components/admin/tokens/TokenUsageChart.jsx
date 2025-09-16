import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  LineChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDispatch, useSelector } from "react-redux";
import { getTokenUsageAndProcess } from "../../../api/adminApi";
import { useEffect, useState } from "react";

const chartConfig = {
  tokens: {
    label: "Tokens",
    color: "hsl(var(--chart-1))",
  },
  cost: {
    label: "Cost ($)",
    color: "hsl(var(--chart-2))",
  },
};

export function TokenUsageChart() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [dailyData, setDailyData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAndProcessData = async () => {
    setLoading(true);
    setError(null);

    try {
      const { dailyData, hourlyData, rawData } = await dispatch(
        getTokenUsageAndProcess()
      );

      setDailyData(dailyData);
      setHourlyData(hourlyData);

      console.log("Daily data:", dailyData);
      console.log("Hourly data:", hourlyData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAndProcessData();
    }
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Usage Analytics</CardTitle>
        <CardDescription>
          Monitor AI token consumption and costs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daily">Daily Usage</TabsTrigger>
            <TabsTrigger value="hourly">Hourly Pattern</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={dailyData}>
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="tokens"
                  fill="var(--color-tokens)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="hourly" className="space-y-4">
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={hourlyData}>
                <XAxis dataKey="hour" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="tokens"
                  stroke="var(--color-tokens)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
