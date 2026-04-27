const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost({ request, env }) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = String(payload.email || "").trim().toLowerCase();

  if (!emailPattern.test(email)) {
    return Response.json({ error: "A valid email address is required" }, { status: 400 });
  }

  const record = {
    email,
    source: "athabasca-landing",
    createdAt: new Date().toISOString(),
    userAgent: request.headers.get("user-agent") || "",
  };

  if (!env.WAITLIST) {
    console.log("WAITLIST binding missing", record);
    return Response.json({ ok: true, stored: false });
  }

  await env.WAITLIST.put(`athabasca:${email}`, JSON.stringify(record));

  return Response.json({ ok: true, stored: true });
}

export function onRequestGet() {
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
