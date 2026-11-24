export default async function handler(req, res) {
  const base = process.env.SUPABASE_DASHBOARD_API_BASE;
  const key = process.env.DASHBOARD_ADMIN_KEY;

  if (!base || !key) {
    return res.status(500).json({
      ok: false,
      message: "Server environment variables are not configured"
    });
  }

  const action = String(req.query.api || "health");

  const allowed = new Set([
    "health",
    "issues",
    "assignees",
    "assignee-add",
    "update"
  ]);

  if (!allowed.has(action)) {
    return res.status(404).json({
      ok: false,
      message: "Not found"
    });
  }

  const method = req.method || "GET";

  if (
    (action === "issues" || action === "assignees" || action === "health") &&
    method !== "GET"
  ) {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  if (
    (action === "assignee-add" || action === "update") &&
    method !== "POST"
  ) {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const url = new URL(base);
    url.searchParams.set("api", action);

    const upstream = await fetch(url.toString(), {
      method,
      headers: {
        "X-Dashboard-Key": key,
        ...(method === "POST"
          ? { "Content-Type": "application/json" }
          : {})
      },
      body:
        method === "POST"
          ? JSON.stringify(req.body || {})
          : undefined
    });

    const text = await upstream.text();

    res.status(upstream.status);
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "application/json; charset=utf-8");

    return res.send(text);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: error instanceof Error ? error.message : String(error)
    });
  }
}
