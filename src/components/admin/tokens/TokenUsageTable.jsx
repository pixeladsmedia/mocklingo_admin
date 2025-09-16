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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTokenUsageData } from "../../../api/adminApi";
import { useDispatch, useSelector } from "react-redux";

const TokenUsageTable = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [tokenUsageData, setTokenUsageData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const fetchAndProcessData = async (pageNumber) => {
    setLoading(true);
    setError(null);
    try {
      const { totalTokenUsageData } = await dispatch(
        getTokenUsageData(pageNumber)
      );

      if (pageNumber === 1) {
        setTokenUsageData(totalTokenUsageData);
      } else {
        setTokenUsageData((prevData) => [...prevData, ...totalTokenUsageData]);
      }

      console.log("Data for page", pageNumber, ":", totalTokenUsageData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200 &&
      !loading
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAndProcessData(1);
    }
  }, [token]);

  useEffect(() => {
    if (page > 1) {
      fetchAndProcessData(page);
    }
  }, [page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  const filteredData = tokenUsageData.filter(
    (item) =>
      item.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user_id.toString().includes(searchTerm)
  );

  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Token Usage Details</CardTitle>
        <CardDescription>
          Detailed breakdown of token consumption per interview session
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search and Filter Controls */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter by User ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Apply
          </Button>
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

        {/* Usage Table */}
        <div className="rounded-md border max-h-[800px] overflow-scroll">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12">ID</TableHead>
                <TableHead>USER</TableHead>
                <TableHead className="text-center">INTERVIEW</TableHead>
                <TableHead className="text-center">TOTAL TOKENS</TableHead>
                <TableHead className="text-center">AUDIO</TableHead>
                <TableHead>CREATED</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item?.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium text-muted-foreground">
                    {item?.user_id}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item?.user_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {item?.user_email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {item.interview_id}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-medium">
                      {item.grand_total_tokens.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      In: {item.total_input_tokens} / Out:{" "}
                      {item.total_output_tokens}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {item.total_audio_minutes}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div>Loading more data...</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TokenUsageTable;
