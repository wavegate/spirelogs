import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import relicService from "../services/relicService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Slider } from "./ui/slider";

type SortField = "name" | "score" | "runCount";
type SortDirection = "asc" | "desc";

export default function RelicStatsTable() {
  const [sortField, setSortField] = useState<SortField>("score");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [minRunCount, setMinRunCount] = useState(0);

  const { data: relics, isLoading } = useQuery({
    queryKey: ["relics-with-scores"],
    queryFn: relicService.getRelicsWithScores,
  });

  const maxRunCount = useMemo(() => {
    if (!relics) return 0;
    return Math.max(...relics.map((relic) => relic.runCount));
  }, [relics]);

  const sortedRelics = useMemo(() => {
    if (!relics) return [];

    const filteredRelics = relics.filter(
      (relic) => relic.runCount >= minRunCount
    );

    return [...filteredRelics].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "score":
          comparison =
            (a.averageScore ?? -Infinity) - (b.averageScore ?? -Infinity);
          break;
        case "runCount":
          comparison = a.runCount - b.runCount;
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [relics, sortField, sortDirection, minRunCount]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium">Minimum Run Count</label>
            <span className="text-sm text-muted-foreground">{minRunCount}</span>
          </div>
          <Slider
            value={[minRunCount]}
            onValueChange={([value]) => setMinRunCount(value)}
            max={maxRunCount}
            step={1}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Name{" "}
              {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("score")}
            >
              Average Score{" "}
              {sortField === "score" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("runCount")}
            >
              Run Count{" "}
              {sortField === "runCount" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRelics.map((relic) => (
            <TableRow key={relic.id}>
              <TableCell>{relic.name}</TableCell>
              <TableCell>{relic.averageScore?.toFixed(2) ?? "N/A"}</TableCell>
              <TableCell>{relic.runCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
