import baseAxios from "axios";

export const BASE_URL = "http://localhost:8000";

export const customAxios = baseAxios.create({
  baseURL: BASE_URL,
});
