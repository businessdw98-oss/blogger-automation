// 트렌드 기사를 실제 독자를 위한 콘텐츠로 변환
// 국가 맥락 명시 + 훅킹 제목 + 인간적 톤 + 실제 뉴스 이미지

const https = require("https");
const { getImg, resetImageTracker } = require("./images");

// 뉴스 기사 og:image 추출 (유명인/정치인/장소 관련 글에서 실제 사진 사용)
async function fetchNewsImage(articleUrl) {
  if (!articleUrl) return null;
  try {
    // Google News redirect URL → 실제 기사 URL 추출 시도 불가 (HTTPS redirect)
    // 대신 Google News thumbnail 추출: RSS enclosure나 media:content 시도
    return null;
  } catch {
    return null;
  }
}

// 이미지 태그 + 출처 표기
function imgWithAttrib(url, alt, sourceName, sourceUrl) {
  const attrib = sourceName
    ? `<p style="font-size:11px;color:#888;margin-top:-8px;margin-bottom:16px">📷 Image: ${sourceUrl ? `<a href="${sourceUrl}" target="_blank" rel="noopener">${sourceName}</a>` : sourceName}</p>`
    : "";
  return `<img src="${url}?auto=compress&cs=tinysrgb&w=1200" alt="${alt}" style="width:100%;border-radius:8px;margin:16px 0" loading="lazy"/>${attrib}`;
}

// 뉴스 헤드라인 → 블로그 제목 (훅 강화)
function makeTitle(trend) {
  const raw = trend.title
    .replace(/\s*[-–|]\s*(BBC|CNN|Reuters|AP News|Forbes|CNBC|Bloomberg|NYT|Guardian|Business Insider|inc\.com|thepennyhoarder\.com|House\.gov|Center on Budget.*|Kiowa.*|New Jersey.*)$/i, "")
    .replace(/\s*:\s*(BBC|CNN|Reuters|Forbes|Bloomberg).*/i, "")
    .trim();

  const geo = trend.geo || "US";
  const country = geo === "IN" ? "India" : "America";
  const t = raw;

  // 정치/정책 뉴스 → 독자 영향 중심 제목
  if (/republican|democrat|congress|senate|bill|cut|government|policy|federal|modi|parliament/i.test(t)) {
    const hooks = [
      `${country}: ${t} — What It Means for Your Money Right Now`,
      `If You Rely on Government Benefits in ${country}, Read This Now`,
      `${t}: Who Gets Hurt and What You Can Do About It`,
      `${country}'s Latest Policy Shift Could Hit Your Wallet — Here's How`,
    ];
    return hooks[Math.floor(Math.random() * hooks.length)];
  }

  // 경제/급여 뉴스
  if (/salary|income|earn|pay|wage|job|layoff|hire|unemploy/i.test(t)) {
    const hooks = [
      `${t} — What the Numbers Actually Mean for Workers Like You`,
      `Real Talk: ${t}`,
      `${t} (And How to Use This to Your Advantage)`,
    ];
    return hooks[Math.floor(Math.random() * hooks.length)];
  }

  // 제품/리뷰
  if (/best|review|vs|worth|buy|smartphone|laptop|gadget|appliance/i.test(t)) {
    return `${t} — Honest Take Before You Buy`;
  }

  // 셀럽/엔터테인먼트
  if (/celebrity|actor|actress|singer|bollywood|net worth|divorce/i.test(t)) {
    return `${t}: The Money Side Nobody's Talking About`;
  }

  // 사이드 허슬/수익
  if (/side hustle|hustle|passive income|make money|earn/i.test(t)) {
    return `${t} — Is It Actually Real? We Break It Down`;
  }

  // 기본: 연도 + 지역 추가
  return `${t} (${country}, ${new Date().getFullYear()}: What You Need to Know)`;
}

