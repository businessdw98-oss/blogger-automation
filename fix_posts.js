/**
 * 발행된 글 문제 수정
 * - 깨진 제목 수정 (템플릿 wrapping 아티팩트 제거)
 * - 중복 글 삭제
 * - 미국/인도 컨텍스트 없는 정책 글 보강
 * - 소스명(thepennyhoarder.com, Center on Budget 등) 제목에서 제거
 * node fix_posts.js
 */
const https = require("https");
const { getValidToken } = require("./auth");
const { listPosts, updatePost } = require("./blogger");
const { loadEnv } = require("./auth");

function apiDelete(postId, token) {
  return new Promise((resolve, reject) => {
    const env = loadEnv();
    const options = {
      hostname: "www.googleapis.com",
      path: `/blogger/v3/blogs/${env.BLOG_ID}/posts/${postId}`,
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    };
    const req = https.request(options, res => {
      let raw = "";
      res.on("data", d => (raw += d));
      res.on("end", () => {
        if (res.statusCode === 204 || res.statusCode === 200) resolve({ ok: true });
        else reject(new Error(`HTTP ${res.statusCode}: ${raw}`));
      });
    });
    req.on("error", reject);
    req.end();
  });
}

function apiGet(postId, token) {
  return new Promise((resolve, reject) => {
    const env = loadEnv();
    const options = {
      hostname: "www.googleapis.com",
      path: `/blogger/v3/blogs/${env.BLOG_ID}/posts/${postId}`,
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    };
    https.get({ ...options }, res => {
      let raw = "";
      res.on("data", d => (raw += d));
      res.on("end", () => {
        try { resolve(JSON.parse(raw)); }
        catch { reject(new Error(raw)); }
      });
    }).on("error", reject);
  });
}

