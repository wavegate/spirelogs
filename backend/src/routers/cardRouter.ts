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
          .flatMap((card) => card.inMasterDeck.map((run) => run.score))
          .filter((score): score is number => score !== null);

        const averageScore =
          allRuns.length > 0
            ? allRuns.reduce((a, b) => a + b, 0) / allRuns.length
            : null;

        return {
          id: cardGroup[0].id,
          name: baseName,
          averageScore,
          runCount: allRuns.length,
          versions: cardGroup.map((card) => ({
            name: card.name,
            runCount: card.inMasterDeck.filter((run) => run.score !== null)
              .length,
            averageScore:
              card.inMasterDeck
                .map((run) => run.score)
                .filter((score): score is number => score !== null)
                .reduce((a, b) => a + b, 0) /
                card.inMasterDeck.filter((run) => run.score !== null).length ||
              null,
          })),
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

export default router;
