export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(
      "https://api.github.com/repos/altany/tany4/commits?per_page=1",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "tany4-website",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const commits = await response.json();
    if (!commits || commits.length === 0) {
      return res.status(404).json({ error: "No commits found" });
    }

    const commit = commits[0];
    const commitDate = new Date(commit.commit.author.date);
    const now = new Date();
    const diffMs = now - commitDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    let dateStr;
    if (diffDays > 0) {
      dateStr = diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
    } else if (diffHours > 0) {
      dateStr = diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    } else if (diffMinutes > 0) {
      dateStr = diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
    } else {
      dateStr = "just now";
    }

    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");

    return res.status(200).json({
      link: commit.html_url,
      date: dateStr,
      message: commit.commit.message.split("\n")[0],
    });
  } catch (error) {
    console.error("Last commit API error:", error);
    return res.status(500).json({ error: "Failed to fetch commit data" });
  }
}
