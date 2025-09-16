import { api } from "./api";

// Add this function to your authApi.js file

const convertToDailyData = (rawData) => {
  // Token pricing (adjust as needed)
  const INPUT_TOKEN_COST_PER_1M = 15.0; // $15 per 1M input tokens
  const OUTPUT_TOKEN_COST_PER_1M = 60.0; // $60 per 1M output tokens

  const now = new Date();
  const dailyAggregates = {};

  // Initialize past 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    dailyAggregates[dateStr] = { tokens: 0, cost: 0.0 };
  }

  // Process each record
  rawData.forEach((record) => {
    if (!record.created_at) return;

    try {
      const createdAt = new Date(record.created_at);
      const daysAgo = Math.floor((now - createdAt) / (24 * 60 * 60 * 1000));

      if (daysAgo < 7) {
        const dateStr = createdAt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        const inputTokens = record.total_input_tokens || 0;
        const outputTokens = record.total_output_tokens || 0;
        const totalTokens = inputTokens + outputTokens;

        const inputCost = (inputTokens / 1_000_000) * INPUT_TOKEN_COST_PER_1M;
        const outputCost =
          (outputTokens / 1_000_000) * OUTPUT_TOKEN_COST_PER_1M;
        const totalCost = inputCost + outputCost;

        if (dailyAggregates[dateStr]) {
          dailyAggregates[dateStr].tokens += totalTokens;
          dailyAggregates[dateStr].cost += totalCost;
        }
      }
    } catch (error) {
      console.error("Error processing record:", error);
    }
  });

  // Convert to array format (oldest first)
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    result.push({
      date: dateStr,
      tokens: dailyAggregates[dateStr]?.tokens || 0,
      cost: Math.round((dailyAggregates[dateStr]?.cost || 0) * 10) / 10,
    });
  }

  return result.reverse();
};

const convertToHourlyData = (rawData) => {
  const now = new Date();
  const hourlyAggregates = {};

  // Initialize past 7 hours
  for (let i = 0; i < 7; i++) {
    const hour = new Date(now - i * 60 * 60 * 1000);
    const hourStr = hour.getHours().toString().padStart(2, "0") + ":00";
    hourlyAggregates[hourStr] = 0;
  }

  // Process each record
  rawData.forEach((record) => {
    if (!record.created_at) return;

    try {
      const createdAt = new Date(record.created_at);
      const hoursAgo = (now - createdAt) / (60 * 60 * 1000);

      if (hoursAgo < 7) {
        const hourStr =
          createdAt.getHours().toString().padStart(2, "0") + ":00";

        const inputTokens = record.total_input_tokens || 0;
        const outputTokens = record.total_output_tokens || 0;
        const totalTokens = inputTokens + outputTokens;

        if (hourlyAggregates[hourStr] !== undefined) {
          hourlyAggregates[hourStr] += totalTokens;
        }
      }
    } catch (error) {
      console.error("Error processing record:", error);
    }
  });

  // Convert to array format (oldest first)
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const hour = new Date(now - i * 60 * 60 * 1000);
    const hourStr = hour.getHours().toString().padStart(2, "0") + ":00";
    result.push({
      hour: hourStr,
      tokens: hourlyAggregates[hourStr] || 0,
    });
  }

  return result.reverse();
};

export const getTokenUsageAndProcess = () => async (dispatch, getState) => {
  // Get token from Redux state
  const { auth } = getState();
  const token = auth.token;

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await api.get("/admin/token-usage/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const rawData = response.data.usage_records;

    // Process the data and return both daily and hourly formats
    const dailyData = convertToDailyData(rawData);
    const hourlyData = convertToHourlyData(rawData);

    return {
      rawData,
      dailyData,
      hourlyData,
    };
  } catch (error) {
    let errorMessage = "Failed to fetch token usage data";

    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.response?.status === 401) {
      errorMessage = "Unauthorized - please login again";
    } else if (error.response?.status === 403) {
      errorMessage = "Access forbidden - admin rights required";
    }

    throw new Error(errorMessage);
  }
};

export const getTotalUsers = () => async (dispatch, getState) => {
  const { auth } = getState();
  const token = auth.token;
  if (!token) {
    throw new Error("No authentication token found");
  }
  try {
    const response = await api.get("/admin/dashboard/total-users", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const totalUser = response.data.total_users;

    return {
      totalUser,
    };
  } catch (error) {
    let errorMessage = "Failed to fetch token usage data";

    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.response?.status === 401) {
      errorMessage = "Unauthorized - please login again";
    } else if (error.response?.status === 403) {
      errorMessage = "Access forbidden - admin rights required";
    }

    throw new Error(errorMessage);
  }
};

export const getTotalActiveSession = () => async (dispatch, getState) => {
  const { auth } = getState();
  const token = auth.token;
  if (!token) {
    throw new Error("No authentication token found");
  }
  try {
    const response = await api.get("/admin/interviews/active-sessions", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const totalActiveSessions = response.data;

    return {
      totalActiveSessions,
    };
  } catch (error) {
    let errorMessage = "Failed to fetch token usage data";

    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.response?.status === 401) {
      errorMessage = "Unauthorized - please login again";
    } else if (error.response?.status === 403) {
      errorMessage = "Access forbidden - admin rights required";
    }

    throw new Error(errorMessage);
  }
};

