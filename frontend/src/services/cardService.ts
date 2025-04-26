import apiClient from "./apiClient";

interface CardWithScores {
  id: string;
  name: string;
  averageScore: number | null;
  runCount: number;
}

const route = "/cards";

interface Card {
  id: number;
  imageLink: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface CardFormData {
  imageLink: string;
  name: string;
  description: string;
}

interface AssignCharactersResponse {
  message: string;
  stats: {
    updatedCards: number;
    skippedCards: number;
  };
}

const getAllCards = async (): Promise<Card[]> => {
  const { data } = await apiClient.get(route);
  return data;
};

const getCard = async (id: number): Promise<Card> => {
  const { data } = await apiClient.get(`${route}/${id}`);
  return data;
};

const createCard = async (formData: CardFormData): Promise<Card> => {
  const { data } = await apiClient.post(route, formData);
  return data;
};

const updateCard = async (
  id: number,
  formData: CardFormData
): Promise<Card> => {
  const { data } = await apiClient.put(`${route}/${id}`, formData);
  return data;
};

const deleteCard = async (id: number): Promise<void> => {
  await apiClient.delete(`${route}/${id}`);
};

const getCardsWithScores = async (): Promise<CardWithScores[]> => {
  const { data } = await apiClient.get(`${route}/with-scores`);
  return data;
};

const assignCharactersToCards = async (): Promise<AssignCharactersResponse> => {
  const { data } = await apiClient.post(`${route}/assign-characters`);
  return data;
};

export default {
  getAllCards,
  getCard,
  createCard,
  updateCard,
  deleteCard,
  getCardsWithScores,
  assignCharactersToCards,
};
