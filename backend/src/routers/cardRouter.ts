import prisma from "@/common/prisma.js";
import express, { Request, Response } from "express";

const router = express.Router();

// Get all cards with average run scores
router.get("/with-scores", async (req: Request, res: Response) => {
  try {
    const cards = await prisma.card.findMany({
      include: {
        inMasterDeck: {
          select: {
            score: true,
            isVictory: true,
          },
        },
      },
    });

    // Group cards by their base name (without +X suffix)
    const cardGroups = new Map<string, typeof cards>();
    cards.forEach((card) => {
      const baseName = card.name.replace(/\s*\+\d+$/, "");
      if (!cardGroups.has(baseName)) {
        cardGroups.set(baseName, []);
      }
      cardGroups.get(baseName)!.push(card);
    });

    // Combine statistics for each group
    const cardsWithScores = Array.from(cardGroups.entries()).map(
      ([baseName, cardGroup]) => {
        // Combine all inMasterDeck entries
        const allRuns = cardGroup
          .flatMap((card) =>
            card.inMasterDeck.map((run) => ({
              score: run.score,
              isVictory: run.isVictory,
            }))
          )
          .filter(
            (run): run is { score: number; isVictory: boolean } =>
              run.score !== null && run.isVictory !== null
          );

        const averageScore =
          allRuns.length > 0
            ? allRuns.reduce((a, b) => a + b.score, 0) / allRuns.length
            : null;

        const winRate =
          allRuns.length > 0
            ? (allRuns.filter((run) => run.isVictory).length / allRuns.length) *
              100
            : null;

        return {
          id: cardGroup[0].id,
          name: baseName,
          character: cardGroup[0].character,
          averageScore,
          winRate,
          runCount: allRuns.length,
          versions: cardGroup.map((card) => {
            const cardRuns = card.inMasterDeck
              .filter((run) => run.score !== null && run.isVictory !== null)
              .map((run) => ({
                score: run.score!,
                isVictory: run.isVictory!,
              }));

            const cardWinRate =
              cardRuns.length > 0
                ? (cardRuns.filter((run) => run.isVictory).length /
                    cardRuns.length) *
                  100
                : null;

            return {
              name: card.name,
              character: card.character,
              runCount: cardRuns.length,
              averageScore:
                cardRuns.length > 0
                  ? cardRuns.reduce((a, b) => a + b.score, 0) / cardRuns.length
                  : null,
              winRate: cardWinRate,
            };
          }),
        };
      }
    );

    res.json(cardsWithScores);
  } catch (error) {
    console.error("Error fetching cards with scores:", error);
    res.status(500).json({ error: "Failed to fetch cards with scores" });
  }
});

// Create a new card
router.post("/", async (req: Request, res: Response) => {
  try {
    const { imageLink, name, description } = req.body;
    const card = await prisma.card.create({
      data: {
        imageLink,
        name,
        description,
      },
    });
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: "Failed to create card" });
  }
});

// Get all cards
router.get("/", async (req: Request, res: Response) => {
  try {
    const cards = await prisma.card.findMany();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cards" });
  }
});

// Get a single card by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const card = await prisma.card.findUnique({
      where: { id },
    });
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch card" });
  }
});

// Update a card
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { imageLink, name, description } = req.body;
    const card = await prisma.card.update({
      where: { id: parseInt(id) },
      data: {
        imageLink,
        name,
        description,
      },
    });
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: "Failed to update card" });
  }
});

// Delete a card
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.card.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Card deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete card" });
  }
});

// Assign characters to cards based on runs
router.post("/assign-characters", async (req: Request, res: Response) => {
  try {
    // Get all runs with their master deck and character
    const runs = await prisma.run.findMany({
      where: {
        characterChosen: {
          not: null,
        },
      },
      select: {
        id: true,
        characterChosen: true,
        masterDeck: {
          select: {
            name: true,
            id: true,
            character: true,
          },
        },
      },
    });

    let updatedCount = 0;
    let skippedCount = 0;

    // Process each run
    for (const run of runs) {
      if (!run.characterChosen) continue;

      // Process each card in the master deck
      for (const card of run.masterDeck) {
        // Skip if card already has a character
        if (card.character) {
          skippedCount++;
          continue;
        }

        // Update the card with the run's character
        console.log(card.name, run.characterChosen);
        await prisma.card.update({
          where: { id: card.id },
          data: { character: run.characterChosen },
        });
        updatedCount++;
      }
    }

    res.json({
      message: "Character assignment completed",
      stats: {
        updatedCards: updatedCount,
        skippedCards: skippedCount,
      },
    });
  } catch (error) {
    console.error("Error assigning characters to cards:", error);
    res.status(500).json({ error: "Failed to assign characters to cards" });
  }
});

export default router;
