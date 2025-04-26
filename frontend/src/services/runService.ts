import apiClient from "./apiClient";

const route = "/runs";

const submitRun = async (runData: any): Promise<any> => {
  const { data } = await apiClient.post(route, runData);
  return data;
};

const getRuns = async (): Promise<any> => {
  const { data } = await apiClient.get(route);
  return data;
};

const getRun = async (id: string): Promise<any> => {
  const { data } = await apiClient.get(`${route}/${id}`);
  return data;
};

export default {
  submitRun,
  getRuns,
  getRun,
};
