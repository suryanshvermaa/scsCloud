import Groq from "groq-sdk";
export interface IChat{
    messages: Groq.Chat.Completions.ChatCompletionMessageParam[];
    timeoutHandle?: NodeJS.Timeout;
}

const sessions: Map<string, IChat> = new Map();

export function getSession(sessionId: string): IChat | undefined {
  return sessions.get(sessionId);
}

export function setSession(sessionId: string, data: IChat): void {
  sessions.set(sessionId, data);
}

export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId);
}

