import apiClient from "./apiClient";

interface RelicWithScores {
  id: string;
  name: string;
  averageScore: number | null;
  runCount: number;
}

const route = "/relics";

interface Relic {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  bossRelicChoiceId: string | null;
}

interface RelicFormData {
  name: string;
}

const getAllRelics = async (): Promise<Relic[]> => {
  const { data } = await apiClient.get(route);
  return data;
};

const getRelic = async (id: number): Promise<Relic> => {
  const { data } = await apiClient.get(`${route}/${id}`);
  return data;
};

const createRelic = async (formData: RelicFormData): Promise<Relic> => {
  const { data } = await apiClient.post(route, formData);
  return data;
};

const updateRelic = async (
  id: number,
  formData: RelicFormData
): Promise<Relic> => {
  const { data } = await apiClient.put(`${route}/${id}`, formData);
  return data;
};

const deleteRelic = async (id: number): Promise<void> => {
  await apiClient.delete(`${route}/${id}`);
};

const getRelicsWithScores = async (): Promise<RelicWithScores[]> => {
  const { data } = await apiClient.get(`${route}/with-scores`);
  return data;
};

export default {
  getAllRelics,
  getRelic,
  createRelic,
  updateRelic,
  deleteRelic,
  getRelicsWithScores,
};