export const getTotalTokenUsage = () => async (dispatch, getState) => {
  const { auth } = getState();
  const token = auth.token;
  if (!token) {
    throw new Error("No authentication token found");
  }
  try {
    const response = await api.get("/admin/token-usage/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const totalTokenUsageCount = response.data.total_tokens;
    return {
      totalTokenUsageCount,
    };
  } catch (error) {
    let errorMessage = "Failed to fetch token usage data";

    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.response?.status === 401) {
      errorMessage = "Unauthorized - please login again";
    } else if (error.response?.status === 403) {
      errorMessage = "Access forbidden - admin rights required";
    }
    throw new Error(errorMessage);
  }
};

export const getTotalFeedback = () => async (dispatch, getState) => {
  const { auth } = getState();
  const token = auth.token;
  if (!token) {
    throw new Error("No authentication token found");
  }
  try {
    const response = await api.get("/admin/feedback/feedbacks/total", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const totalFeedbackCount = response.data.total_feedbacks;
    return {
      totalFeedbackCount,
    };
  } catch (error) {
    let errorMessage = "Failed to fetch token usage data";

    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.response?.status === 401) {
      errorMessage = "Unauthorized - please login again";
    } else if (error.response?.status === 403) {
      errorMessage = "Access forbidden - admin rights required";
    }
    throw new Error(errorMessage);
  }
};

function convertDailyToWeeklyReliable(dailyData) {
  if (!dailyData || dailyData.length === 0) {
    return [];
  }

  // Sort by date string
  const sortedData = [...dailyData].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  // Get first date as string and convert to number for easier math
  const firstDateStr = sortedData[0].date;
  const firstDate = new Date(firstDateStr);

  const weeklyData = {};

  sortedData.forEach((item) => {
    const currentDate = new Date(item.date);

    // Calculate difference in days
    const diffTime = currentDate.getTime() - firstDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Determine week number (starting from 1)
    const weekNum = Math.floor(diffDays / 7) + 1;
    const weekKey = `week${weekNum}`;

    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = { name: weekKey, users: 0 };
    }

    weeklyData[weekKey].users += item.count;
  });

  // Sort weeks numerically
  return Object.values(weeklyData).sort((a, b) => {
    const aNum = parseInt(a.name.replace("week", ""));
    const bNum = parseInt(b.name.replace("week", ""));
    return aNum - bNum;
  });
}

export const getUserTrends = () => async (dispatch, getState) => {
  const { auth } = getState();
  const token = auth.token;
  if (!token) {
    throw new Error("No authentication token found");
  }
  try {
    const response = await api.get("/admin/dashboard/trends?days=30", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const totalUserTrend = convertDailyToWeeklyReliable(response.data.trends);

    return {
      totalUserTrend,
    };
  } catch (error) {
    let errorMessage = "Failed to fetch token usage data";

    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.response?.status === 401) {
      errorMessage = "Unauthorized - please login again";
    } else if (error.response?.status === 403) {
      errorMessage = "Access forbidden - admin rights required";
    }
    throw new Error(errorMessage);
  }
};

export const getUserList = () => async (dispatch, getState) => {
  const { auth } = getState();
  const token = auth.token;
  if (!token) {
    throw new Error("No authentication token found");
  }
  try {
    const response = await api.get(`/admin/dashboard/user-list`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const totalUserList = response.data.users;

    return {
      totalUserList,
    };
  } catch (error) {
    let errorMessage = "Failed to fetch token usage data";

    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.response?.status === 401) {
      errorMessage = "Unauthorized - please login again";
    } else if (error.response?.status === 403) {
      errorMessage = "Access forbidden - admin rights required";
    }
    throw new Error(errorMessage);
  }
};

export const getstarFeedback = () => async (dispatch, getState) => {
  const { auth } = getState();
  const token = auth.token;
  if (!token) {
    throw new Error("No authentication token found");
  }
  try {
    const response = await api.get(`/admin/feedback/feedbacks/interview`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const totalStarFeedback = response.data.feedbacks;

    return {
      totalStarFeedback,
    };
  } catch (error) {
    let errorMessage = "Failed to fetch token usage data";

    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.response?.status === 401) {
      errorMessage = "Unauthorized - please login again";
    } else if (error.response?.status === 403) {
      errorMessage = "Access forbidden - admin rights required";
    }
    throw new Error(errorMessage);
  }
};

export const getInterviewTrend = () => async (dispatch, getState) => {
  const { auth } = getState();
  const token = auth.token;
  if (!token) {
    throw new Error("No authentication token found");
  }
  try {
    const response = await api.get(`/admin/interviews/service-trends`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // const totalStarFeedback = response.data.usages;
    const totalInterviewData = response.data.usages;

    return {
      totalInterviewData,
    };
  } catch (error) {
    let errorMessage = "Failed to fetch token usage data";

    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.response?.status === 401) {
      errorMessage = "Unauthorized - please login again";
    } else if (error.response?.status === 403) {
      errorMessage = "Access forbidden - admin rights required";
    }
    throw new Error(errorMessage);
  }
};
