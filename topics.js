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

  // === 살림/가전/주방/리빙 (고전환율 — AdSense 핵심) ===
  { id: "kitchen_airfryer", target: "ALL", weight: 5, niche: "home",
    title: "Air Fryer vs. Oven: Which One Actually Saves You More Money in 2026?",
    keywords: ["air fryer savings", "air fryer vs oven electricity", "best air fryer 2026"],
    angle: "real electricity cost math + which food comes out better + buying guide" },

  { id: "kitchen_india_mixie", target: "IN", weight: 5, niche: "home",
    title: "Best Mixer Grinder in India 2026: Top 7 Tested (Under ₹3,000 to ₹8,000)",
    keywords: ["best mixer grinder India 2026", "mixer grinder review India", "Preethi vs Bajaj mixer"],
    angle: "tier-based buying guide, what matters (watts, jars, warranty), real picks" },

  { id: "home_budget_makeover", target: "ALL", weight: 4, niche: "home",
    title: "How to Completely Transform Your Home for Under $500 (Real Before/After)",
    keywords: ["budget home makeover", "cheap home decor ideas", "home transformation budget"],
    angle: "room by room breakdown, where to spend vs where to save, specific product picks" },

  { id: "kitchen_gadgets_worth", target: "ALL", weight: 5, niche: "kitchen",
    title: "10 Kitchen Gadgets That Are Actually Worth the Money (And 5 That Are Not)",
    keywords: ["kitchen gadgets worth buying 2026", "best kitchen tools", "kitchen gadgets review"],
    angle: "honest worth-it / skip breakdown with real use cases and prices" },

  { id: "india_washing_machine", target: "IN", weight: 4, niche: "home",
    title: "Semi-Automatic vs Fully Automatic Washing Machine: Which Is Worth It in India?",
    keywords: ["washing machine India 2026", "semi automatic vs fully automatic", "best washing machine India"],
    angle: "real cost comparison, electricity bill, water usage, who should buy which" },

  { id: "home_energy_save", target: "ALL", weight: 4, niche: "home",
    title: "12 Home Changes That Cut Your Electricity Bill by 40% (No Solar Needed)",
    keywords: ["reduce electricity bill home", "save on electricity 2026", "lower energy bill"],
    angle: "ranked by impact and cost, some free habits + smart product upgrades" },

  { id: "bedroom_upgrade_cheap", target: "ALL", weight: 4, niche: "living",
    title: "Bedroom Upgrades Under $100 That Make It Feel Like a Hotel Room",
    keywords: ["cheap bedroom upgrade", "bedroom makeover budget", "hotel bedroom feel home"],
    angle: "specific product names, where to buy cheap, visual impact vs cost" },

  { id: "india_refrigerator", target: "IN", weight: 4, niche: "home",
    title: "Best Refrigerators in India 2026: Single Door vs Double Door (Under ₹25,000)",
    keywords: ["best refrigerator India 2026", "single door double door fridge India", "LG Samsung refrigerator India"],
    angle: "size guide, star rating explained, top picks by budget tier" },

  { id: "smart_home_budget", target: "US", weight: 4, niche: "home",
    title: "Build a Smart Home on a $200 Budget: The Exact Setup That Works in 2026",
    keywords: ["smart home budget 2026", "cheap smart home setup", "Alexa Google Home budget"],
    angle: "priority order of what to buy first, compatible ecosystem picks, real costs" },

  { id: "kitchen_save_grocery", target: "ALL", weight: 5, niche: "kitchen",
    title: "I Cut My Grocery Bill in Half Using These 9 Kitchen Habits (With Math)",
    keywords: ["cut grocery bill 2026", "save money on food", "grocery budget tips"],
    angle: "actual dollar/rupee savings per habit, meal prep framework, bulk buying math" },

  { id: "india_ac_buying", target: "IN", weight: 4, niche: "home",
    title: "Best Split AC in India 2026: 1 Ton vs 1.5 Ton — Which Saves More on Bills?",
    keywords: ["best split AC India 2026", "1 ton vs 1.5 ton AC India", "AC electricity bill India"],
    angle: "room size guide + electricity cost math + brand comparison under ₹35,000" },

  { id: "us_home_office", target: "US", weight: 4, niche: "home",
    title: "The $300 Home Office Setup That Feels Like $3,000 (Everything Linked)",
    keywords: ["budget home office setup 2026", "cheap home office desk chair monitor"],
    angle: "exact products, why each was chosen, ergonomics on a budget" },

  // === 인도 급여 비교 (검색량 폭발 — "X는 얼마 버나" 형식) ===
  { id: "india_salary_ias", target: "IN", weight: 6, niche: "income",
    title: "IAS Officer Salary in India 2026: In-Hand Pay, Perks & Total Package Revealed",
    keywords: ["IAS salary 2026", "IAS officer salary in hand", "IAS perks benefits"],
    angle: "grade-wise breakdown, allowances, bungalow/car perks, comparison with private sector" },

  { id: "india_salary_software", target: "IN", weight: 6, niche: "income",
    title: "Software Engineer Salary in India 2026: Fresher to Senior (Company-Wise Data)",
    keywords: ["software engineer salary India 2026", "IT salary India", "TCS Infosys Wipro salary"],
    angle: "year-wise progression, FAANG vs service company, city-wise difference, appraisal tips" },

  { id: "india_salary_doctor", target: "IN", weight: 5, niche: "income",
    title: "Doctor Salary in India 2026: MBBS vs Specialist vs Private Practice (Full Breakdown)",
    keywords: ["doctor salary India 2026", "MBBS salary India", "specialist doctor income India"],
    angle: "government vs private, specialization impact, how long to break even on education cost" },

  { id: "india_salary_airhostess", target: "IN", weight: 5, niche: "income",
    title: "Air Hostess Salary in India 2026: IndiGo, Air India, SpiceJet — Who Pays Most?",
    keywords: ["air hostess salary India 2026", "cabin crew salary India", "IndiGo air hostess salary"],
    angle: "airline-wise comparison, allowances, hidden perks (free travel), career growth path" },

  { id: "india_salary_police", target: "IN", weight: 5, niche: "income",
    title: "Police Constable to IPS Salary in India 2026: What Every Rank Actually Earns",
    keywords: ["police salary India 2026", "constable salary India", "IPS officer salary"],
    angle: "rank-by-rank table, state-wise variation, 7th pay commission update, perks" },

  { id: "india_salary_teacher", target: "IN", weight: 5, niche: "income",
    title: "Government Teacher Salary in India 2026: Primary to College (State-by-State)",
    keywords: ["government teacher salary India 2026", "primary teacher salary India", "professor salary India"],
    angle: "level and state breakdown, private vs government gap, DA + HRA included" },

  { id: "india_salary_ca", target: "IN", weight: 4, niche: "income",
    title: "CA Salary in India 2026: Fresher, Big 4, and Own Practice — Real Numbers",
    keywords: ["CA salary India 2026", "chartered accountant salary India", "Big 4 salary India CA"],
    angle: "articleship to partner track, city premium, how CA compares to MBA" },

  // === 제품 비교/리뷰 (구매 의도 — 최고 AdSense 전환) ===
  { id: "india_smartphone_under15k", target: "IN", weight: 6, niche: "home",
    title: "Best Smartphones Under ₹15,000 in India (June 2026): Top 6 Ranked",
    keywords: ["best phone under 15000 India 2026", "budget smartphone India 2026", "Redmi Realme under 15000"],
    angle: "camera, battery, performance ranked — clear winner for each use case" },

  { id: "india_laptop_student", target: "IN", weight: 5, niche: "home",
    title: "Best Laptops for Students in India 2026 (Under ₹40,000): Tested & Ranked",
    keywords: ["best laptop for students India 2026", "laptop under 40000 India", "HP Dell Lenovo student laptop India"],
    angle: "battery life priority, weight, display — clear picks for engineering vs arts students" },

  { id: "us_credit_card_compare", target: "US", weight: 5, niche: "finance",
    title: "Chase Sapphire vs Amex Gold vs Capital One Venture: Which Card Wins in 2026?",
    keywords: ["best travel credit card 2026", "Chase Sapphire vs Amex Gold", "credit card comparison 2026"],
    angle: "side-by-side table, who each card is actually for, real math on annual fee vs rewards" },

  { id: "india_earbuds_under2k", target: "IN", weight: 5, niche: "home",
    title: "Best Earbuds Under ₹2,000 in India 2026: boAt vs Noise vs OnePlus Buds",
    keywords: ["best earbuds under 2000 India 2026", "wireless earbuds India budget", "boAt vs Noise earbuds"],
    angle: "sound test, mic quality, battery life — one clear winner + best runner-up" },

  // === 살림/리빙/주방 (인도 특화) ===
  { id: "kitchen_india_airfryer", target: "IN", weight: 5, niche: "home",
    title: "Air Fryer Worth It in India? I Cooked 30 Days Using Only an Air Fryer (Results)",
    keywords: ["air fryer India 2026", "air fryer worth buying India", "best air fryer India under 3000"],
    angle: "real electricity bill data, samosa/paratha/chicken results, which brand to buy in India" },

  { id: "india_home_decor_cheap", target: "IN", weight: 4, niche: "living",
    title: "Indian Home Makeover Under ₹10,000: Room-by-Room Transformation Ideas",
    keywords: ["home decor ideas India budget", "cheap home makeover India", "Indian home interior budget"],
    angle: "specific Flipkart/Amazon India links style, vastu-friendly options, rental-friendly changes" },

  { id: "us_kitchen_save", target: "US", weight: 4, niche: "kitchen",
    title: "I Stopped Buying These 11 Kitchen Gadgets — Here's What to Get Instead",
    keywords: ["kitchen gadgets not worth buying", "useless kitchen tools", "best kitchen gadgets 2026"],
    angle: "honest anti-list + better alternatives, saves $200+ in bad purchases" },

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
