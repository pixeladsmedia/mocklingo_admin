import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
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
import { getUserTrends } from "../../../api/adminApi";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

const chartConfig = {
  users: {
    label: "Users",
    color: "hsl(var(--chart-1))",
  },
};

export function UserChart() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [userTrend, setUserTrend] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAndProcessUserTrend = async () => {
    setLoading(true);
    setError(null);

    try {
      const { totalUserTrend } = await dispatch(getUserTrends());

      console.log("User Trend data:", totalUserTrend);
      setUserTrend(totalUserTrend);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAndProcessUserTrend();
    }
  }, [token]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
        <CardDescription>Monthly active users over time</CardDescription>
      </CardHeader>
      <CardContent className="pt-10 px-4">
        <ChartContainer config={chartConfig} className="h-[300px]">
          <AreaChart data={userTrend}>
            <defs>
              <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-users)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-users)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="users"
              stroke="var(--color-users)"
              fillOpacity={1}
              fill="url(#fillUsers)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
