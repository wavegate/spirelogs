import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

interface RunData {
  gold_per_floor: number[];
  floor_reached: number;
  playtime: number;
  items_purged: string[];
  score: number;
  play_id: string;
  local_time: string;
  is_ascension_mode: boolean;
  campfire_choices: Array<{
    data: string;
    floor: number;
    key: string;
  }>;
  neow_cost: string;
  seed_source_timestamp: number;
  circlet_count: number;
  master_deck: string[];
  relics: string[];
  potions_floor_usage: any[];
  damage_taken: Array<{
    damage: number;
    enemies: string;
    floor: number;
    turns: number;
  }>;
  seed_played: string;
  potions_obtained: Array<{
    floor: number;
    key: string;
  }>;
  is_trial: boolean;
  path_per_floor: string[];
  character_chosen: string;
  items_purchased: string[];
  item_purchase_floors: number[];
  current_hp_per_floor: number[];
  gold: number;
  neow_bonus: string;
  is_prod: boolean;
  is_daily: boolean;
  chose_seed: boolean;
  campfire_upgraded: number;
  win_rate: number;
  timestamp: number;
  path_taken: string[];
  build_version: string;
  purchased_purges: number;
  victory: boolean;
  max_hp_per_floor: number[];
  card_choices: Array<{
    not_picked: string[];
    picked: string;
    floor: number;
  }>;
  player_experience: number;
  relics_obtained: Array<{
    floor: number;
    key: string;
  }>;
  event_choices: Array<{
    cards_removed: string[];
    damage_healed: number;
    gold_gain: number;
    player_choice: string;
    damage_taken: number;
    max_hp_gain: number;
    max_hp_loss: number;
    event_name: string;
    floor: number;
    gold_loss: number;
  }>;
  is_beta: boolean;
  boss_relics: Array<{
    not_picked: string[];
    picked: string;
  }>;
  is_endless: boolean;
  potions_floor_spawned: number[];
  ascension_level: number;
  campfire_rested: number;
}

