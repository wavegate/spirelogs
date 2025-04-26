export interface Card {
  id: string;
  name: string;
}

export interface Relic {
  id: string;
  name: string;
}

export interface CardChoice {
  floor: number;
  picked: Card;
  notPicked: Card[];
}

export interface Run {
  id: string;
  playId: string;
  characterChosen: string;
  floorReached: number;
  isVictory: boolean;
  timestamp: string;
  masterDeck: Card[];
  relics: Relic[];
  cardChoices: CardChoice[];
  // Add other fields as needed
}
