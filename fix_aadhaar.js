// 발행된 Aadhaar 글을 보강된 콘텐츠로 업데이트
const https = require("https");
const { loadEnv, getValidToken } = require("./auth");
const { generateContent } = require("./generator");

function apiRequest(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const env = loadEnv();
    const options = {
      hostname: "www.googleapis.com",
      path: `/blogger/v3${path}`,
      method,
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
    };
    const req = https.request(options, res => {
      let raw = "";
      res.on("data", d => (raw += d));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(raw);
          if (res.statusCode >= 400) reject(Object.assign(new Error(parsed.error?.message || raw), { status: res.statusCode }));
          else resolve(parsed);
        } catch { reject(new Error(raw)); }
      });
    });
    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  const env = loadEnv();
  const token = await getValidToken();

  const list = await apiRequest("GET", `/blogs/${env.BLOG_ID}/posts?maxResults=10&status=live`, null, token);
  const post = list.items?.find(p => p.title.toLowerCase().includes("aadhaar"));

  if (!post) { console.error("Aadhaar 글을 찾을 수 없음"); return; }

  console.log(`수정 대상: ${post.title}`);
  const content = generateContent("india_aadhaar", "benefits");

  await apiRequest("PUT", `/blogs/${env.BLOG_ID}/posts/${post.id}`, {
    kind: "blogger#post",
    id: post.id,
    title: "7 Aadhaar Card Benefits You're Probably Not Using in 2026",
    content: content.trim(),
    labels: ["Aadhaar benefits", "government scheme India", "benefits", "IN", "2026"]
  }, token);

  console.log("✅ Aadhaar 글 업데이트 완료!");
  console.log(`   URL: ${post.url}`);
}

main().catch(console.error);
