/* =====================================================================
   "Ask about Aakash" chat widget
   Works in two modes:
   1. Local (default): retrieval over chat/kb.js, runs fully in the
      browser, no API key, no cost.
   2. LLM (optional): set API_URL to your Cloudflare Worker (see
      chat/worker.js). The browser retrieves the top chunks from the KB
      and the Worker asks Gemini to answer ONLY from them (RAG).
      If the Worker fails, the widget falls back to local mode.
   ===================================================================== */
(function () {
  const API_URL = ""; // e.g. "https://ask-aakash.<you>.workers.dev"
  const KB = window.AK_KB;
  if (!KB) return;

  /* ---------------- text utils ---------------- */
  const STOP = new Set("a an the is are was were be been do does did he his him aakash kumar you your i me my what which who whom how about tell of in on at for to with and or can could would should has have had any some this that it its there please know knows from by as into than then also give show list much many".split(" "));
  const stem = w => w.replace(/(ies)$/, "y").replace(/(ing|ed|es|s)$/, "");
  const tok = s => (s.toLowerCase().match(/[a-z0-9+#./-]+/g) || []).map(w => w.replace(/[./-]+$/, "")).filter(w => w && !STOP.has(w)).map(stem).filter(w => w.length > 1);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------------- BM25 index ---------------- */
  const docs = KB.docs.map(d => ({ ...d, toks: [...tok(d.title), ...tok(d.keys), ...tok(d.keys), ...tok(d.text)] }));
  const N = docs.length, avgdl = docs.reduce((a, d) => a + d.toks.length, 0) / N;
  const df = {};
  docs.forEach(d => new Set(d.toks).forEach(t => (df[t] = (df[t] || 0) + 1)));
  function bm25(q) {
    const qt = tok(q), k1 = 1.4, b = 0.75;
    return docs.map(d => {
      let s = 0;
      qt.forEach(t => {
        const f = d.toks.filter(x => x === t).length;
        if (!f) return;
        const idf = Math.log(1 + (N - df[t] + 0.5) / (df[t] + 0.5));
        s += idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * d.toks.length / avgdl));
      });
      return { d, s };
    }).sort((a, b) => b.s - a.s);
  }

  /* ---------------- skill matching ---------------- */
  const skillNames = Object.keys(KB.skills).concat(Object.keys(KB.aliases)).sort((a, b) => b.length - a.length);
  const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  function findSkills(q) {
    const low = " " + q.toLowerCase().replace(/[?!,]/g, " ") + " ";
    const found = [], unknown = [];
    let rest = low;
    for (const name of skillNames) {
      const re = new RegExp("(^|[^a-z0-9+#])" + reEsc(name) + "(?=$|[^a-z0-9+#])", "i");
      if (re.test(rest)) {
        rest = rest.replace(re, " ");
        const canon = name in KB.aliases ? KB.aliases[name] : name;
        if (canon === null) unknown.push(name);
        else if (!found.includes(canon)) found.push(canon);
      }
    }
    return { found, unknown };
  }
  const LABELS = { "c++":"C++", sql:"SQL", postgresql:"PostgreSQL", html:"HTML", css:"CSS", pytorch:"PyTorch", tensorflow:"TensorFlow",
    "scikit-learn":"scikit-learn", xgboost:"XGBoost", svm:"SVM", langgraph:"LangGraph", langchain:"LangChain", langsmith:"LangSmith",
    "pydantic ai":"Pydantic AI", rag:"RAG", graphrag:"GraphRAG", chromadb:"ChromaDB", lora:"LoRA", qlora:"QLoRA", openai:"OpenAI",
    yolo:"YOLO", opencv:"OpenCV", mediapipe:"MediaPipe", fastapi:"FastAPI", "rest api":"REST APIs", "ci/cd":"CI/CD", mlops:"MLOps",
    mcp:"MCP", n8n:"n8n", gcp:"GCP", etl:"ETL", fsl:"FSL", nlp:"NLP", r:"R", "hugging face":"Hugging Face", "claude code":"Claude Code", git:"Git / GitHub" };
  const label = s => LABELS[s] || s.replace(/^./, c => c.toUpperCase());
  const SKILL_Q = /\b(know|knows|familiar|experience|experienced|worked with|work with|use|used|uses|skilled|proficient|good at|expert|can he)\b/i;

  /* ---------------- local answering ---------------- */
  function localAnswer(q) {
    const t = q.trim().toLowerCase();
    if (/^(hi|hey|hello|yo|hola|namaste|good (morning|afternoon|evening))\b[!. ]*$/.test(t))
      return { text: "Hi! I can answer questions about Aakash's skills, projects, research, experience and availability. What would you like to know?" };
    if (/^(thanks|thank you|thx|ty|cool|great|nice|awesome|ok|okay)\b/.test(t))
      return { text: "Happy to help. Anything else you'd like to know about Aakash?" };
    if (/\b(top|main|key|core|best|strongest|primary)\b.*\b(skills?|strengths?)\b|\bwhat (are )?(his )?skills\b|\btech stack\b|^skills\??$/.test(t))
      return { text: "His core skills:\n• LLMs & agents: LangGraph, LangChain, multi-agent systems, RAG / GraphRAG, LoRA / QLoRA fine-tuning, Gemini, Ollama\n• ML & DL: PyTorch, TensorFlow, scikit-learn, computer vision (YOLO, MediaPipe), federated learning\n• MLOps: FastAPI, Docker, CI/CD, MCP, Azure ML, Databricks, GCP\n• Data: Python, SQL / PostgreSQL, Neo4j, ETL pipelines, Pandas\nAsk about any one of them to see where he used it.", src: "Skills" };

    const { found, unknown } = findSkills(q);
    const isSkillQ = SKILL_Q.test(q) || /^[\w+#. -]{1,30}\??$/.test(t);
    if (found.length && (isSkillQ || found.length >= 1 && bm25(q)[0].s < 3)) {
      const lines = found.slice(0, 3).map(s => `• ${label(s)}: ${KB.skills[s]}.`);
      return { text: (found.length === 1 ? "Yes, he does.\n" : "Yes to all of these.\n") + lines.join("\n"), src: "Skills" };
    }
    if (unknown.length || (SKILL_Q.test(q) && !found.length && bm25(q)[0].s < 2.5)) {
      const term = unknown[0] || (q.match(/(?:know|with|use|in|at)\s+([\w+#. -]{2,30})\??$/i) || [])[1] || "that";
      return { text: `${esc(term.trim())} isn't on Aakash's resume, so I can't confirm it. He picks up new tools quickly, though. It's worth asking him directly at ${KB.email}.`, src: "Skills" };
    }

    const r = bm25(q);
    if (r[0].s < 1.2)
      return { text: "I'm not sure about that one. I can tell you about his skills, projects (like TrialMatch), publications, experience, education or availability. For anything else, email him at " + KB.email + "." , fallback: true };
    const out = [r[0].d];
    if (r[1] && r[1].s > r[0].s * 0.8 && r[1].s > 2) out.push(r[1].d);
    return { text: out.map(d => d.text).join("\n\n"), src: out.map(d => d.title).join(" · "), link: out.find(d => d.link)?.link };
  }

  /* ---------------- LLM mode (optional) ---------------- */
  const history = [];
  async function llmAnswer(q) {
    const ctx = bm25(q).slice(0, 4).filter(x => x.s > 0).map(x => `[${x.d.title}] ${x.d.text}`);
    const { found } = findSkills(q);
    found.forEach(s => ctx.push(`[Skill: ${s}] ${KB.skills[s]}`));
    if (!ctx.length) ctx.push(`[Summary] ${KB.docs[0].text}`);
    const res = await fetch(API_URL, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q.slice(0, 500), context: ctx, history: history.slice(-6) })
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (!data.answer) throw new Error("empty");
    return { text: data.answer, src: "AI answer from Aakash's resume" };
  }

  /* ---------------- UI ---------------- */
  const launch = document.createElement("button");
  launch.className = "akc-launch"; launch.type = "button";
  launch.setAttribute("aria-label", "Ask me anything about Aakash");
  launch.innerHTML = `<img src="avatar.png" alt=""><span>Ask about me</span>`;

  const box = document.createElement("section");
  box.className = "akc"; box.hidden = true;
  box.setAttribute("role", "dialog"); box.setAttribute("aria-label", "Chat about Aakash");
  box.innerHTML = `
    <div class="akc-head">
      <img src="avatar.png" alt="">
      <div><b>Ask about Aakash</b><small>Skills, projects, research, availability</small></div>
      <span class="akc-mode">${API_URL ? "AI mode" : "Resume search"}</span>
      <button class="akc-close" type="button" aria-label="Close chat">×</button>
    </div>
    <div class="akc-log" aria-live="polite"></div>
    <div class="akc-sugs"></div>
    <form class="akc-form" autocomplete="off">
      <input type="text" maxlength="300" placeholder="e.g. Does he know PyTorch?" aria-label="Your question">
      <button type="submit">Send</button>
    </form>
    <p class="akc-note">Answers come only from Aakash's resume. For anything else, reach him on the Contact page.</p>`;
  document.body.append(launch, box);

  const log = box.querySelector(".akc-log"), sugs = box.querySelector(".akc-sugs");
  const form = box.querySelector("form"), input = form.querySelector("input"), sendBtn = form.querySelector("button");

  function add(who, text, src, link) {
    const m = document.createElement("div");
    m.className = "akc-msg " + who;
    m.innerHTML = esc(text).replace(/([\w.+-]+@[\w-]+\.[\w.]+)/g, '<a href="mailto:$1">$1</a>') +
      (src ? `<span class="akc-src">Source: ${esc(src)}${link ? ` · <a href="${esc(link)}"${/^http/.test(link) ? ' target="_blank" rel="noopener"' : ""}>read more</a>` : ""}</span>` : "");
    log.appendChild(m); log.scrollTop = log.scrollHeight;
    return m;
  }
  function showSugs(list) {
    sugs.innerHTML = list.map(s => `<button type="button">${esc(s)}</button>`).join("");
  }
  sugs.addEventListener("click", e => { const b = e.target.closest("button"); if (b) ask(b.textContent); });

  async function ask(q) {
    q = q.trim(); if (!q) return;
    add("me", q); input.value = ""; sugs.innerHTML = ""; sendBtn.disabled = true;
    const typing = add("bot", ""); typing.innerHTML = '<span class="akc-typing"><i></i><i></i><i></i></span>';
    let a;
    try { a = API_URL ? await llmAnswer(q) : localAnswer(q); }
    catch (err) { a = localAnswer(q); }
    await new Promise(r => setTimeout(r, API_URL ? 0 : 350));
    typing.remove();
    add("bot", a.text, a.src, a.link);
    history.push({ role: "user", text: q }, { role: "model", text: a.text });
    if (a.fallback) showSugs(KB.suggestions.slice(0, 4));
    sendBtn.disabled = false; input.focus();
  }
  form.addEventListener("submit", e => { e.preventDefault(); ask(input.value); });

  let greeted = false;
  function open() {
    box.hidden = false; launch.hidden = true;
    if (!greeted) {
      add("bot", "Hi, I'm Aakash's portfolio assistant. Ask me about his skills, projects, research, experience or availability.");
      showSugs(KB.suggestions); greeted = true;
    }
    input.focus();
  }
  function close() { box.hidden = true; launch.hidden = false; launch.focus(); }
  launch.addEventListener("click", open);
  box.querySelector(".akc-close").addEventListener("click", close);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !box.hidden) close(); });

  /* hide the custom avatar cursor while over the chat so there is only one cursor */
  [box, launch].forEach(el => {
    el.addEventListener("mouseenter", () => { const c = document.getElementById("cursor-avatar"), t = document.getElementById("cursor-trail"); if (c) c.style.visibility = "hidden"; if (t) t.style.visibility = "hidden"; });
    el.addEventListener("mouseleave", () => { const c = document.getElementById("cursor-avatar"), t = document.getElementById("cursor-trail"); if (c) c.style.visibility = ""; if (t) t.style.visibility = ""; });
  });

  /* expose for testing */
  window.AK_CHAT = { localAnswer };
})();
