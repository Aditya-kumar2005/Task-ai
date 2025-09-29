/**
 * @fileOverview Initializes the Genkit AI instance with the Google AI plugin.
 * This file exports a single `ai` object that is used throughout the application
 * to define and run AI flows.
 */
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from "zod";

// Initialize Genkit with the Google AI plugin.
// The plugin will automatically use the GEMINI_API_KEY from your .env file.
export const ai = genkit({
  plugins: [googleAI()],
  // enableTracingAndMetrics: true,
});
