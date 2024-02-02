import baseAxios from "axios";

export const BASE_URL = "localhost:8000";

export const customAxios = baseAxios.create({
  baseURL: `http://${BASE_URL}`,
});
