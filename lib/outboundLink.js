// The analytics path recorded when a visitor leaves the site through a link or
// downloads a file from it, or null for ordinary links between pages
export function outboundPath(href, siteOrigin) {
  let url;
  try {
    url = new URL(href, siteOrigin);
  } catch (e) {
    return null;
  }

  if (url.protocol === "mailto:") return "/out/email";
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;

  if (url.origin === siteOrigin) {
    const file = url.pathname.match(/\/([^/]+\.pdf)$/i);
    return file ? `/download/${file[1]}` : null;
  }

  return `/out/${url.hostname.replace(/^www\./, "")}`;
}
