const FROM = "tany4.com analytics <analytics@send.tany4.com>";
const TO = "hello@tany4.com";

// Sends the report with Resend and returns the email id
export async function sendReport({ subject, text, html }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [TO], subject, text, html }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend returned ${response.status} ${detail.slice(0, 200)}`);
  }
  return (await response.json()).id;
}
