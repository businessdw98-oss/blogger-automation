/**
 * 로컬 자동 발행 시스템 (트렌드 연동)
 *
 * node auto_publish.js          → 글 1개 발행
 * node auto_publish.js 15       → 글 15개 연속 발행
 * node auto_publish.js --status → 발행 현황 확인
 * node auto_publish.js --trends → 현재 트렌드 미리보기
 */
const { publishPost } = require("./blogger");
const { getValidToken } = require("./auth");
const { pickTopic } = require("./topics");
const { generateContent, img, PEXELS } = require("./generator");
const { getTrendingTopics } = require("./trend_fetcher");
const { buildTrendPost } = require("./content_engine");
const { logPost, getUsedTopicIds, printSummary } = require("./tracker");
const sb = require("./supabase");

// 트렌드 키워드 → Blogger 카테고리 매핑
function detectCategory(title) {
  const t = title.toLowerCase();
  if (/bollywood|celebrity|actor|actress|singer|rapper|idol|kpop|ott|netflix|film|movie|drama|reality tv|influencer|youtube|tiktok|instagram/i.test(t)) return "Entertainment";
  if (/cricket|ipl|nba|nfl|fifa|football|soccer|tennis|golf|athlete|sports|f1|formula|kabaddi|wrestling/i.test(t)) return "Sports";
  if (/food|restaurant|recipe|chef|street food|chai|cooking|diet|meal|eating/i.test(t)) return "Food";
  if (/travel|flight|hotel|trip|vacation|destination|visa|airport|tourism/i.test(t)) return "Travel";
  if (/ai|tech|software|app|startup|gadget|phone|crypto|bitcoin|nft/i.test(t)) return "Tech";
  if (/kitchen|cooking|appliance|mixer|blender|air fryer|microwave|refrigerator|washing machine|vacuum|home|living|bedroom|bathroom|furniture|decor|gadget|product review|best buy/i.test(t)) return "Home & Living";
  if (/aadhaar|pm kisan|yojana|epf|gst|ration|subsidy|scheme|welfare|snap|medicaid|social security|benefit/i.test(t)) return "Government Benefits";
  if (/side hustle|freelance|passive income|earn|make money|income|salary|job|career|business/i.test(t)) return "Side Income";
  return "Finance";
}

const args = process.argv.slice(2);

if (args.includes("--status")) { printSummary(); process.exit(0); }

const COUNT = parseInt(args.find(a => /^\d+$/.test(a))) || 1;
// 10분 간격 (AI 계정 의심 방지)
const DELAY_MS = 10 * 60 * 1000;

// 트렌드 글 비율: 15개 중 8개는 트렌드, 7개는 템플릿
const TREND_RATIO = 0.55;

async function publishTrendPost(token, trend) {
  const { title, content } = buildTrendPost(trend);
  const geo = trend.geo || "US";
  const category = detectCategory(trend.title);
  const labels = [category, "Trending", "2026", geo === "IN" ? "India" : "US", trend.source?.includes("youtube") ? "YouTube Trends" : "News"];

  const post = await publishPost({ title, content, labels, token });
  const entry1 = { topicId: `trend_${trend.title.slice(0, 20).replace(/\s/g, "_")}`, title: post.title, url: post.url, labels, target: geo };
  logPost(entry1);
  sb.logPost(entry1).catch(() => {});
  return post;
}

async function publishTemplatePost(token, topic) {
  if (!topic) {
    const usedIds = getUsedTopicIds(30);
    topic = pickTopic(usedIds);
  }
  const content = generateContent(topic.id, topic.niche);

  const nicheToCategory = {
    entertainment: "Entertainment", sports: "Sports", food: "Food",
    travel: "Travel", benefits: "Government Benefits", income: "Side Income",
    finance: "Finance", tech: "Tech", home: "Home & Living", living: "Home & Living",
    kitchen: "Home & Living", appliance: "Home & Living"
  };
  const category = nicheToCategory[topic.niche] || "Finance";
  const post = await publishPost({
    title: topic.title,
    content: content.trim(),
    labels: [category, topic.target === "IN" ? "India" : topic.target, "2026", ...(topic.keywords?.slice(0, 2) || [])],
    token
  });
  const entry2 = { topicId: topic.id, title: post.title, url: post.url, labels: topic.keywords, target: topic.target };
  logPost(entry2);
  sb.logPost(entry2).catch(() => {});
  return post;
}

async function main() {
  if (args.includes("--trends")) {
    const trends = await getTrendingTopics();
    console.log("\n현재 트렌드 상위 10개:");
    trends.slice(0, 10).forEach((t, i) =>
      console.log(`  ${i + 1}. [${t.geo}] ${t.title} (출처: ${t.source})`)
    );
    return;
  }

  console.log(`=== 자동 발행 시작 (${COUNT}개) ===\n`);
  const token = await getValidToken();

  // 트렌드 미리 수집
  let trends = [];
  try {
    trends = await getTrendingTopics();
    sb.logTrends(trends).catch(() => {});
  } catch (e) { console.log("트렌드 수집 실패, 템플릿만 사용"); }

  const trendCount = Math.round(COUNT * TREND_RATIO);
  const templateCount = COUNT - trendCount;

  // 발행 순서: 트렌드 + 템플릿 섞기
  const queue = [];
  for (let i = 0; i < trendCount && i < trends.length; i++) queue.push({ type: "trend", data: trends[i], idx: i });
  for (let i = 0; i < templateCount + Math.max(0, trendCount - trends.length); i++) queue.push({ type: "template" });

  // 섞기
  for (let i = queue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [queue[i], queue[j]] = [queue[j], queue[i]];
  }

  let success = 0;
  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    try {
      let post;
      if (item.type === "trend") {
        console.log(`📰 [트렌드/${item.data.geo}] ${item.data.title}`);
        post = await publishTrendPost(token, item.data);
      } else {
        const usedIds = getUsedTopicIds(30);
        const topic = pickTopic(usedIds);
        console.log(`📝 [템플릿/${topic.target}] ${topic.title}`);
        post = await publishTemplatePost(token, topic);
      }
      console.log(`   ✅ ${post.url}`);
      success++;
    } catch (e) {
      console.error(`   ❌ 실패: ${e.message}`);
    }

    if (i < queue.length - 1) await new Promise(r => setTimeout(r, DELAY_MS));
  }

  console.log(`\n=== 완료: ${success}/${COUNT}개 ===`);
  printSummary();
}

main().catch(console.error);
