import React, { useState } from "react";
import { Run, Card, Relic, CardChoice } from "../types";
import runService from "../services/runService";
import { useQuery } from "@tanstack/react-query";

const RunList: React.FC = () => {
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

  const {
    data: runs,
    isLoading: isLoadingRuns,
    error: runsError,
  } = useQuery({
    queryKey: ["runs"],
    queryFn: runService.getRuns,
  });

  const {
    data: selectedRun,
    isLoading: isLoadingRun,
    error: runError,
  } = useQuery({
    queryKey: ["run", selectedRunId],
    queryFn: () => (selectedRunId ? runService.getRun(selectedRunId) : null),
    enabled: !!selectedRunId,
  });

  const handleRunClick = (run: Run) => {
    setSelectedRunId(run.id);
  };

  if (isLoadingRuns) {
    return <div>Loading...</div>;
  }

  if (runsError) {
    return (
      <div>
        Error:{" "}
        {runsError instanceof Error ? runsError.message : "An error occurred"}
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="w-1/3 p-4">
        <h2 className="text-xl font-bold mb-4">Runs</h2>
        <div className="space-y-2">
          {runs?.map((run: Run) => (
            <div
              key={run.id}
              className={`p-4 border rounded cursor-pointer hover:bg-gray-100 ${
                selectedRunId === run.id ? "bg-blue-100" : ""
              }`}
              onClick={() => handleRunClick(run)}
            >
              <div className="font-semibold">
                {run.characterChosen} - Floor {run.floorReached}
              </div>
              <div className="text-sm text-gray-600">
                {new Date(run.timestamp).toLocaleString()}
              </div>
              <div className="text-sm">
                {run.isVictory ? "Victory" : "Defeat"}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-2/3 p-4">
        {isLoadingRun ? (
          <div>Loading run details...</div>
        ) : runError ? (
          <div>
            Error loading run details:{" "}
            {runError instanceof Error ? runError.message : "An error occurred"}
          </div>
        ) : selectedRun ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Run Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Master Deck</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRun.masterDeck.map((card: Card) => (
                    <span
                      key={card.id}
                      className="bg-gray-200 px-2 py-1 rounded"
                    >
                      {card.name}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Relics</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRun.relics.map((relic: Relic) => (
                    <span
                      key={relic.id}
                      className="bg-gray-200 px-2 py-1 rounded"
                    >
                      {relic.name}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Card Choices</h3>
                <div className="space-y-2">
                  {selectedRun.cardChoices.map(
                    (choice: CardChoice, index: number) => (
                      <div key={index} className="border p-2 rounded">
                        <div>Floor {choice.floor}</div>
                        <div className="text-green-600">
                          Picked: {choice.picked.name}
                        </div>
                        <div className="text-red-600">
                          Not Picked:{" "}
                          {choice.notPicked
                            .map((card: Card) => card.name)
                            .join(", ")}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">Select a run to view details</div>
        )}
      </div>
    </div>
  );
};

export default RunList;
