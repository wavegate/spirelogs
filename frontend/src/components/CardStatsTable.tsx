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
import CardCharacterAssigner from "./CardCharacterAssigner";

interface CardWithScores {
  id: string;
  name: string;
  character: string | null;
  averageScore: number | null;
  winRate: number | null;
  runCount: number;
  versions: {
    name: string;
    character: string | null;
    runCount: number;
    averageScore: number | null;
    winRate: number | null;
  }[];
}

type SortColumn = "name" | "score" | "runCount" | "character" | "winRate";
type SortDirection = "asc" | "desc";

interface SortCriteria {
  column: SortColumn;
  direction: SortDirection;
}

const CardStatsTable: React.FC = () => {
  const [sortCriteria, setSortCriteria] = useState<SortCriteria[]>([
    { column: "score", direction: "desc" },
  ]);
  const [minRunCount, setMinRunCount] = useState(0);

  const {
    data: cards,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cardsWithScores"],
    queryFn: cardService.getCardsWithScores,
  });

  const handleSort = (column: SortColumn) => {
    setSortCriteria((current) => {
      const existingIndex = current.findIndex(
        (criteria) => criteria.column === column
      );

      if (existingIndex === -1) {
        // Column not in sort criteria, add it as primary sort
        return [{ column, direction: "asc" }, ...current];
      }

      const newCriteria = [...current];
      const existingCriteria = newCriteria[existingIndex];

      if (existingCriteria.direction === "asc") {
        // Change direction to desc
        newCriteria[existingIndex] = { ...existingCriteria, direction: "desc" };
      } else {
        // Remove from sort criteria
        newCriteria.splice(existingIndex, 1);
      }

      return newCriteria;
    });
  };

  const filteredAndSortedCards = useMemo(() => {
    if (!cards) return [];

    const filtered = cards.filter((card) => card.runCount >= minRunCount);

    return [...filtered].sort((a, b) => {
      for (const criteria of sortCriteria) {
        let comparison = 0;

        switch (criteria.column) {
          case "name":
            comparison = a.name.localeCompare(b.name);
            break;
          case "character":
            const aChar = a.character || "Unknown";
            const bChar = b.character || "Unknown";
            comparison = aChar.localeCompare(bChar);
            break;
          case "score":
            comparison = (a.averageScore || 0) - (b.averageScore || 0);
            break;
          case "winRate":
            comparison = (a.winRate || 0) - (b.winRate || 0);
            break;
          case "runCount":
            comparison = a.runCount - b.runCount;
            break;
        }

        if (comparison !== 0) {
          return criteria.direction === "asc" ? comparison : -comparison;
        }
      }

      return 0;
    });
  }, [cards, sortCriteria, minRunCount]);

  const maxRunCount = useMemo(() => {
    if (!cards) return 0;
    return Math.max(...cards.map((card) => card.runCount));
  }, [cards]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading card statistics</div>;

  return (
    <div className="space-y-4">
      {/* <CardCharacterAssigner /> */}

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
              onClick={() => handleSort("name")}
            >
              Card Name{" "}
              {sortCriteria.map(
                (criteria, index) =>
                  criteria.column === "name" && (
                    <span key={index} className="text-xs">
                      {criteria.direction === "asc" ? "↑" : "↓"}
                      {index > 0 && index + 1}
                    </span>
                  )
              )}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("character")}
            >
              Character{" "}
              {sortCriteria.map(
                (criteria, index) =>
                  criteria.column === "character" && (
                    <span key={index} className="text-xs">
                      {criteria.direction === "asc" ? "↑" : "↓"}
                      {index > 0 && index + 1}
                    </span>
                  )
              )}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("score")}
            >
              Average Score{" "}
              {sortCriteria.map(
                (criteria, index) =>
                  criteria.column === "score" && (
                    <span key={index} className="text-xs">
                      {criteria.direction === "asc" ? "↑" : "↓"}
                      {index > 0 && index + 1}
                    </span>
                  )
              )}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("winRate")}
            >
              Win Rate{" "}
              {sortCriteria.map(
                (criteria, index) =>
                  criteria.column === "winRate" && (
                    <span key={index} className="text-xs">
                      {criteria.direction === "asc" ? "↑" : "↓"}
                      {index > 0 && index + 1}
                    </span>
                  )
              )}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("runCount")}
            >
              Run Count{" "}
              {sortCriteria.map(
                (criteria, index) =>
                  criteria.column === "runCount" && (
                    <span key={index} className="text-xs">
                      {criteria.direction === "asc" ? "↑" : "↓"}
                      {index > 0 && index + 1}
                    </span>
                  )
              )}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedCards.map((card) => (
            <TableRow key={card.id}>
              <TableCell>{card.name}</TableCell>
              <TableCell>{card.character || "Unknown"}</TableCell>
              <TableCell>
                {card.averageScore !== null
                  ? card.averageScore.toFixed(2)
                  : "N/A"}
              </TableCell>
              <TableCell>
                {card.winRate !== null ? `${card.winRate.toFixed(1)}%` : "N/A"}
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
