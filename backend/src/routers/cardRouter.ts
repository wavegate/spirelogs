import prisma from "@/common/prisma.js";
import express, { Request, Response } from "express";

const router = express.Router();

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
      where: { id: parseInt(id) },
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