// 유명인 이혼 글용 개선된 컨텐츠 (차트 이미지 → 연예 이미지)
function buildCelebrityDivorceContent() {
  return `
<img src="https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="celebrity couple red carpet" style="width:100%;border-radius:8px;margin-bottom:24px" loading="lazy"/>

<p>Celebrity divorces are messy, public — and absolutely eye-opening when it comes to money. We're talking settlements that dwarf what most of us will earn in a lifetime. But beyond the tabloid drama, there's a surprisingly useful financial lesson hiding in each split.</p>

<p><strong>Here's a breakdown of the biggest celebrity divorces of 2026 by the numbers — and what they actually reveal about protecting your own assets.</strong></p>

<hr style="border:none;border-top:2px solid #f0f0f0;margin:28px 0"/>

<h2>Why Celebrity Divorces Are the Best (and Worst) Money Lessons</h2>
<img src="https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800" alt="celebrity lifestyle wealth" style="width:100%;border-radius:8px;margin:16px 0" loading="lazy"/>
<p>Most people without a prenup lose far more than they expect in a divorce. Celebrities just do it in public, with lawyers billing $1,000/hour and settlements filed in court records anyone can read.</p>
<p>The patterns that show up repeatedly — <u>hidden assets, informal business partnerships, social media income that wasn't declared</u> — are the same ones that hit regular couples hard. Just with fewer zeros.</p>

<hr style="border:none;border-top:2px solid #f0f0f0;margin:28px 0"/>

<h2>The Biggest Splits of 2026 (By Settlement Size)</h2>
<img src="https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=800" alt="entertainment industry money" style="width:100%;border-radius:8px;margin:16px 0" loading="lazy"/>

<p>Celebrity divorces in 2026 have hit new highs partly because influencer and streaming income is harder to value — and courts are still figuring out how to split it fairly.</p>

<ul>
<li><strong>The "I didn't know about that account" problem:</strong> Multiple high-profile cases this year have involved undisclosed cryptocurrency wallets or LLC-held assets that one partner claimed to not know existed</li>
<li><u>Social media following as marital property:</u> Some courts are now treating verified accounts built during a marriage as jointly-owned assets — a genuinely new legal frontier</li>
<li><strong>Real estate caught in the middle:</strong> Properties purchased at 2020–2022 prices that are now worth significantly less are creating disputes about who owes what if values have dropped</li>
</ul>

<hr style="border:none;border-top:2px solid #f0f0f0;margin:28px 0"/>

<h2>3 Financial Lessons That Actually Apply to You</h2>
<ol>
<li><strong>Know what you own — together and separately.</strong> Married or not, both partners should have full visibility into accounts, investments, and debts. No exceptions.</li>
<li><u>Protect the income streams you built before the relationship.</u> Freelance businesses, content channels, and IP created before marriage often have murky ownership in the absence of clear documentation.</li>
<li><strong>A prenup isn't pessimistic — it's honest.</strong> Modern prenups often include social media income clauses, business valuation formulas, and "sunset" provisions that dissolve them after a set number of years. They're a conversation, not a red flag.</li>
</ol>

<hr style="border:none;border-top:2px solid #f0f0f0;margin:28px 0"/>

<h2>What Happens to Kids, Homes, and Business Interests</h2>
<img src="https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg?auto=compress&cs=tinysrgb&w=800" alt="family and career separation" style="width:100%;border-radius:8px;margin:16px 0" loading="lazy"/>
<p>The messiest parts of celebrity divorces are rarely the cash — it's the ongoing businesses, the co-managed brands, and the kids whose college funds are caught in limbo.</p>
<p>For regular families, the equivalent is: who owns the LLC you started together? Who gets custody of the business's client list? These questions need answers <em>before</em> things go sideways.</p>

<h2>Frequently Asked Questions</h2>
<div style="background:#f8f9fa;border-radius:8px;padding:20px;margin:16px 0">
<p><strong>Q: Are social media accounts really being divided in divorces?</strong><br/>In some jurisdictions, yes — especially if the account was monetized during the marriage. Courts are still inconsistent on this, but it's worth knowing.</p>
<p><strong>Q: How are influencer income streams valued during divorce?</strong><br/>Usually based on a 2–3 year average of earnings. Brand deal income, YouTube revenue, and Patreon subscribers have all been subject to valuation in recent cases.</p>
<p><strong>Q: What's the most common mistake couples make with joint finances?</strong><br/>Not documenting who contributed what to major purchases or investments. A simple shared spreadsheet would prevent a lot of disputes.</p>
</div>

<div style="background:#fff3cd;border-left:4px solid #ffc107;padding:16px 20px;margin:28px 0;border-radius:4px">
<strong>Follow the money:</strong> We track celebrity finance news weekly — not for the gossip, but for what it reveals about money, relationships, and protecting what you've built. Bookmark us.
</div>
`.trim();
}

