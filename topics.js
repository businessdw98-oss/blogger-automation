// 인도 타겟 (고트래픽) + 영어권 타겟 (고수익) 혼합
// weight: 클수록 자주 선택됨

const TOPICS = [
  // === 인도 타겟 (트래픽용) ===
  { id: "india_pm_kisan", target: "IN", weight: 3, niche: "benefits",
    title: "PM Kisan 2026: How to Check Your ₹6,000 Status & Fix Rejected Applications",
    keywords: ["PM Kisan status", "PM Kisan payment 2026", "PM Kisan rejected"],
    angle: "step-by-step guide + common rejection reasons + fix tips" },

  { id: "india_aadhaar", target: "IN", weight: 3, niche: "benefits",
    title: "7 Aadhaar Card Benefits You're Probably Not Using in 2026",
    keywords: ["Aadhaar benefits", "Aadhaar card 2026", "Aadhaar linked benefits"],
    angle: "listicle with underused government benefits tied to Aadhaar" },

  { id: "india_itr", target: "IN", weight: 3, niche: "finance",
    title: "How to File ITR Online in 2026 (Step-by-Step for Salaried & Freelancers)",
    keywords: ["ITR filing 2026", "how to file income tax return India", "ITR online"],
    angle: "practical walkthrough with screenshots-style descriptions" },

  { id: "india_side_hustle", target: "IN", weight: 4, niche: "income",
    title: "10 Side Hustles Indians Are Using to Make ₹30,000+/Month in 2026",
    keywords: ["side hustle India 2026", "make money online India", "freelance India"],
    angle: "relatable, real examples, mix of online and offline options" },

  { id: "india_epf", target: "IN", weight: 2, niche: "benefits",
    title: "EPF Withdrawal 2026: Exact Steps, Rules & How to Get Your Money Faster",
    keywords: ["EPF withdrawal 2026", "PF withdrawal online", "EPF claim status"],
    angle: "step-by-step + common mistakes + timeline expectations" },

  { id: "india_scholarship", target: "IN", weight: 3, niche: "benefits",
    title: "Top 12 Government Scholarships for Indian Students in 2026 (Still Open)",
    keywords: ["government scholarship India 2026", "scholarship for students India"],
    angle: "listicle with eligibility, amount, and direct apply links" },

  // === 미국/영국/호주 타겟 (고CPC 수익용) ===
  { id: "us_snap", target: "US", weight: 3, niche: "benefits",
    title: "SNAP Benefits 2026: Who Lost Them, Who Qualifies Now & What To Do",
    keywords: ["SNAP benefits 2026", "food stamps 2026", "SNAP eligibility"],
    angle: "controversial + recent changes + action steps" },

  { id: "us_social_security", target: "US", weight: 3, niche: "benefits",
    title: "Social Security Changes in 2026 That Could Affect Your Monthly Check",
    keywords: ["Social Security 2026", "SSA changes", "Social Security increase"],
    angle: "what changed, who's affected, what you can do" },

  { id: "us_side_hustle", target: "US", weight: 4, niche: "income",
    title: "9 Side Hustles That Pay Weekly (No Experience Needed) — 2026 Edition",
    keywords: ["side hustles that pay weekly", "make money fast 2026", "quick cash"],
    angle: "urgency-driven, practical, mix of gig economy + digital" },

  { id: "us_ai_income", target: "US", weight: 4, niche: "income",
    title: "How to Make $500/Week Using Free AI Tools (No Tech Skills Needed)",
    keywords: ["make money with AI 2026", "AI side hustle free", "ChatGPT make money"],
    angle: "free tools only, beginner-friendly, specific niches" },

  { id: "us_credit_score", target: "US", weight: 2, niche: "finance",
    title: "Your Credit Score Is Costing You Money — Here's How to Fix It in 30 Days",
    keywords: ["how to raise credit score fast", "credit score 2026", "fix credit"],
    angle: "urgency + specific tactics + timeline" },

  { id: "au_centrelink", target: "AU", weight: 2, niche: "benefits",
    title: "Centrelink Payments 2026: Full List of Who Gets What & How to Apply",
    keywords: ["Centrelink 2026", "Centrelink payments", "Centrelink eligibility"],
    angle: "comprehensive guide, updated for 2026 rates" },

  { id: "uk_universal_credit", target: "UK", weight: 2, niche: "benefits",
    title: "Universal Credit 2026: Payment Dates, New Rates & What Changed",
    keywords: ["Universal Credit 2026", "UC payment dates", "Universal Credit increase"],
    angle: "updated info + what's different from 2025" },

  // === 연예/셀럽 (바이럴 트래픽) ===
  { id: "celeb_net_worth", target: "ALL", weight: 5, niche: "entertainment",
    title: "Celebrity Net Worth 2026: Who Lost It All and Who's Richer Than Ever",
    keywords: ["celebrity net worth 2026", "richest celebrities", "celebrity bankruptcy"],
    angle: "shocking rises and falls, relatable money lessons from famous failures" },

  { id: "celeb_divorce_money", target: "ALL", weight: 4, niche: "entertainment",
    title: "The Most Expensive Celebrity Divorces of 2026 (And What We Can Learn)",
    keywords: ["celebrity divorce 2026", "celebrity divorce settlement", "prenup"],
    angle: "real numbers + practical takeaways about prenups and asset protection" },

  { id: "influencer_income", target: "ALL", weight: 5, niche: "entertainment",
    title: "How Much Do Top Influencers Actually Make in 2026? The Real Numbers",
    keywords: ["influencer income 2026", "how much do YouTubers make", "creator economy"],
    angle: "tier breakdown from nano to mega, realistic path to monetization" },

  { id: "india_bollywood_money", target: "IN", weight: 4, niche: "entertainment",
    title: "Bollywood Salaries vs. Hollywood: Who Actually Earns More in 2026?",
    keywords: ["Bollywood actor salary 2026", "highest paid Indian actor", "Bollywood vs Hollywood"],
    angle: "surprising comparisons + how actors manage (or mismanage) their wealth" },

  // === 스포츠 (고트래픽) ===
  { id: "athlete_salary", target: "ALL", weight: 5, niche: "sports",
    title: "Top 20 Highest-Paid Athletes in the World in 2026 (Full Salary Breakdown)",
    keywords: ["highest paid athletes 2026", "athlete salary 2026", "richest athletes"],
    angle: "full breakdown with salary, endorsements, investments — and who's overpaid" },

  { id: "fantasy_sports_money", target: "US", weight: 4, niche: "sports",
    title: "Can You Actually Make Money Playing Fantasy Sports in 2026? Honest Answer",
    keywords: ["fantasy sports money 2026", "DraftKings strategy", "make money fantasy football"],
    angle: "honest pros/cons, strategies that work, tax implications" },

  { id: "ipl_money", target: "IN", weight: 5, niche: "sports",
    title: "IPL 2026 Player Salaries: Who Got the Biggest Contracts and Why It Matters",
    keywords: ["IPL salary 2026", "IPL auction 2026", "highest paid IPL player"],
    angle: "full auction breakdown + how young players can break in + financial tips from cricketers" },

  { id: "sports_betting_truth", target: "US", weight: 4, niche: "sports",
    title: "Sports Betting in 2026: The Math That Shows Why Most People Lose Money",
    keywords: ["sports betting 2026", "is sports betting profitable", "sports betting tips"],
    angle: "honest take on odds, house edge, and the few strategies that actually work" },

  // === 맛집/여행/라이프스타일 (인도+글로벌 트래픽) ===
  { id: "cheap_travel_us", target: "US", weight: 4, niche: "travel",
    title: "How to Travel the US for Under $50/Day in 2026 (Real Itineraries Inside)",
    keywords: ["cheap travel USA 2026", "budget travel United States", "travel on budget"],
    angle: "specific cities, real costs, hacks for accommodation and food" },

  { id: "india_street_food_money", target: "IN", weight: 4, niche: "food",
    title: "Street Food Vendors Making ₹1 Lakh/Month: What Their Business Model Looks Like",
    keywords: ["street food business India", "food business income India 2026", "chai stall profit"],
    angle: "real income stories, how to start, margins and costs breakdown" },

  { id: "restaurant_side_hustle", target: "ALL", weight: 3, niche: "food",
    title: "How People Are Making $2,000+/Month Selling Homemade Food in 2026",
    keywords: ["sell food from home 2026", "cottage food business", "homemade food income"],
    angle: "legal requirements by state/country, platforms, realistic earnings" },

  { id: "travel_credit_cards", target: "US", weight: 4, niche: "travel",
    title: "Best Travel Credit Cards of 2026: I Compared 11 Cards So You Don't Have To",
    keywords: ["best travel credit card 2026", "travel rewards card", "credit card points"],
    angle: "clear comparison table, winner for each use case, sign-up bonus math" },

  // === 글로벌 바이럴 (모든 타겟) ===
  { id: "global_recession", target: "ALL", weight: 3, niche: "finance",
    title: "Recession-Proof Your Finances in 2026: 8 Moves to Make Right Now",
    keywords: ["recession 2026", "recession proof finances", "prepare for recession"],
    angle: "fear-based hook + actionable, confidence-building steps" },

  { id: "global_passive", target: "ALL", weight: 3, niche: "income",
    title: "7 Passive Income Streams You Can Start With Under $100 in 2026",
    keywords: ["passive income 2026", "passive income low investment", "earn while you sleep"],
    angle: "low barrier, realistic expectations, diverse options" },
];

function pickTopic(usedIds = []) {
  const available = TOPICS.filter(t => !usedIds.includes(t.id));
  if (!available.length) return TOPICS[Math.floor(Math.random() * TOPICS.length)];

  const totalWeight = available.reduce((s, t) => s + t.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const t of available) {
    rand -= t.weight;
    if (rand <= 0) return t;
  }
  return available[0];
}

module.exports = { TOPICS, pickTopic };
