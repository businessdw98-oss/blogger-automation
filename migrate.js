// 기존 performance.json → Supabase 마이그레이션 + 연결 테스트
const fs = require("fs");
const path = require("path");
const sb = require("./supabase");

async function main() {
  console.log("Supabase 연결 테스트...");

  // 테스트: 빈 조회
  try {
    const result = await sb.getPostStats();
    console.log("✅ Supabase 연결 성공!");
  } catch (e) {
    console.error("❌ 연결 실패:", e.message);
    return;
  }

  // performance.json 마이그레이션
  const logPath = path.join(__dirname, "performance.json");
  if (!fs.existsSync(logPath)) {
    console.log("performance.json 없음 — 마이그레이션 건너뜀");
    return;
  }

  const data = JSON.parse(fs.readFileSync(logPath, "utf8"));
  const posts = data.posts || [];

  if (!posts.length) { console.log("마이그레이션할 글 없음"); return; }

  console.log(`\n기존 글 ${posts.length}개 Supabase에 저장 중...`);
  let ok = 0;
  for (const p of posts) {
    try {
      await sb.logPost({
        topicId: p.topicId,
        title:   p.title,
        url:     p.url,
        target:  p.target,
        labels:  p.labels || []
      });
      console.log(`  ✅ ${p.title?.slice(0, 50)}`);
      ok++;
    } catch (e) {
      console.error(`  ❌ 실패: ${e.message}`);
    }
  }

  // 오늘 날짜 전략 노트 저장
  await sb.saveStrategy({
    analysis: "Day 1: Blog launched. 7 posts published. 0 views — Google indexing pending. Topics: finance, benefits, AI income, India Aadhaar, side hustles.",
    recommendations: "1. Submit sitemap to Google Search Console. 2. Connect AdSense. 3. Expand to entertainment/sports/food topics. 4. Target India for volume traffic, US/UK for high CPC revenue.",
    topTopics: ["side_hustle", "india_benefits", "ai_income", "celebrity_money", "sports_salary"],
    viewsTotal: 0,
    postsTotal: posts.length
  });

  console.log(`\n✅ 마이그레이션 완료: ${ok}/${posts.length}개`);
  console.log("✅ 초기 전략 노트 저장됨");
}

main().catch(console.error);
