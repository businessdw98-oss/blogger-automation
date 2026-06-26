// Supabase REST API 연동 (SDK 없이 순수 https)
const https = require("https");
const { loadEnv } = require("./auth");

function getConfig() {
  const env = loadEnv();
  return {
    url: env.SUPABASE_URL,
    key: env.SUPABASE_ANON_KEY
  };
}

function request(method, table, body = null, query = "") {
  return new Promise((resolve, reject) => {
    const { url, key } = getConfig();
    if (!url || !key) {
      reject(new Error("SUPABASE_URL / SUPABASE_ANON_KEY not set in .env"));
      return;
    }
    const host = url.replace("https://", "");
    const path = `/rest/v1/${table}${query}`;
    const payload = body ? JSON.stringify(body) : null;

    const options = {
      hostname: host,
      path,
      method,
      headers: {
        "apikey": key,
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
        "Prefer": method === "POST" ? "return=representation" : ""
      }
    };
    if (payload) options.headers["Content-Length"] = Buffer.byteLength(payload);

    const req = https.request(options, res => {
      let raw = "";
      res.on("data", d => (raw += d));
      res.on("end", () => {
        if (!raw || raw === "[]" || raw === "{}") return resolve([]);
        try { resolve(JSON.parse(raw)); }
        catch { resolve(raw); }
      });
    });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// 발행된 글 저장
async function logPost(post) {
  return request("POST", "posts", {
    topic_id:     post.topicId,
    title:        post.title,
    url:          post.url,
    target:       post.target,
    labels:       post.labels || [],
    published_at: new Date().toISOString(),
    views:        0,
    clicks:       0,
    revenue:      0
  });
}

// 트렌드 스냅샷 저장
async function logTrends(trends) {
  const rows = trends.slice(0, 20).map(t => ({
    topic:      t.title,
    source:     t.source,
    geo:        t.geo,
    score:      Math.round(t.score || 0),
    fetched_at: new Date().toISOString()
  }));
  return request("POST", "trend_logs", rows);
}

// 전략 노트 저장
async function saveStrategy(note) {
  return request("POST", "strategy", {
    date:            new Date().toISOString().slice(0, 10),
    analysis:        note.analysis,
    recommendations: note.recommendations,
    top_topics:      note.topTopics || [],
    views_total:     note.viewsTotal || 0,
    posts_total:     note.postsTotal || 0
  });
}

// 발행 현황 조회
async function getPostStats() {
  return request("GET", "posts", null, "?select=*&order=published_at.desc&limit=50");
}

// 성과 상위 글 조회
async function getTopPosts(limit = 10) {
  return request("GET", "posts", null, `?select=*&order=views.desc&limit=${limit}`);
}

module.exports = { logPost, logTrends, saveStrategy, getPostStats, getTopPosts };