// 주제 유형 감지
function detectType(title, geo) {
  const t = title.toLowerCase();
  if (/republican|democrat|congress|senate|bill|cut|welfare|snap|medicaid|modi|parliament|yojana|scheme/i.test(t)) return "policy";
  if (/salary|earn|income|pay|wage|job|layoff|hire/i.test(t)) return "salary";
  if (/celebrity|actor|actress|singer|net worth|divorce|bollywood|influencer/i.test(t)) return "celebrity";
  if (/side hustle|passive income|make money|freelance/i.test(t)) return "hustle";
  if (/best|review|vs|worth|buy|smartphone|laptop|gadget|air fryer|mixer/i.test(t)) return "product";
  if (/recession|inflation|economy|market|crash|stock/i.test(t)) return "economy";
  return "general";
}

function hr() { return `<hr style="border:none;border-top:2px solid #f0f0f0;margin:32px 0"/>`; }

function faq(items) {
  return `
<h2>Frequently Asked Questions</h2>
<div style="background:#f8f9fa;border-radius:8px;padding:20px;margin:16px 0">
${items.map(({ q, a }) => `<p><strong>Q: ${q}</strong><br/>${a}</p>`).join("\n")}
</div>`;
}

// 정책/정치 뉴스 → 독자 관점 글
function buildPolicyPost(trend, cleanTitle) {
  const geo = trend.geo || "US";
  const isUS = geo !== "IN";
  const country = isUS ? "America" : "India";
  const currency = isUS ? "$" : "₹";
  const benefits = isUS ? "SNAP, Medicaid, or Social Security" : "PM Kisan, PDS rations, or EPF";
  const action = isUS ? "benefits.gov" : "myscheme.gov.in";

  resetImageTracker();

  return `
${getImg("benefits", `${cleanTitle}`, "100%", "1200")}

<p>Look, political news is exhausting. But when a new bill or policy directly affects whether money shows up in your account — or food on your table — it's worth 5 minutes of your time. <strong>Here's the plain-English breakdown of what's happening, who it affects, and what (if anything) you should do right now.</strong></p>

${hr()}

<h2>What's Actually Happening (No Spin)</h2>
<p>The recent changes around <em>${trend.title.replace(/\s*[-–|].*$/, "").trim()}</em> in ${country} are creating real uncertainty for millions of households. The headline sounds political. The reality is financial.</p>
<p>Here's what the proposals or changes on the table actually involve — stripped of the partisan framing:</p>
<ul>
<li>Eligibility rules for some government programs may be changing</li>
<li>Work requirements are being expanded or modified in some areas</li>
<li>Budget allocations to certain benefit categories are under review</li>
</ul>

${hr()}

<h2>Who's Actually Affected — Be Honest With Yourself</h2>
${getImg("family", "families affected by benefit changes", "100%", "800")}
<p>You're most exposed if:</p>
<ul>
<li>You or someone in your household receives ${benefits}</li>
<li>Your income sits right at the eligibility threshold (changes here matter most)</li>
<li>You're between jobs, caregiving, or have a disability that limits work hours</li>
<li>You live in a state/district that tends to implement federal changes quickly</li>
</ul>
<p>If none of those apply? <u>Watch, but don't panic.</u> Most policy changes phase in over 12–24 months with transition provisions.</p>

${hr()}

<h2>The 3 Things to Actually Do Right Now</h2>
<ol>
<li><strong>Check your current enrollment status</strong> — log into your state's benefits portal or visit ${action} to confirm you're still listed as active and eligible under current rules</li>
<li><strong>Know your appeal rights</strong> — if you receive a termination or reduction notice, you almost always have 30–90 days to file a fair hearing appeal. Don't miss that window.</li>
<li><strong>Build a small buffer — even ${currency}500 in savings</strong> changes everything when there's uncertainty. Even if benefits aren't cut for you, a cash cushion means you're not scrambling</li>
</ol>

${hr()}

<h2>The Bigger Picture</h2>
<p>Policies change. Benefits get cut, expanded, then cut again. <strong>The households that weather these shifts best aren't the ones who predicted the policy correctly — they're the ones who had a backup plan.</strong></p>
<p>That means: a small emergency fund, at least one other income source (even part-time), and knowing what other programs you'd qualify for if your current benefits changed.</p>
<p>It's not about politics. It's about not being caught off guard.</p>

${faq([
  { q: `Will my ${isUS ? "SNAP/Medicaid" : "PDS/PM Kisan"} benefits actually be cut?`, a: "Most proposals involve changes to eligibility rules, not immediate cuts for current recipients. But check your state or district's implementation timeline — it varies significantly." },
  { q: "What if I get a termination notice?", a: "Don't ignore it. File a fair hearing appeal immediately (usually within 30–90 days). Many terminations are reversed on appeal, especially if you continue to meet original criteria." },
  { q: "What other programs might I qualify for?", a: `Visit ${action} and run the full eligibility check. Most people qualify for 2–3 programs they've never applied for.` },
])}

