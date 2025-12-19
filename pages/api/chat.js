import { convertToModelMessages, generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { getKeywordContext } from "../../lib/chat/retrieval";
import { CONTACT_EMAIL } from "../../lib/constants";

const MODEL = "gpt-4o-mini";
const MAX_TOKENS = 450;
const MAX_MESSAGES = 12;

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;
const rateLimitBucket = new Map();

function getClientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length > 0) return xff.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

function rateLimit(req) {
  const ip = getClientIp(req);
  const now = Date.now();
  const entry = rateLimitBucket.get(ip) || [];
  const filtered = entry.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  filtered.push(now);
  rateLimitBucket.set(ip, filtered);
  return filtered.length <= RATE_LIMIT_MAX;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!rateLimit(req)) {
    res.status(429).json({ error: "Rate limit exceeded" });
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    return;
  }

  const { messages } = req.body || {};
  const lastUserMessage = Array.isArray(messages)
    ? [...messages].reverse().find((m) => m?.role === "user")
    : null;
  const lastUserText =
    lastUserMessage?.content ||
    lastUserMessage?.text ||
    lastUserMessage?.parts?.find((p) => p?.type === "text")?.text ||
    "";

  const trimmedMessages = Array.isArray(messages)
    ? messages.slice(Math.max(0, messages.length - MAX_MESSAGES))
    : [];

  try {
    let context = "";
    try {
      context = await getKeywordContext(lastUserText || "");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("[api/chat] retrieval failed");
      res.status(500).json({
        error: "Chat is temporarily unavailable. Please try again.",
        code: "retrieval_failed",
      });
      return;
    }

    const hasContext = Boolean(context && context.trim().length > 0);
    const system = `You are Tania Papazafeiropoulou's website assistant.\n\nHard rules:\n- You must answer ONLY using the CONTEXT below (which comes from Tania's website content and CV).\n- Do not invent employers, dates, metrics, or experience.\n\nResponse rules:\n- If the user asks something broad (e.g. "tell me about you", "what do you do", "what have you built"), use the most relevant parts of the context to give a helpful summary.\n- If the context partially supports the question, answer the supported part and ask ONE short clarifying question to get the exact info needed.\n- If the context is empty/irrelevant OR it does not support ANY helpful answer, reply exactly: "This isn’t covered on my website or in my CV. Email me at ${CONTACT_EMAIL} for more details. You can also ask about my projects, roles, or tech stack."\n- Be concise, friendly, and factual.\n\nCONTEXT:\n${hasContext ? context : "(no relevant context found)"}`;

    let modelMessages;
    try {
      modelMessages = convertToModelMessages(trimmedMessages);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("[api/chat] invalid messages payload");
      res.status(400).json({
        error: "Invalid request.",
        code: "invalid_messages",
      });
      return;
    }

    const result = await generateText({
      model: openai(MODEL),
      system,
      maxTokens: MAX_TOKENS,
      messages: modelMessages,
    });

    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ text: result.text || "" });
  } catch (e) {
    const message = typeof e?.message === "string" ? e.message : "Chat failed";
    // eslint-disable-next-line no-console
    console.error("[api/chat] generateText failed:", message);

    const isPermissions = message.toLowerCase().includes("missing scopes");
    res.status(500).json({
      error: isPermissions
        ? "Chat is temporarily unavailable due to API configuration."
        : "Chat is temporarily unavailable. Please try again.",
      code: isPermissions ? "openai_permissions" : "chat_failed",
    });
  }
}