router.post("/", async (req: Request, res: Response) => {
  try {
    const runData: RunData = req.body;

    // Check if run with this playId already exists
    const existingRun = await prisma.run.findUnique({
      where: { playId: runData.play_id },
    });

    if (existingRun) {
      return res.status(409).json({ error: "alreadyExists" });
    }

    // Create or find cards
    const cardIds: string[] = [];
    for (const cardName of runData.master_deck) {
      console.log(cardName);
      const card = await prisma.card.upsert({
        where: { name: cardName },
        update: {},
        create: { name: cardName },
      });
      cardIds.push(card.id);
    }

    // Create or find relics
    const relicIds: string[] = [];
    for (const relicName of runData.relics) {
      const relic = await prisma.relic.upsert({
        where: { name: relicName },
        update: {},
        create: { name: relicName },
      });
      relicIds.push(relic.id);
    }

    // Create or find potions
    const potionIds: string[] = [];
    for (const potionName of runData.potions_floor_spawned) {
      const potion = await prisma.potion.upsert({
        where: { name: String(potionName) },
        update: {},
        create: { name: String(potionName) },
      });
      potionIds.push(potion.id);
    }

    // Create or find events
    const eventIds: string[] = [];
    for (const eventChoice of runData.event_choices) {
      const event = await prisma.event.upsert({
        where: { name: eventChoice.event_name },
        update: {},
        create: { name: eventChoice.event_name },
      });
      eventIds.push(event.id);
    }

    // Create or find enemies
    const enemyIds: string[] = [];
    for (const damage of runData.damage_taken) {
      const enemy = await prisma.enemy.upsert({
        where: { name: damage.enemies },
        update: {},
        create: { name: damage.enemies },
      });
      enemyIds.push(enemy.id);
    }
    // Create the run with the IDs
    const run = await prisma.run.create({
      data: {
        playId: runData.play_id,
        characterChosen: runData.character_chosen,
        floorReached: runData.floor_reached,
        playtime: runData.playtime,
        score: runData.score,
        isVictory: runData.victory,
        isAscensionMode: runData.is_ascension_mode,
        isDaily: runData.is_daily,
        isTrial: runData.is_trial,
        isEndless: runData.is_endless,
        isBeta: runData.is_beta,
        ascensionLevel: runData.ascension_level,
        gold: runData.gold,
        timestamp: runData.timestamp ? new Date(runData.timestamp) : null,
        localTime: runData.local_time,
        seedPlayed: runData.seed_played,
        seedSourceTimestamp: runData.seed_source_timestamp,
        buildVersion: runData.build_version,
        winRate: runData.win_rate,
        playerExperience: runData.player_experience,
        neowBonus: runData.neow_bonus,
        neowCost: runData.neow_cost,
        circletCount: runData.circlet_count,
        purchasedPurges: runData.purchased_purges,
        campfireRested: runData.campfire_rested,
        campfireUpgraded: runData.campfire_upgraded,
        pathTaken: runData.path_taken,
        pathPerFloor: runData.path_per_floor.map((path) => path || ""),
        currentHpPerFloor: runData.current_hp_per_floor,
        maxHpPerFloor: runData.max_hp_per_floor,
        goldPerFloor: runData.gold_per_floor,
        potionsFloorSpawned: runData.potions_floor_spawned,
        potionsFloorUsage: runData.potions_floor_usage,
        itemPurchaseFloors: runData.item_purchase_floors,
        masterDeck: {
          connect: cardIds.map((id) => ({ id })),
        },
        relics: {
          connect: relicIds.map((id) => ({ id })),
        },
        potionsObtained: {
          create: runData.potions_floor_spawned.map((_, index) => ({
            floor: index,
            potion: {
              connect: { id: potionIds[index] },
            },
          })),
        },
        eventChoices: {
          create: runData.event_choices.map((choice, index) => ({
            event: {
              connect: { id: eventIds[index] },
            },
            floor: choice.floor,
            damageHealed: choice.damage_healed,
            goldGain: choice.gold_gain,
            damageTaken: choice.damage_taken,
            maxHpGain: choice.max_hp_gain,
            maxHpLoss: choice.max_hp_loss,
            goldLoss: choice.gold_loss,
          })),
        },
        damageTaken: {
          create: runData.damage_taken.map((damage, index) => ({
            enemy: {
              connect: { id: enemyIds[index] },
            },
            damage: damage.damage,
            floor: damage.floor,
            turns: damage.turns,
          })),
        },
      },
    });

    // Create card choices
    for (const choice of runData.card_choices) {
      // First ensure all cards exist
      const pickedCard = await prisma.card.upsert({
        where: { name: choice.picked },
        update: {},
        create: { name: choice.picked },
      });

      // Create all not picked cards first
      const notPickedCards = [];
      for (const name of choice.not_picked) {
        const card = await prisma.card.upsert({
          where: { name },
          update: {},
          create: { name },
        });
        notPickedCards.push(card);
      }

      // Then create the card choice
      await prisma.cardChoice.create({
        data: {
          floor: choice.floor,
          pickedId: pickedCard.id,
          notPicked: {
            connect: notPickedCards.map((card) => ({ id: card.id })),
          },
          runId: run.id,
        },
      });
    }

    // Create campfire choices
    for (const choice of runData.campfire_choices) {
      console.log(choice.data);
      let card;
      if (choice.data) {
        card = await prisma.card.upsert({
          where: { name: choice.data },
          update: {},
          create: { name: choice.data },
        });
      }
      await prisma.campfireChoice.create({
        data: {
          floor: choice.floor,
          key: choice.key,
          cardId: card ? card?.id : undefined,
          runId: run.id,
        },
      });
    }

    // Create boss relic choices
    for (const relicChoice of runData.boss_relics) {
      // First ensure all relics exist
      const pickedRelic = await prisma.relic.upsert({
        where: { name: relicChoice.picked },
        update: {},
        create: { name: relicChoice.picked },
      });

      // Create all not picked relics first
      const notPickedRelics = [];
      for (const name of relicChoice.not_picked) {
        const relic = await prisma.relic.upsert({
          where: { name },
          update: {},
          create: { name },
        });
        notPickedRelics.push(relic);
      }

      // Then create the boss relic choice
      await prisma.bossRelicChoice.create({
        data: {
          pickedId: pickedRelic.id,
          notPicked: {
            connect: notPickedRelics.map((relic) => ({ id: relic.id })),
          },
          runId: run.id,
        },
      });
    }

    // Create event choices
    for (const eventChoice of runData.event_choices) {
      // First ensure all entities exist
      const event = await prisma.event.upsert({
        where: { name: eventChoice.event_name },
        update: {},
        create: { name: eventChoice.event_name },
      });

      const playerChoice = await prisma.playerChoice.upsert({
        where: { name: eventChoice.player_choice },
        update: {},
        create: { name: eventChoice.player_choice },
      });

      // Create all removed cards first
      let removedCards = [];
      if (eventChoice.cards_removed) {
        for (const name of eventChoice.cards_removed) {
          console.log(name);
          const card = await prisma.card.upsert({
            where: { name },
            update: {},
            create: { name },
          });
          removedCards.push(card);
        }
      }

      // Then create the event choice
      await prisma.eventChoice.create({
        data: {
          damageHealed: eventChoice.damage_healed,
          goldGain: eventChoice.gold_gain,
          playerChoiceId: playerChoice.id,
          damageTaken: eventChoice.damage_taken,
          maxHpGain: eventChoice.max_hp_gain,
          maxHpLoss: eventChoice.max_hp_loss,
          eventId: event.id,
          floor: eventChoice.floor,
          goldLoss: eventChoice.gold_loss,
          cardsRemoved: {
            connect: removedCards.map((card) => ({ id: card.id })),
          },
          runId: run.id,
        },
      });
    }

    // Create relics obtained
    for (const relicObtained of runData.relics_obtained) {
      const relic = await prisma.relic.upsert({
        where: { name: relicObtained.key },
        update: {},
        create: { name: relicObtained.key },
      });
      await prisma.relicObtained.create({
        data: {
          floor: relicObtained.floor,
          relicId: relic.id,
          runId: run.id,
        },
      });
    }

    // Create potions obtained
    for (const potionObtained of runData.potions_obtained) {
      const potion = await prisma.potion.upsert({
        where: { name: potionObtained.key },
        update: {},
        create: { name: potionObtained.key },
      });
      await prisma.potionObtained.create({
        data: {
          floor: potionObtained.floor,
          potionId: potion.id,
          runId: run.id,
        },
      });
    }

    res.json({ message: "Run created successfully" });
  } catch (error) {
    console.error("Error creating run:", error);
    res.status(500).json({ error: "Failed to create run" });
  }
});

