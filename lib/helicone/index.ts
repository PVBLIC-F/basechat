/**
 * Helicone integration for basechat
 */

import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import { openai } from "@ai-sdk/openai";

import { HELICONE_API_KEY } from "../server/settings";

/**
 * Creates an OpenAI client with Helicone integration
 */
export const openaiWithHelicone = (model: string) => {
  // We need to cast the model to any to bypass the strict type checking
  return openai(model as any, {
    apiKey: process.env.OPENAI_API_KEY,
    fetch: (url, options = {}) => {
      // Modify the request to go through Helicone
      const heliconeUrl = url.toString().replace(
        "https://api.openai.com/v1",
        "https://oai.helicone.ai/v1"
      );
      
      // Add Helicone headers
      const headers = new Headers(options.headers);
      headers.set("Helicone-Auth", `Bearer ${HELICONE_API_KEY}`);
      
      return fetch(heliconeUrl, {
        ...options,
        headers
      });
    }
  });
};

/**
 * Creates an Anthropic client with Helicone integration
 */
export const anthropicWithHelicone = (model: string) => {
  return anthropic(model as any, {
    apiKey: process.env.ANTHROPIC_API_KEY,
    fetch: (url, options = {}) => {
      // Modify the request to go through Helicone
      const heliconeUrl = url.toString().replace(
        "https://api.anthropic.com",
        "https://anthropic.helicone.ai"
      );
      
      // Add Helicone headers
      const headers = new Headers(options.headers);
      headers.set("Helicone-Auth", `Bearer ${HELICONE_API_KEY}`);
      
      return fetch(heliconeUrl, {
        ...options,
        headers
      });
    }
  });
};

/**
 * Creates a Groq client with Helicone integration
 */
export const groqWithHelicone = (model: string) => {
  return groq(model as any, {
    apiKey: process.env.GROQ_API_KEY,
    fetch: (url, options = {}) => {
      // Modify the request to go through Helicone
      const heliconeUrl = url.toString().replace(
        "https://api.groq.com/openai/v1",
        "https://groq.helicone.ai/openai/v1"
      );
      
      // Add Helicone headers
      const headers = new Headers(options.headers);
      headers.set("Helicone-Auth", `Bearer ${HELICONE_API_KEY}`);
      
      return fetch(heliconeUrl, {
        ...options,
        headers
      });
    }
  });
};

/**
 * Creates a Google client with Helicone integration
 */
export const googleWithHelicone = (model: string) => {
  return google(model as any, {
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    fetch: (url, options = {}) => {
      // Add Helicone headers
      const headers = new Headers(options.headers);
      headers.set("Helicone-Auth", `Bearer ${HELICONE_API_KEY}`);
      headers.set("Helicone-Target-URL", "https://generativelanguage.googleapis.com");
      
      return fetch("https://gateway.helicone.ai" + url.toString().replace("https://generativelanguage.googleapis.com", ""), {
        ...options,
        headers
      });
    }
  });
};
