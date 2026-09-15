import nodemailer from "nodemailer";

const TO = "hello@tany4.com";

// Sends the report through an existing mailbox over SMTP (Gmail by default, with an
// app password) and returns the message id
export async function sendReport({ subject, text, html }) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!user || !pass) throw new Error("SMTP_USER or SMTP_PASSWORD is not set");

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  const info = await transport.sendMail({
    from: `tany4.com analytics <${user}>`,
    to: TO,
    subject,
    text,
    html,
  });
  return info.messageId;
}
