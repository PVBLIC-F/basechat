/**
 * Helicone integration for basechat
 */

import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import { openai } from "@ai-sdk/openai";
import { OpenAIModelId, AnthropicModelId, GroqModelId } from "ai";

import { HELICONE_API_KEY } from "../server/settings";

// Create a Helicone-enabled fetch function
const createHeliconeFetch = (baseUrl: string, targetUrl?: string) => {
  return async (url: URL | RequestInfo, init?: RequestInit) => {
    // Create a new headers object from the original request
    const headers = new Headers(init?.headers);
    
    // Add Helicone authentication header
    headers.set("Helicone-Auth", `Bearer ${HELICONE_API_KEY}`);
    
    // Add target URL header if provided
    if (targetUrl) {
      headers.set("Helicone-Target-URL", targetUrl);
    }
    
    // Determine the URL to use
    let finalUrl: string;
    if (targetUrl) {
      // For providers that need the target URL specified (like Google)
      finalUrl = baseUrl + new URL(url.toString()).pathname;
    } else {
      // For providers where we just replace the base URL
      finalUrl = url.toString().replace(/^https:\/\/[^\/]+/, baseUrl);
    }
    
    // Make the request with the modified URL and headers
    return fetch(finalUrl, {
      ...init,
      headers
    });
  };
};

// Global fetch implementations for each provider
const openAIHeliconeFetch = createHeliconeFetch("https://oai.hconeai.com/v1");
const anthropicHeliconeFetch = createHeliconeFetch("https://anthropic.hconeai.com/v1");
const groqHeliconeFetch = createHeliconeFetch("https://groq.hconeai.com/openai/v1");
const googleHeliconeFetch = createHeliconeFetch(
  "https://gateway.helicone.ai",
  "https://generativelanguage.googleapis.com"
);

// Override global fetch for AI SDK
const originalFetch = global.fetch;
global.fetch = (url: URL | RequestInfo, init?: RequestInit) => {
  const urlString = url.toString();
  
  if (urlString.includes("api.openai.com")) {
    return openAIHeliconeFetch(url, init);
  } else if (urlString.includes("api.anthropic.com")) {
    return anthropicHeliconeFetch(url, init);
  } else if (urlString.includes("api.groq.com")) {
    return groqHeliconeFetch(url, init);
  } else if (urlString.includes("generativelanguage.googleapis.com")) {
    return googleHeliconeFetch(url, init);
  }
  
  // Default to original fetch for other requests
  return originalFetch(url, init);
};

/**
 * Creates an OpenAI client with Helicone integration
 */
export const openaiWithHelicone = (model: string) => {
  return openai(model as OpenAIModelId);
};

/**
 * Creates an Anthropic client with Helicone integration
 */
export const anthropicWithHelicone = (model: string) => {
  return anthropic(model as AnthropicModelId);
};

/**
 * Creates a Groq client with Helicone integration
 */
export const groqWithHelicone = (model: string) => {
  return groq(model as GroqModelId);
};

/**
 * Creates a Google client with Helicone integration
 */
export const googleWithHelicone = (model: string) => {
  return google(model as any);
};
