import { defineConfig } from "cypress";
import * as dotenv from "dotenv"; 
dotenv.config(); // Load .env

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {
      return config;
    },
    env: {
      API_URL: process.env.VITE_API_URL,
    },
  },
});