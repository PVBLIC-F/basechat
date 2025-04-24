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
  // Use a custom fetch implementation to route through Helicone
  const customFetch = async (url: RequestInfo | URL, init?: RequestInit) => {
    const heliconeUrl = url.toString().replace(
      "https://api.openai.com/v1",
      "https://oai.helicone.ai/v1"
    );
    
    const headers = new Headers(init?.headers);
    headers.set("Helicone-Auth", `Bearer ${HELICONE_API_KEY}`);
    
    return fetch(heliconeUrl, {
      ...init,
      headers
    });
  };

  return openai(model as any, { 
    customFetch 
  });
};

/**
 * Creates an Anthropic client with Helicone integration
 */
export const anthropicWithHelicone = (model: string) => {
  // Use a custom fetch implementation to route through Helicone
  const customFetch = async (url: RequestInfo | URL, init?: RequestInit) => {
    const heliconeUrl = url.toString().replace(
      "https://api.anthropic.com",
      "https://anthropic.helicone.ai"
    );
    
    const headers = new Headers(init?.headers);
    headers.set("Helicone-Auth", `Bearer ${HELICONE_API_KEY}`);
    
    return fetch(heliconeUrl, {
      ...init,
      headers
    });
  };

  return anthropic(model as any, { 
    customFetch 
  });
};

/**
 * Creates a Groq client with Helicone integration
 */
export const groqWithHelicone = (model: string) => {
  // Use a custom fetch implementation to route through Helicone
  const customFetch = async (url: RequestInfo | URL, init?: RequestInit) => {
    const heliconeUrl = url.toString().replace(
      "https://api.groq.com/openai/v1",
      "https://groq.helicone.ai/openai/v1"
    );
    
    const headers = new Headers(init?.headers);
    headers.set("Helicone-Auth", `Bearer ${HELICONE_API_KEY}`);
    
    return fetch(heliconeUrl, {
      ...init,
      headers
    });
  };

  return groq(model as any, { 
    customFetch 
  });
};

/**
 * Creates a Google client with Helicone integration
 */
export const googleWithHelicone = (model: string) => {
  // Use a custom fetch implementation to route through Helicone
  const customFetch = async (url: RequestInfo | URL, init?: RequestInit) => {
    const targetUrl = url.toString();
    const heliconeUrl = "https://gateway.helicone.ai" + targetUrl.replace(
      "https://generativelanguage.googleapis.com", 
      ""
    );
    
    const headers = new Headers(init?.headers);
    headers.set("Helicone-Auth", `Bearer ${HELICONE_API_KEY}`);
    headers.set("Helicone-Target-URL", "https://generativelanguage.googleapis.com");
    
    return fetch(heliconeUrl, {
      ...init,
      headers
    });
  };

  return google(model as any, { 
    customFetch 
  });
};