// 미국 공화당 SNAP/식품지원 글 → US 컨텍스트 명확화
function buildUSSnapPolicyContent(isTracker = false) {
  if (isTracker) {
    return `
<img src="https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="SNAP food assistance America" style="width:100%;border-radius:8px;margin-bottom:24px" loading="lazy"/>

<p><strong>Real Americans are losing SNAP food benefits right now.</strong> Not theoretically — in practice, across dozens of states, as the Republican-backed budget bill begins to be implemented. Here's who's being cut, what the actual numbers look like, and what you should do if you or someone you know is at risk.</p>

<hr style="border:none;border-top:2px solid #f0f0f0;margin:28px 0"/>

<h2>What's Happening to SNAP in America Right Now</h2>
<img src="https://images.pexels.com/photos/5699516/pexels-photo-5699516.jpeg?auto=compress&cs=tinysrgb&w=800" alt="food bank grocery assistance" style="width:100%;border-radius:8px;margin:16px 0" loading="lazy"/>
<p>SNAP (Supplemental Nutrition Assistance Program) — what most Americans call food stamps — is being actively reduced under recent federal legislation. The Republican budget bill includes:</p>
<ul>
<li><strong>Expanded work requirements</strong> — more adults ages 18–54 must now prove employment or training hours to maintain eligibility</li>
<li><u>Reduced state flexibility:</u> States previously had options to waive requirements in high-unemployment areas. Many of those waivers are being eliminated.</li>
<li><strong>Administrative timelines tightened:</strong> The window for re-certification has been shortened, meaning more people are falling off the rolls not because they're ineligible but because paperwork didn't get processed in time</li>
</ul>
<p>According to the Center on Budget and Policy Priorities, <u>millions of Americans stand to lose or see reduced SNAP benefits</u> over the next 12–24 months as these changes roll out state by state.</p>

<hr style="border:none;border-top:2px solid #f0f0f0;margin:28px 0"/>

<h2>Who's Most at Risk of Losing SNAP Right Now</h2>
<img src="https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=800" alt="American families budget crisis" style="width:100%;border-radius:8px;margin:16px 0" loading="lazy"/>
<ul>
<li><strong>Adults 18–54 without documented work hours</strong> (including caregivers who are not recognized as "working" under the new rules)</li>
<li><u>People in states with high unemployment</u> who previously had work requirement waivers</li>
<li><strong>Households where only one adult works</strong> but both are of working age</li>
<li><u>College students</u> who were approved under COVID-era expanded eligibility</li>
<li><strong>Anyone who missed a re-certification notice</strong> — administrative terminations are rising</li>
</ul>

<hr style="border:none;border-top:2px solid #f0f0f0;margin:28px 0"/>

<h2>Exactly What to Do If Your Benefits Are at Risk</h2>
<ol>
<li><strong>Log into your state SNAP portal today</strong> — check your case status and re-certification deadline. Don't wait for a letter.</li>
<li><u>Document your work or training hours</u> — even if you're exempt, having documentation ready protects you if there's a dispute</li>
<li><strong>If you receive a termination notice: appeal immediately.</strong> You typically have 30–90 days to file a fair hearing. Benefits can continue during the appeal process if you file fast enough.</li>
<li><u>Contact your local food bank</u> — most have case workers who can help you navigate SNAP paperwork and connect you with bridge resources while you appeal</li>
<li><strong>Check for other programs</strong> at benefits.gov — WIC, free school meals, and TEFAP are separate from SNAP and may still be available</li>
</ol>

<hr style="border:none;border-top:2px solid #f0f0f0;margin:28px 0"/>

<h2>The Political Picture — Without the Spin</h2>
<p>Republicans say the work requirements are designed to move people toward self-sufficiency and reduce long-term dependency. Democrats argue the cuts are targeting people who are already working but can't meet the new administrative requirements. <strong>The data will show which side is right over the next 12–24 months — but in the meantime, real families are being affected.</strong></p>
<p>Regardless of your politics: if you or someone you know depends on SNAP, understanding the specific changes in your state is not optional. This isn't political — it's a grocery bill.</p>

<h2>Frequently Asked Questions</h2>
<div style="background:#f8f9fa;border-radius:8px;padding:20px;margin:16px 0">
<p><strong>Q: Are SNAP cuts already happening or just proposed?</strong><br/>They are actively being implemented. The federal bill has passed and states are beginning enforcement. Timeline varies by state.</p>
<p><strong>Q: What if I lose SNAP but still qualify under the old rules?</strong><br/>File an appeal. Many terminations under the new rules are being overturned at the fair hearing stage, especially for caregivers and people in waiver states.</p>
<p><strong>Q: Where can I find my state's specific SNAP rules?</strong><br/>Visit your state's SNAP portal directly (search "[your state] SNAP benefits portal") or call 1-800-221-5689 for general guidance.</p>
</div>

<div style="background:#fff3cd;border-left:4px solid #ffc107;padding:16px 20px;margin:28px 0;border-radius:4px">
<strong>Stay updated:</strong> We're tracking SNAP and government benefit changes weekly as they roll out state by state. Bookmark this page — this situation is changing fast.
</div>
`.trim();
  }

  // Republican bill post
  return `
<img src="https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="US government food assistance cuts" style="width:100%;border-radius:8px;margin-bottom:24px" loading="lazy"/>

<p><strong>The US Republican Party just advanced a federal budget bill that directly cuts food assistance for millions of American women, children, and rural communities.</strong> This isn't a proposal — it passed committee and is moving forward. Here's what's actually in it, who gets hurt, and what you can do right now.</p>

<hr style="border:none;border-top:2px solid #f0f0f0;margin:28px 0"/>

<h2>What the US Republican Bill Actually Does to Food Assistance</h2>
<img src="https://images.pexels.com/photos/5699516/pexels-photo-5699516.jpeg?auto=compress&cs=tinysrgb&w=800" alt="food assistance America families" style="width:100%;border-radius:8px;margin:16px 0" loading="lazy"/>
<p>The bill targets two major programs:</p>
<ul>
<li><strong>WIC (Women, Infants, and Children):</strong> Proposed cuts would eliminate or significantly reduce food vouchers for pregnant women, new mothers, and children under age 5. WIC currently serves about 6.5 million Americans per month.</li>
<li><u>SNAP (Food Stamps):</u> Additional work requirements and reduced state flexibility, expected to result in 10–15 million fewer recipients over the next decade per Congressional Budget Office projections</li>
<li><strong>Rural Community Development Grants:</strong> $800M+ in cuts to programs that fund rural food banks, nutrition programs, and agricultural community development</li>
</ul>

<hr style="border:none;border-top:2px solid #f0f0f0;margin:28px 0"/>

<h2>Who This Hurts Most in America</h2>
<img src="https://images.pexels.com/photos/4473871/pexels-photo-4473871.jpeg?auto=compress&cs=tinysrgb&w=800" alt="American families affected" style="width:100%;border-radius:8px;margin:16px 0" loading="lazy"/>
<ul>
<li><strong>Pregnant women and new mothers</strong> on WIC — especially in rural states where grocery access is already limited</li>
<li><u>Children under 5</u> enrolled in WIC for formula, cereal, milk, and produce vouchers</li>
<li><strong>Rural communities</strong> — these cuts disproportionately hit red-state rural districts, even though Republican legislators voted for them</li>
<li><u>Low-income working families</u> who barely meet income thresholds and would lose eligibility under new rules</li>
</ul>

<hr style="border:none;border-top:2px solid #f0f0f0;margin:28px 0"/>

<h2>What to Do If You're Affected</h2>
<ol>
<li><strong>Check your current WIC or SNAP status</strong> — log into your state's benefits portal now, before cuts take effect</li>
<li><u>Call your local WIC clinic</u> — they have the most current information about when changes will hit in your specific area</li>
<li><strong>Contact your Congressional representatives</strong> — this bill is not yet law. Constituent calls actually do affect votes, particularly for representatives in competitive districts.</li>
<li><u>Connect with local food resources</u> — foodpantries.org and feedingamerica.org can locate emergency food near you if WIC/SNAP is disrupted</li>
<li><strong>Document everything:</strong> If your benefits are cut and you believe you still qualify, you have the right to a fair hearing. Keep copies of all notices.</li>
</ol>

<hr style="border:none;border-top:2px solid #f0f0f0;margin:28px 0"/>

<h2>The Bigger Picture</h2>
<p>The Republican Party argues these cuts will reduce federal deficits and encourage workforce participation. Critics — including the American Academy of Pediatrics and hundreds of anti-hunger organizations — say cutting WIC and rural nutrition programs harms the most vulnerable Americans while producing minimal budget savings relative to the harm caused.</p>
<p><strong>What's not in dispute: real families will have less food money in the near future if this bill becomes law.</strong></p>

<h2>Frequently Asked Questions</h2>
<div style="background:#f8f9fa;border-radius:8px;padding:20px;margin:16px 0">
<p><strong>Q: Has this US bill actually passed into law?</strong><br/>As of mid-2026, the bill advanced through committee. Check current news for final status — but regardless, preparation now is wise.</p>
<p><strong>Q: Will WIC cuts be immediate?</strong><br/>Most program cuts phase in over 6–18 months. But applications for new participants may be affected sooner.</p>
<p><strong>Q: What if I lose WIC but still have young children?</strong><br/>Contact your local food bank immediately. Most have dedicated programs for infants and young children that operate independently of federal WIC funding.</p>
</div>

<div style="background:#fff3cd;border-left:4px solid #ffc107;padding:16px 20px;margin:28px 0;border-radius:4px">
<strong>We're watching this:</strong> This is a developing situation. Bookmark this page — we'll update as the bill progresses and states begin implementation.
</div>
`.trim();
}

