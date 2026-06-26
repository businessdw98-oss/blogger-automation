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
const { getTrendingTopics, trendToTitle, buildTrendContent } = require("./trend_fetcher");
const { logPost, getUsedTopicIds, printSummary } = require("./tracker");
const sb = require("./supabase");

const args = process.argv.slice(2);

if (args.includes("--status")) { printSummary(); process.exit(0); }

const COUNT = parseInt(args.find(a => /^\d+$/.test(a))) || 1;
const DELAY_MS = 6000;

// 트렌드 글 비율: 15개 중 8개는 트렌드, 7개는 템플릿
const TREND_RATIO = 0.55;

async function publishTrendPost(token, trend, templateIdx) {
  const title = trendToTitle(trend, templateIdx);
  const content = buildTrendContent(trend, img, null, null);
  const geo = trend.geo || "US";
  const labels = [trend.title, "trending", "2026", geo === "IN" ? "India" : "finance", "money"];

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

  const post = await publishPost({
    title: topic.title,
    content: content.trim(),
    labels: [...(topic.keywords || []), topic.niche, topic.target, "2026"],
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
        post = await publishTrendPost(token, item.data, item.idx);
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