// Get all run IDs
router.get("/", async (req: Request, res: Response) => {
  try {
    const runs = await prisma.run.findMany({
      select: {
        id: true,
        playId: true,
        characterChosen: true,
        floorReached: true,
        isVictory: true,
        timestamp: true,
      },
      orderBy: {
        timestamp: "desc",
      },
    });
    res.json(runs);
  } catch (error) {
    console.error("Error fetching runs:", error);
    res.status(500).json({ error: "Failed to fetch runs" });
  }
});

// Get run details by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const run = await prisma.run.findUnique({
      where: { id },
      include: {
        masterDeck: true,
        relics: true,
        potionsObtained: {
          include: {
            potion: true,
          },
        },
        cardChoices: {
          include: {
            picked: true,
            notPicked: true,
          },
        },
        campfireChoices: {
          include: {
            data: true,
          },
        },
        bossRelics: {
          include: {
            picked: true,
            notPicked: true,
          },
        },
        eventChoices: {
          include: {
            event: true,
            playerChoice: true,
            cardsRemoved: true,
          },
        },
        relicsObtained: {
          include: {
            relic: true,
          },
        },
        damageTaken: {
          include: {
            enemy: true,
          },
        },
      },
    });

    if (!run) {
      return res.status(404).json({ error: "Run not found" });
    }

    // Convert BigInt to string
    const serializedRun = {
      ...run,
      seedSourceTimestamp: run.seedSourceTimestamp?.toString(),
    };

    res.json(serializedRun);
  } catch (error) {
    console.error("Error fetching run:", error);
    res.status(500).json({ error: "Failed to fetch run" });
  }
});

export default router;
