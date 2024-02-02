import baseAxios from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "localhost:8000";
export const USE_HTTPS = process.env.NEXT_PUBLIC_USE_HTTPS === "true";

console.log("USING HTTPS:", USE_HTTPS);

export const customAxios = baseAxios.create({
  baseURL: `http${USE_HTTPS ? "s" : ""}://${BASE_URL}`,
});

export const WEBSOCKET_URL = `ws${USE_HTTPS ? "s" : ""}://${BASE_URL}`;
