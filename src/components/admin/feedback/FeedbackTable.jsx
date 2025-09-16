import { Eye, MessageSquare, Star, Filter } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getstarFeedback } from "../../../api/adminApi";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

const feedbackData = [
  {
    id: "FB001",
    userId: "U001",
    userName: "John Doe",
    type: "interview",
    rating: 5,
    subject: "Great AI interview experience",
    date: "2024-01-15",
    status: "new",
  },
  {
    id: "FB002",
    userId: "U002",
    userName: "Jane Smith",
    type: "communication",
    rating: 4,
    subject: "Communication practice was helpful",
    date: "2024-01-14",
    status: "reviewed",
  },
  {
    id: "FB003",
    userId: "U003",
    userName: "Mike Johnson",
    type: "platform",
    rating: 3,
    subject: "UI could be improved",
    date: "2024-01-13",
    status: "responded",
  },
  {
    id: "FB004",
    userId: "U004",
    userName: "Sarah Wilson",
    type: "interview",
    rating: 5,
    subject: "Excellent resume-based questions",
    date: "2024-01-12",
    status: "new",
  },
];

export function FeedbackTable() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [userFeedbackStars, setUserFeedbackStars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAndProcessUserTrend = async () => {
    setLoading(true);
    setError(null);

    try {
      const { totalStarFeedback } = await dispatch(getstarFeedback());

      console.log("User Feedback stars:", totalStarFeedback);
      setUserFeedbackStars(totalStarFeedback);
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

  const filteredFeedback = userFeedbackStars.filter((feedback) => {
    if (statusFilter !== "all" && feedback.status !== statusFilter)
      return false;
    if (typeFilter !== "all" && feedback.mode !== typeFilter) return false;
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "new":
        return <Badge variant="default">New</Badge>;
      case "reviewed":
        return <Badge variant="secondary">Reviewed</Badge>;
      case "responded":
        return (
          <Badge className="bg-success text-success-foreground">
            Responded
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case "interview":
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary">
            Interview
          </Badge>
        );
      case "english_practice":
        return (
          <Badge variant="outline" className="bg-chart-2/10 text-chart-2">
            English Practice
          </Badge>
        );
      case "talkwithai":
        return (
          <Badge variant="outline" className="bg-chart-3/10 text-chart-3">
            TalkWithAi
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

   const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              User Feedback
            </CardTitle>
            <CardDescription>
              Monitor and respond to user feedback
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="responded">Responded</SelectItem>
              </SelectContent>
            </Select> */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="english_practice">English Practice</SelectItem>
                <SelectItem value="talkwithai">TalkWithAi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={"h-[400px] overflow-scroll"}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feedback ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Interview ID</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFeedback.map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell className="font-medium">FB{feedback.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {feedback?.user?.full_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        UU{feedback.user_id}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(feedback.mode)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {renderStars(feedback.rating)}
                      <span className="ml-2 text-sm font-medium">
                        {feedback.rating}/5
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(feedback.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{feedback.interview_id}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
