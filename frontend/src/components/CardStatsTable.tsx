import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import cardService from "@/services/cardService";
import { Slider } from "@/components/ui/slider";

const CardStatsTable: React.FC = () => {
  const [sortBy, setSortBy] = useState<"name" | "score" | "runCount">("score");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [minRunCount, setMinRunCount] = useState(0);

  const {
    data: cards,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cardsWithScores"],
    queryFn: cardService.getCardsWithScores,
  });

  const filteredAndSortedCards = useMemo(() => {
    if (!cards) return [];

    const filtered = cards.filter((card) => card.runCount >= minRunCount);

    return [...filtered].sort((a, b) => {
      if (sortBy === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortBy === "score") {
        return sortDirection === "asc"
          ? (a.averageScore || 0) - (b.averageScore || 0)
          : (b.averageScore || 0) - (a.averageScore || 0);
      }
      return sortDirection === "asc"
        ? a.runCount - b.runCount
        : b.runCount - a.runCount;
    });
  }, [cards, sortBy, sortDirection, minRunCount]);

  const maxRunCount = useMemo(() => {
    if (!cards) return 0;
    return Math.max(...cards.map((card) => card.runCount));
  }, [cards]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading card statistics</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-64">
          <label className="text-sm font-medium mb-2 block">
            Minimum Run Count: {minRunCount}
          </label>
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
              onClick={() => {
                if (sortBy === "name") {
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("name");
                  setSortDirection("asc");
                }
              }}
            >
              Card Name{" "}
              {sortBy === "name" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => {
                if (sortBy === "score") {
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("score");
                  setSortDirection("desc");
                }
              }}
            >
              Average Score{" "}
              {sortBy === "score" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => {
                if (sortBy === "runCount") {
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("runCount");
                  setSortDirection("desc");
                }
              }}
            >
              Run Count{" "}
              {sortBy === "runCount" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedCards.map((card) => (
            <TableRow key={card.id}>
              <TableCell>{card.name}</TableCell>
              <TableCell>
                {card.averageScore !== null
                  ? card.averageScore.toFixed(2)
                  : "N/A"}
              </TableCell>
              <TableCell>{card.runCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CardStatsTable;