async function main() {
  const token = await getValidToken();
  const data = await listPosts(token, 50);
  const posts = data.items || [];

  console.log(`총 ${posts.length}개 발행됨\n`);

  // 1. 중복 삭제 (ID 625008088965603470 - "What 5 Most Popular..." 중복)
  const toDelete = [
    { id: "625008088965603470", reason: "Post 1번의 중복 (같은 제목)" },
    { id: "262658379313500178", reason: "Post 9번의 중복 (Side Hustle Statistics 중복)" },
  ];

  for (const d of toDelete) {
    try {
      await apiDelete(d.id, token);
      console.log(`🗑️  삭제: ${d.id} — ${d.reason}`);
    } catch (e) {
      console.error(`❌ 삭제 실패 ${d.id}: ${e.message}`);
    }
  }

  // 2. 제목/콘텐츠 수정할 글들
  const fixes = [
    {
      id: "2897507205057945131",
      newTitle: "The 5 Most Popular Side Hustles in 2026 — And Which One Is Actually Worth Your Time",
      reason: "깨진 템플릿 제목 수정"
    },
    {
      id: "3902034624046294124",
      newTitle: "The Fastest-Growing Side Hustles of 2026: Real Income Data vs. the Hype",
      reason: "템플릿 아티팩트 + 소스명 제거"
    },
    {
      id: "9183004454180832354",
      newTitle: "US Republicans Just Advanced a Bill to Cut Food Assistance for Women, Children & Rural America",
      newContent: buildUSSnapPolicyContent(false),
      reason: "미국 컨텍스트 없음 + 후킹 없음"
    },
    {
      id: "8043200425857775240",
      newTitle: "SNAP Cuts Are Real: Millions of Americans Are Already Losing Food Assistance",
      newContent: buildUSSnapPolicyContent(true),
      reason: "소스명 제거 + 미국 컨텍스트 + 후킹"
    },
    {
      id: "8780472565502439238",
      newTitle: "This American Makes $1,000+/Month From 4 Side Gigs — Here's Exactly What She Does",
      reason: "뉴스 기사 헤드라인 그대로 + 소스명 제거"
    },
    {
      id: "5132202186856075820",
      newTitle: "53% of Americans Now Rely on Side Income: What That Tells Us About the 2026 Economy",
      reason: "'Is' 접두사 + 소스명 제거"
    },
    {
      id: "8670156523813010141",
      newTitle: "The Most Expensive Celebrity Divorces of 2026: What the Money Tells Us",
      newContent: buildCelebrityDivorceContent(),
      reason: "차트 이미지 → 연예계 이미지로 교체 + 콘텐츠 보강"
    },
  ];

  for (const fix of fixes) {
    try {
      // 현재 글 가져오기
      const current = await apiGet(fix.id, token);
      const updated = {
        id: fix.id,
        title: fix.newTitle,
        content: fix.newContent || current.content,
        labels: current.labels || [],
        token
      };
      await updatePost(updated);
      console.log(`✅ 수정: "${fix.newTitle.slice(0, 70)}"`);
      console.log(`   이유: ${fix.reason}`);
    } catch (e) {
      console.error(`❌ 수정 실패 ${fix.id}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log("\n✅ 모든 수정 완료");
}

main().catch(console.error);
