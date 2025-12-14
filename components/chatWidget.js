import { useState } from "react";
import styles from "./layout.module.scss";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("ready");
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const isBusy = status === "submitted";
  const isErrored = Boolean(error);

  async function submitMessage(text) {
    const userMessage = { id: `u-${Date.now()}`, role: "user", text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setStatus("submitted");
    setError(null);
    setErrorMessage("");

    try {
      const payloadMessages = nextMessages.map((m) =>
        m.role === "user"
          ? { role: "user", parts: [{ type: "text", text: m.text }] }
          : { role: "assistant", parts: [{ type: "text", text: m.text }] }
      );

      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        throw new Error(
          typeof data?.error === "string" && data.error.trim().length > 0
            ? data.error
            : "Chat failed"
        );
      }

      const assistantText = typeof data?.text === "string" ? data.text : "";
      const assistantMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: assistantText || "",
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStatus("ready");
    } catch (e) {
      setError(e);
      setErrorMessage(
        typeof e?.message === "string" && e.message.trim().length > 0
          ? e.message
          : "Chat is temporarily unavailable. Please try again."
      );
      setStatus("ready");
    }
  }

  return (
    <div className={styles.chatWidget} aria-live="polite">
      <button
        type="button"
        className={styles.chatToggle}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="chat-panel"
      >
        Chat
      </button>

      {open && (
        <div className={styles.chatPanel} id="chat-panel" role="dialog" aria-label="Chat with Tania">
          <div className={styles.chatHeader}>
            <div>Ask about my work</div>
            <button
              type="button"
              className={styles.chatClose}
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              Close
            </button>
          </div>

          <div className={styles.chatMessages}>
            {isErrored && (
              <div className={styles.chatError}>
                {errorMessage || "Chat is temporarily unavailable. Please try again."}
              </div>
            )}
            {messages.length === 0 ? (
              <div className={styles.chatEmpty}>
                Ask me about projects, tech stack, or experience (answers are based on my site + CV).
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={m.role === "user" ? styles.chatUser : styles.chatAssistant}
                >
                  <div>{m.text}</div>
                </div>
              ))
            )}
          </div>

          <form
            className={styles.chatForm}
            onSubmit={(e) => {
              e.preventDefault();
              const trimmed = input.trim();
              if (!trimmed || isBusy || isErrored) return;
              submitMessage(trimmed);
              setInput("");
            }}
          >
            <input
              className={styles.chatInput}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isBusy ? "Thinking..." : "Ask a question"}
              disabled={isBusy || isErrored}
              inputMode="text"
              autoComplete="off"
              aria-label="Type your question"
            />
            <button
              type="submit"
              className={styles.chatSend}
              disabled={isBusy || isErrored || !input.trim()}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
