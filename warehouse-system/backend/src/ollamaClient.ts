import { OllamaMessage } from "./types.js";

interface ChatRequest {
  model: string;
  messages: OllamaMessage[];
  stream?: boolean;
}

interface ChatResponse {
  message?: {
    content?: string;
  };
}

export const requestOllamaSummary = async (
  baseUrl: string,
  model: string,
  prompt: string
): Promise<string> => {
  const body: ChatRequest = {
    model,
    stream: false,
    messages: [
      {
        role: "system",
        content: "你是倉儲管理顧問，請以精簡重點提供建議。"
      },
      {
        role: "user",
        content: prompt
      }
    ]
  };

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed with status ${response.status}`);
  }

  const data = (await response.json()) as ChatResponse;
  return data.message?.content?.trim() || "Ollama 無回覆內容";
};
