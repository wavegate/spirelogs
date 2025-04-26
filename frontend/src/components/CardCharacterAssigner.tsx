import React, { useState } from "react";
import cardService from "@/services/cardService";
import { Button } from "./ui/button";

const CardCharacterAssigner: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    updatedCards: number;
    skippedCards: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAssignCharacters = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await cardService.assignCharactersToCards();
      setResult(response.stats);
    } catch (err) {
      setError("Failed to assign characters to cards");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Assign Characters to Cards</h2>
      <p className="text-sm text-gray-600 mb-4">
        This will assign characters to cards based on the runs they appear in.
        Cards that already have a character assigned will be skipped.
      </p>

      <Button
        onClick={handleAssignCharacters}
        disabled={isLoading}
        className="mb-4"
      >
        {isLoading ? "Processing..." : "Assign Characters"}
      </Button>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {result && (
        <div className="text-sm">
          <p>Updated {result.updatedCards} cards</p>
          <p>Skipped {result.skippedCards} cards</p>
        </div>
      )}
    </div>
  );
};

export default CardCharacterAssigner;
