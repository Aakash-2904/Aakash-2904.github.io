/* =====================================================================
   OPTIONAL: Cloudflare Worker that turns the chat into a Gemini-powered
   RAG assistant. The browser sends the question plus the top resume
   chunks it retrieved; this Worker asks Gemini to answer ONLY from them.
   Your API key stays secret on Cloudflare, never in the website code.

   Setup (free tier is enough):
     1. dash.cloudflare.com -> Workers & Pages -> Create Worker -> paste this file
     2. Settings -> Variables:
          GEMINI_API_KEY  (secret)  your key from aistudio.google.com
          ALLOWED_ORIGIN  (text)    https://aakash-2904.github.io
          GEMINI_MODEL    (text)    optional, defaults to gemini-2.5-flash
     3. Deploy, copy the workers.dev URL into API_URL at the top of chat/chat.js
   ===================================================================== */
export default {
  async fetch(req, env) {
    const origin = env.ALLOWED_ORIGIN || "*";
    const cors = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    if (req.method !== "POST") return new Response("POST only", { status: 405, headers: cors });
    if (origin !== "*" && req.headers.get("Origin") !== origin)
      return new Response("Forbidden", { status: 403, headers: cors });

    let body;
    try { body = await req.json(); } catch { return json({ error: "bad json" }, 400, cors); }
    const question = String(body.question || "").slice(0, 500);
    const context = (Array.isArray(body.context) ? body.context : []).slice(0, 8).map(c => String(c).slice(0, 1500));
    const history = (Array.isArray(body.history) ? body.history : []).slice(-6);
    if (!question) return json({ error: "empty question" }, 400, cors);

    const system = `You are the assistant on Aakash Kumar's portfolio website, talking to recruiters and visitors.
Answer ONLY using the CONTEXT below, which comes from his resume. Refer to him as "Aakash" or "he".
If the context does not contain the answer, say you don't know and suggest emailing aakash.abudhabi@gmail.com.
Never invent skills, numbers, employers or dates. Do not share personal details beyond what the context contains.
Keep answers under 120 words, friendly and specific. Plain text, short bullet lines with "•" are fine.

CONTEXT:
${context.join("\n")}`;

    const contents = [
      ...history.map(h => ({ role: h.role === "model" ? "model" : "user", parts: [{ text: String(h.text || "").slice(0, 1000) }] })),
      { role: "user", parts: [{ text: question }] },
    ];

    const model = env.GEMINI_MODEL || "gemini-2.5-flash";
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents,
        generationConfig: { temperature: 0.3, maxOutputTokens: 400 },
      }),
    });
    if (!r.ok) return json({ error: "upstream " + r.status }, 502, cors);
    const data = await r.json();
    const answer = data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("").trim();
    return json({ answer: answer || "" }, 200, cors);
  },
};
const json = (o, status, headers) =>
  new Response(JSON.stringify(o), { status, headers: { ...headers, "Content-Type": "application/json" } });
