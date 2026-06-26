/**
 * 기발행 글 썸네일 중복 교체
 * node fix_images.js
 */
const https = require("https");
const { getValidToken, loadEnv } = require("./auth");
const { listPosts, updatePost } = require("./blogger");
const { POOL } = require("./images");

function apiGet(postId, token) {
  return new Promise((resolve, reject) => {
    const env = loadEnv();
    https.get({
      hostname: "www.googleapis.com",
      path: `/blogger/v3/blogs/${env.BLOG_ID}/posts/${postId}`,
      headers: { Authorization: `Bearer ${token}` }
    }, res => {
      let raw = "";
      res.on("data", d => (raw += d));
      res.on("end", () => { try { resolve(JSON.parse(raw)); } catch (e) { reject(e); } });
    }).on("error", reject);
  });
}

function pickCategory(title, labels) {
  const t = (title + " " + (labels || []).join(" ")).toLowerCase();
  if (/mixer|grinder|kitchen|airfryer|air fryer|appliance/.test(t)) return "kitchen";
  if (/home|electricity|energy|bedroom|decor|living/.test(t)) return "home";
  if (/aadhaar|epf|snap|welfare|benefit|scheme|centrelink|universal credit|social security|wic|food assistance/.test(t)) return "benefits";
  if (/celebrity|divorce|bollywood|actor|actress|singer/.test(t)) return "celebrity";
  if (/cricket|ipl|athlete|sports|fantasy/.test(t)) return "sports";
  if (/india|indian|rupee|ias|salary india/.test(t)) return "india";
  if (/laptop|earbuds|smartphone|gadget/.test(t)) return "laptop";
  if (/food|restaurant|recipe|chai/.test(t)) return "food";
  if (/travel|flight|hotel|trip/.test(t)) return "travel";
  if (/\bai\b|artificial intelligence|chatgpt/.test(t)) return "ai";
  if (/side hustle|freelance|passive income|earn|income|hustle/.test(t)) return "income";
  return "finance";
}

const usedInSession = new Set();
function pickUniqueImg(category) {
  const pool = POOL[category] || POOL.finance;
  let available = pool.filter(url => !usedInSession.has(url));
  if (available.length === 0) {
    pool.forEach(url => usedInSession.delete(url));
    available = [...pool];
  }
  const url = available[Math.floor(Math.random() * available.length)];
  usedInSession.add(url);
  return url;
}

function replaceHeroImage(content, newUrl) {
  return content.replace(
    /(<img[^>]+src=["'])([^"'?]+)(\??[^"']*)(["'][^>]*>)/,
    (match, pre, oldSrc, query, post) => `${pre}${newUrl}?auto=compress&cs=tinysrgb&w=1200${post}`
  );
}

async function main() {
  const token = await getValidToken();
  const data = await listPosts(token, 50);
  const posts = data.items || [];

  console.log("총 " + posts.length + "개 글 이미지 점검 중...\n");

  const postDetails = [];
  for (const p of posts) {
    const full = await apiGet(p.id, token);
    const firstImgMatch = (full.content || "").match(/<img[^>]+src=["']([^"'?]+)/);
    const heroUrl = firstImgMatch ? firstImgMatch[1] : null;
    postDetails.push({ ...p, content: full.content, heroUrl });
    await new Promise(r => setTimeout(r, 300));
  }

  // 중복 URL 찾기
  const urlCount = {};
  for (const p of postDetails) {
    if (p.heroUrl) urlCount[p.heroUrl] = (urlCount[p.heroUrl] || 0) + 1;
  }
  const duplicateUrls = new Set(
    Object.entries(urlCount).filter(([, c]) => c > 1).map(([url]) => url)
  );

  console.log("중복 썸네일 URL: " + duplicateUrls.size + "개\n");

  // 중복 없는 글 이미지는 선점 등록
  for (const p of postDetails) {
    if (p.heroUrl && !duplicateUrls.has(p.heroUrl)) usedInSession.add(p.heroUrl);
  }

  // 중복 글 교체
  let fixed = 0;
  for (const p of postDetails) {
    if (!p.heroUrl || !duplicateUrls.has(p.heroUrl)) continue;

    const category = pickCategory(p.title, p.labels);
    const newUrl = pickUniqueImg(category);
    const newContent = replaceHeroImage(p.content, newUrl);

    try {
      await updatePost({ id: p.id, title: p.title, content: newContent, labels: p.labels || [], token });
      const newId = newUrl.match(/photos\/(\d+)\//)?.[1] || "?";
      const oldId = p.heroUrl.match(/photos\/(\d+)\//)?.[1] || "?";
      console.log("OK [" + category + "] " + p.title.slice(0, 55));
      console.log("   " + oldId + " -> " + newId);
      fixed++;
    } catch (e) {
      console.error("FAIL: " + p.title.slice(0, 50) + " -- " + e.message);
    }
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log("\n완료: " + fixed + "개 썸네일 교체됨");
}

main().catch(console.error);
