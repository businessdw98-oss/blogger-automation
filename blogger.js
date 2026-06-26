const https = require("https");
const { loadEnv } = require("./auth");

function apiRequest(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const env = loadEnv();
    const useToken = token || env.OAUTH2_ACCESS_TOKEN;
    const useKey = env.BLOGGER_API_KEY;

    const headers = { "Content-Type": "application/json" };
    if (useToken) headers["Authorization"] = `Bearer ${useToken}`;

    const urlPath = useToken
      ? `/blogger/v3${path}`
      : `/blogger/v3${path}${path.includes("?") ? "&" : "?"}key=${useKey}`;

    const options = {
      hostname: "www.googleapis.com",
      path: urlPath,
      method,
      headers
    };

    const req = https.request(options, res => {
      let raw = "";
      res.on("data", d => (raw += d));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(raw);
          if (res.statusCode >= 400) reject(Object.assign(new Error(parsed.error?.message || raw), { status: res.statusCode, body: parsed }));
          else resolve(parsed);
        } catch {
          reject(new Error(raw));
        }
      });
    });

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function getBlogInfo() {
  const env = loadEnv();
  return apiRequest("GET", `/blogs/${env.BLOG_ID}`);
}

async function publishPost({ title, content, labels = [], token }) {
  const env = loadEnv();
  return apiRequest("POST", `/blogs/${env.BLOG_ID}/posts/`, {
    kind: "blogger#post",
    title,
    content,
    labels
  }, token);
}

async function listPosts(maxResults = 10) {
  const env = loadEnv();
  return apiRequest("GET", `/blogs/${env.BLOG_ID}/posts?maxResults=${maxResults}&status=live`);
}

module.exports = { getBlogInfo, publishPost, listPosts };
