import React, { useState } from "react";
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

type SortField = "name" | "averageScore" | "runCount";
type SortDirection = "asc" | "desc";

const CardStatsTable: React.FC = () => {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const {
    data: cards,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cards-with-scores"],
    queryFn: cardService.getCardsWithScores,
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedCards = React.useMemo(() => {
    if (!cards) return [];
    return [...cards].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "averageScore":
          comparison = (a.averageScore ?? 0) - (b.averageScore ?? 0);
          break;
        case "runCount":
          comparison = a.runCount - b.runCount;
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [cards, sortField, sortDirection]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading card statistics</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("name")}
                className="flex items-center gap-1"
              >
                Card Name
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("averageScore")}
                className="flex items-center gap-1"
              >
                Average Score
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("runCount")}
                className="flex items-center gap-1"
              >
                Run Count
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCards.map((card) => (
            <TableRow key={card.id}>
              <TableCell className="font-medium">{card.name}</TableCell>
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