<div style="background:#fff3cd;border-left:4px solid #ffc107;padding:16px 20px;margin:28px 0;border-radius:4px">
<strong>Bookmark this page</strong> — we're tracking benefit policy changes weekly so you don't have to wade through political noise to find out what actually matters for your household.
</div>
`.trim();
}

// 사이드허슬/수익 뉴스
function buildHustlePost(trend, cleanTitle) {
  const geo = trend.geo || "US";
  const currency = geo === "IN" ? "₹" : "$";
  const amount = geo === "IN" ? "₹20,000–₹50,000" : "$500–$2,000";

  resetImageTracker();

  return `
${getImg("income", cleanTitle, "100%", "1200")}

<p>Every week there's a new story about someone making bank from a side hustle. Some of them are real. Some are heavily exaggerated. And some are technically true but leave out the part where it took 3 years and ${currency}10,000 upfront to get there.</p>
<p><strong>So let's actually dig into this one — what's real, what's not, and whether it's worth your time.</strong></p>

${hr()}

<h2>The Claim vs. The Reality</h2>
${getImg("laptop", "side hustle income reality check", "100%", "800")}
<p>The headline says <em>${trend.title.replace(/\s*[-–|].*$/, "").trim()}</em>. Here's how to read that honestly:</p>
<ul>
<li><strong>The best-case scenario</strong> is usually what gets reported. The median earner does significantly less.</li>
<li>Most side hustles take 2–6 months to generate meaningful income — it's rarely instant</li>
<li><u>Time cost matters.</u> ${amount}/month sounds good until you realize it took 40 hours/week to generate it</li>
</ul>
<p>None of that means it's not worth it. It just means you need to go in with realistic expectations.</p>

${hr()}

<h2>Which People Actually Succeed With This</h2>
<p>Looking at who consistently does well with this type of hustle, a few patterns show up:</p>
<ul>
<li>People who treat it like a business from week 1 (tracking income, reinvesting, showing up consistently)</li>
<li>Those who already have a related skill — even a soft one like writing, organizing, or talking to people</li>
<li><u>Anyone willing to be bad at it for 90 days</u> before expecting results</li>
</ul>
<p>The people who quit? Usually give up at the 3–6 week mark, right before things start working.</p>

${hr()}

<h2>How to Start This Week (Not "Someday")</h2>
<ol>
<li><strong>Spend 2 hours this weekend</strong> just researching — not buying courses, not setting up websites. Just understanding what the actual first step looks like</li>
<li><strong>Set a 90-day test:</strong> commit to 5 hours/week for 90 days. If you're not making progress by then, it's the wrong fit</li>
<li><u>Tell someone.</u> Accountability increases follow-through rates dramatically</li>
<li><strong>Start free</strong> — almost every legitimate side hustle has a free entry point. Avoid anything requiring significant upfront investment</li>
</ol>

${hr()}

<h2>The Honest Bottom Line</h2>
<p>Could you make ${amount}/month from this? Genuinely, yes — if you pick a real approach, stay consistent, and don't quit when it's slow. <strong>Most people won't do that. The ones who do tend to actually get there.</strong></p>
<p>The question isn't whether it's possible. It's whether you'll actually do the unglamorous work for 90 days to find out.</p>

