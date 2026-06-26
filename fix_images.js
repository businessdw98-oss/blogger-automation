const https = require("https");
const { loadEnv, getValidToken } = require("./auth");

function apiRequest(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const env = loadEnv();
    const options = {
      hostname: "www.googleapis.com",
      path: `/blogger/v3${path}`,
      method,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
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

// Pexels 직접 CDN URL (리다이렉트 없음)
const IMG = {
  ai:        "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200",
  money:     "https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=1200",
  laptop:    "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800",
  consulting:"https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
  youtube:   "https://images.pexels.com/photos/1024248/pexels-photo-1024248.jpeg?auto=compress&cs=tinysrgb&w=800",
  writing:   "https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=800",
  chatbot:   "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800",
};

async function main() {
  const env = loadEnv();
  const token = await getValidToken();

  // 최근 글 목록에서 대상 포스트 찾기
  const list = await apiRequest("GET", `/blogs/${env.BLOG_ID}/posts?maxResults=5&status=live`, null, token);
  const post = list.items?.[0];
  if (!post) { console.error("글을 찾을 수 없음"); return; }

  console.log(`수정 대상: ${post.title}`);

  // 이미지 교체
  let content = post.content
    .replace(/https:\/\/source\.unsplash\.com\/1200x500[^"']*/g, IMG.ai)
    .replace(/https:\/\/source\.unsplash\.com\/800x400\/\?consulting[^"']*/g, IMG.consulting)
    .replace(/https:\/\/source\.unsplash\.com\/800x400\/\?youtube[^"']*/g, IMG.youtube)
    .replace(/https:\/\/source\.unsplash\.com\/800x400\/\?writing[^"']*/g, IMG.writing)
    .replace(/https:\/\/source\.unsplash\.com\/800x400\/\?chatbot[^"']*/g, IMG.chatbot)
    .replace(/https:\/\/source\.unsplash\.com[^"']*/g, IMG.money);

  await apiRequest("PUT", `/blogs/${env.BLOG_ID}/posts/${post.id}`, {
    kind: "blogger#post",
    id: post.id,
    title: post.title,
    content
  }, token);

  console.log("✅ 이미지 수정 완료!");
  console.log(`   URL: ${post.url}`);
}

main().catch(console.error);
