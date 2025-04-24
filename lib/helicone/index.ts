/**
 * Helicone integration for basechat
 * 
 * This module provides Helicone-enabled versions of the AI SDK clients
 * for OpenAI, Anthropic, Groq, and Google.
 */

import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import { openai } from "@ai-sdk/openai";

import { HELICONE_API_KEY } from "../server/settings";

/**
 * Creates an OpenAI client with Helicone integration
 * @param model The OpenAI model to use
 * @returns An OpenAI client configured with Helicone
 */
export const openaiWithHelicone = (model: string) => {
  return openai(model, {
    configuration: {
      baseURL: "https://oai.hconeai.com/v1",
      defaultHeaders: {
        "Helicone-Auth": `Bearer ${HELICONE_API_KEY}`
      }
    }
  });
};

/**
 * Creates an Anthropic client with Helicone integration
 * @param model The Anthropic model to use
 * @returns An Anthropic client configured with Helicone
 */
export const anthropicWithHelicone = (model: string) => {
  return anthropic(model, {
    configuration: {
      baseURL: "https://anthropic.hconeai.com/v1",
      defaultHeaders: {
        "Helicone-Auth": `Bearer ${HELICONE_API_KEY}`
      }
    }
  });
};

/**
 * Creates a Groq client with Helicone integration
 * @param model The Groq model to use
 * @returns A Groq client configured with Helicone
 */
export const groqWithHelicone = (model: string) => {
  return groq(model, {
    configuration: {
      baseURL: "https://groq.hconeai.com/openai/v1",
      defaultHeaders: {
        "Helicone-Auth": `Bearer ${HELICONE_API_KEY}`
      }
    }
  });
};

/**
 * Creates a Google client with Helicone integration
 * @param model The Google model to use
 * @returns A Google client configured with Helicone
 */
export const googleWithHelicone = (model: string) => {
  return google(model, {
    configuration: {
      baseURL: "https://gemini.hconeai.com/v1beta",
      defaultHeaders: {
        "Helicone-Auth": `Bearer ${HELICONE_API_KEY}`
      }
    }
  });
};