${faq([
  { q: "How long before I make real money?", a: `Realistically: ${currency}100–${currency}300/month within 60 days if you're consistent. ${amount}/month is more like a 6–12 month target.` },
  { q: "Do I need to pay tax on side hustle income?", a: geo === "IN" ? "Yes — income above ₹2.5L/year from all sources (including side income) is taxable. Keep records from day one." : "Yes — any self-employment income over $400/year needs to be reported. Set aside 25–30% for taxes." },
  { q: "What's the biggest mistake beginners make?", a: "Jumping between methods. Pick one thing, do it for 90 days, then evaluate. Switching every 2 weeks is a guaranteed way to stay at zero." },
])}

<div style="background:#f0f7ff;border-left:4px solid #1a73e8;padding:16px 20px;margin:28px 0;border-radius:4px">
<strong>More on this:</strong> We cover side income, money tips, and financial shortcuts weekly — without the hype. Bookmark us or subscribe to stay updated.
</div>
`.trim();
}

// 경제/시장 뉴스
function buildEconomyPost(trend, cleanTitle) {
  const geo = trend.geo || "US";
  const currency = geo === "IN" ? "₹" : "$";
  const country = geo === "IN" ? "India" : "the US";

  resetImageTracker();

  return `
${getImg("finance", cleanTitle, "100%", "1200")}

<p>There's a lot of noise right now about the economy. Recession fears. Inflation. Market swings. <strong>But what does any of this actually mean for you — someone with bills, maybe some savings, possibly a job that feels less secure than it did a year ago?</strong></p>
<p>Let's cut through the headlines.</p>

${hr()}

<h2>What the Data Is Actually Saying</h2>
${getImg("money", "economic indicators explained simply", "100%", "800")}
<p>When you see headlines about economic uncertainty, they're usually tracking a few specific signals:</p>
<ul>
<li><strong>Job numbers:</strong> Still mixed in ${country} — hiring has slowed in some sectors, stayed strong in others (healthcare, government, skilled trades)</li>
<li><u>Consumer spending:</u> Dipping on discretionary items, holding steady on necessities</li>
<li><strong>Interest rates:</strong> Still elevated, which hits anyone with variable-rate debt or a mortgage</li>
<li><u>Inflation:</u> Down from peak, but grocery and housing costs remain stubbornly high for most households</li>
</ul>
<p>Translation: <em>things are uneven, not collapsed.</em> Some people are doing fine. Others are stretched. The difference often comes down to preparation.</p>

${hr()}

<h2>What Smart Households Are Doing Right Now</h2>
<ol>
<li><strong>Locking in fixed rates</strong> where possible — refinancing variable-rate debt while credit is still accessible</li>
<li><u>Building 3 months of expenses</u> in a high-yield savings account (paying 4–5% right now — use it)</li>
<li><strong>Quietly adding income</strong> — not quitting jobs, but adding ${currency}200–${currency}500/month from freelancing or gig work as insurance</li>
<li><u>Cutting the subscriptions nobody uses</u> — most households find ${currency}80–${currency}150/month on review</li>
<li><strong>Not panic-selling investments</strong> — market volatility is uncomfortable, but selling during dips locks in losses</li>
</ol>

${hr()}

<h2>The One Thing Most People Get Wrong in Uncertain Times</h2>
<p>They wait to act until things get worse. By then, credit is tighter, competition for jobs is higher, and options are fewer. <strong>The best time to recession-proof your finances is before you need to.</strong></p>
<p>You don't need to be scared. You need to be slightly more prepared than the average person — and honestly, the bar for that is pretty low.</p>

