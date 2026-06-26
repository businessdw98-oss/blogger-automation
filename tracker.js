const fs = require("fs");
const path = require("path");

const LOG_PATH = path.join(__dirname, "performance.json");

function load() {
  if (!fs.existsSync(LOG_PATH)) return { posts: [], topicPerformance: {} };
  try { return JSON.parse(fs.readFileSync(LOG_PATH, "utf8")); }
  catch { return { posts: [], topicPerformance: {} }; }
}

function save(data) {
  fs.writeFileSync(LOG_PATH, JSON.stringify(data, null, 2));
}

function logPost({ topicId, title, url, labels, target }) {
  const data = load();
  const entry = {
    topicId, title, url, labels, target,
    publishedAt: new Date().toISOString(),
    views: 0, clicks: 0, estimatedRevenue: 0
  };
  data.posts.push(entry);
  if (!data.topicPerformance[topicId]) {
    data.topicPerformance[topicId] = { count: 0, totalViews: 0, totalClicks: 0 };
  }
  data.topicPerformance[topicId].count++;
  save(data);
  return entry;
}

function getUsedTopicIds(days = 30) {
  const data = load();
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return data.posts
    .filter(p => new Date(p.publishedAt) > cutoff)
    .map(p => p.topicId);
}

function getTopPerformers() {
  const data = load();
  return Object.entries(data.topicPerformance)
    .sort((a, b) => (b[1].totalViews + b[1].totalClicks * 10) - (a[1].totalViews + a[1].totalClicks * 10))
    .slice(0, 5)
    .map(([id, stats]) => ({ id, ...stats }));
}

function printSummary() {
  const data = load();
  console.log(`\n=== 발행 현황 ===`);
  console.log(`총 발행 글: ${data.posts.length}개`);
  console.log(`\n최근 5개:`);
  data.posts.slice(-5).reverse().forEach(p => {
    console.log(`  [${p.target}] ${p.title.slice(0, 60)}...`);
    console.log(`         ${p.url}`);
  });
  const top = getTopPerformers();
  if (top.length) {
    console.log(`\n인기 주제:`);
    top.forEach(t => console.log(`  ${t.id}: ${t.count}회 발행`));
  }
}

module.exports = { logPost, getUsedTopicIds, getTopPerformers, printSummary };
