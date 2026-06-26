/**
 * 실행 순서:
 * 1. node test_post.js read   → API 키로 블로그 정보 읽기
 * 2. node test_post.js auth   → OAuth 토큰 발급 (브라우저 필요)
 * 3. node test_post.js write  → 테스트 글 발행
 */
const { getBlogInfo, publishPost } = require("./blogger");
const { getValidToken } = require("./auth");

const mode = process.argv[2] || "read";

async function main() {
  if (mode === "read") {
    console.log("=== 블로그 정보 읽기 (API Key) ===");
    try {
      const blog = await getBlogInfo();
      console.log("✅ 연결 성공!");
      console.log(`   블로그명: ${blog.name}`);
      console.log(`   URL: ${blog.url}`);
      console.log(`   총 글 수: ${blog.posts?.totalItems ?? 0}`);
    } catch (e) {
      console.error("❌ 실패:", e.message);
    }

  } else if (mode === "auth") {
    console.log("=== OAuth 토큰 발급 ===");
    try {
      await getValidToken();
    } catch (e) {
      console.error("❌ 실패:", e.message);
    }

  } else if (mode === "write") {
    console.log("=== 테스트 글 발행 ===");
    try {
      const token = await getValidToken();
      const post = await publishPost({
        title: "5 Smart Ways to Maximize Your Benefits in 2026",
        content: `
<h2>Introduction</h2>
<p>Understanding how to maximize your government and employer benefits can make a significant difference in your financial wellbeing. In this guide, we break down the top 5 strategies that can help you get the most out of every benefit available to you.</p>

<h2>1. Audit Your Current Benefits</h2>
<p>Start by listing every benefit you currently receive — health insurance, retirement contributions, FSA, transit benefits — and check whether you're using them fully.</p>

<h2>2. Maximize HSA Contributions</h2>
<p>Health Savings Accounts (HSAs) offer a triple tax advantage. Contribute the maximum allowed ($4,300 for individuals in 2026) to save on taxes now and in retirement.</p>

<h2>3. Use Government Benefit Finders</h2>
<p>Websites like Benefits.gov let you find federal programs you may qualify for, from housing assistance to childcare subsidies.</p>

<h2>4. Stack Side Income with Benefits</h2>
<p>Many benefits have income thresholds. Structure your side income carefully to avoid losing eligibility for programs like SNAP or Medicaid.</p>

<h2>5. Review Annually</h2>
<p>Benefits change. Set a calendar reminder each November (open enrollment season) to reassess your full benefits picture.</p>

<h2>Conclusion</h2>
<p>Taking a proactive approach to your benefits can unlock thousands of dollars in savings each year. Start with step 1 this week.</p>
        `.trim(),
        labels: ["benefits", "personal finance", "savings", "2026"],
        token
      });
      console.log("✅ 글 발행 성공!");
      console.log(`   제목: ${post.title}`);
      console.log(`   URL: ${post.url}`);
    } catch (e) {
      console.error("❌ 실패:", e.message);
      if (e.body) console.error("   상세:", JSON.stringify(e.body, null, 2));
    }
  }
}

main();