${faq([
  { q: "Is a recession actually coming?", a: "Economists are split. More useful question: are YOU recession-ready? Focus on what you can control — savings rate, debt load, income diversity." },
  { q: "Should I stop investing?", a: "No — if you're investing long-term (10+ years), market dips are buying opportunities. Reduce risk in portfolios you need in the next 2–3 years." },
  { q: "What's the best thing I can do this week?", a: `Open a high-yield savings account if you don't have one. Current rates: 4–5% APY. Park ${currency}1,000 there as your first month of emergency fund.` },
])}

<div style="background:#f0f7ff;border-left:4px solid #1a73e8;padding:16px 20px;margin:28px 0;border-radius:4px">
<strong>Stay sharp:</strong> We cover money, benefits, and economic moves for real people — weekly, in plain language. Bookmark us.
</div>
`.trim();
}

// 일반 트렌드 폴백
function buildGeneralPost(trend, cleanTitle) {
  const geo = trend.geo || "US";
  const currency = geo === "IN" ? "₹" : "$";
  const country = geo === "IN" ? "India" : "the US";

  resetImageTracker();
  return `
${getImg("finance", cleanTitle, "100%", "1200")}

<p>Here's something worth paying attention to: <strong>${trend.title.replace(/\s*[-–|].*$/, "").trim()}</strong>. And not just because it's making headlines — but because there's a financial angle to this that most people miss.</p>

${hr()}

<h2>Why This Matters for Your Wallet</h2>
${getImg("money", "financial impact explained", "100%", "800")}
<p>Every major trend or news story has a money dimension. Sometimes it's obvious (policy changes, job cuts). Sometimes it's subtle (consumer behavior shifts that affect prices and opportunities). Here, it's worth watching for a few specific reasons.</p>
<ul>
<li><strong>Prices and costs</strong> in connected sectors could shift over the next 3–6 months</li>
<li><u>Job availability</u> in related industries is worth monitoring</li>
<li>There may be <strong>new opportunities</strong> opening for people who move early</li>
</ul>

${hr()}

<h2>The Practical Take</h2>
<p>Rather than speculate, here's what consistently works when there's uncertainty around an issue like this:</p>
<ol>
<li><strong>Don't make big financial moves based on headlines alone</strong> — wait for 2–3 data points before acting</li>
<li><u>Check whether this affects your specific income or benefits</u> — many things that sound big affect a narrow slice of people</li>
<li><strong>If it does affect you:</strong> review your emergency fund, your income sources, and any debt with variable rates</li>
<li><u>If it doesn't:</u> there's probably an opportunity somewhere — disruption creates gaps that nimble people fill</li>
</ol>

${hr()}

<h2>Our Read on This</h2>
<p>Honestly? <strong>Most news that feels urgent isn't actionable in the next 7 days.</strong> What IS actionable right now: building a ${currency}1,000 buffer if you don't have one, knowing what government programs you qualify for, and having at least one income source outside your main job.</p>
<p>Those three things make you resilient to almost any economic news — this one included.</p>

${faq([
  { q: "Does this directly affect benefits or income in " + country + "?", a: "Depends on your situation. If you're in an affected sector or receive related benefits, check your state/regional authority's website for specific guidance." },
  { q: "What should I do this week?", a: `Review your emergency fund status. If it's below 1 month of expenses, that's the first move — aim for ${currency}500–${currency}1,000 as a starting target.` },
  { q: "Where can I get more reliable updates?", a: "Follow official government sources for policy changes, and keep an eye here — we summarize what matters for household finances weekly." },
])}
`.trim();
}

function buildTrendPost(trend) {
  const cleanTitle = makeTitle(trend);
  const type = detectType(trend.title, trend.geo);

  const builders = {
    policy:  () => buildPolicyPost(trend, cleanTitle),
    hustle:  () => buildHustlePost(trend, cleanTitle),
    economy: () => buildEconomyPost(trend, cleanTitle),
    salary:  () => buildHustlePost(trend, cleanTitle),
    general: () => buildGeneralPost(trend, cleanTitle),
  };

  const content = (builders[type] || builders.general)();
  return { title: cleanTitle, content };
}

module.exports = { buildTrendPost, makeTitle, detectType };
