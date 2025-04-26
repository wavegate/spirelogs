import prisma from "@/common/prisma.js";
import express, { Request, Response } from "express";

const router = express.Router();

// Get all relics with average run scores
router.get("/with-scores", async (req: Request, res: Response) => {
  try {
    const relics = await prisma.relic.findMany({
      include: {
        runs: {
          select: {
            score: true,
          },
        },
      },
    });

    const relicsWithScores = relics.map((relic) => {
      const scores = relic.runs
        .map((run) => run.score)
        .filter((score): score is number => score !== null);

      const averageScore =
        scores.length > 0
          ? scores.reduce((a, b) => a + b, 0) / scores.length
          : null;

      return {
        id: relic.id,
        name: relic.name,
        averageScore,
        runCount: scores.length,
      };
    });

    res.json(relicsWithScores);
  } catch (error) {
    console.error("Error fetching relics with scores:", error);
    res.status(500).json({ error: "Failed to fetch relics with scores" });
  }
});

// Create a new relic
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const relic = await prisma.relic.create({
      data: {
        name,
      },
    });
    res.json(relic);
  } catch (error) {
    res.status(500).json({ error: "Failed to create relic" });
  }
});

// Get all relics
router.get("/", async (req: Request, res: Response) => {
  try {
    const relics = await prisma.relic.findMany();
    res.json(relics);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch relics" });
  }
});

// Get a single relic by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const relic = await prisma.relic.findUnique({
      where: { id },
    });
    if (!relic) {
      return res.status(404).json({ error: "Relic not found" });
    }
    res.json(relic);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch relic" });
  }
});

// Update a relic
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const relic = await prisma.relic.update({
      where: { id: parseInt(id) },
      data: {
        name,
      },
    });
    res.json(relic);
  } catch (error) {
    res.status(500).json({ error: "Failed to update relic" });
  }
});

// Delete a relic
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.relic.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Relic deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete relic" });
  }
});

export default router;
