const https = require("https");

const FINANCE_KEYWORDS = [
  // Finance/Economy
  "money","income","salary","job","earn","pay","benefit","tax","loan","invest",
  "credit","insurance","scheme","welfare","pension","rent","price","cost",
  "subsidy","grant","debt","saving","budget","inflation","recession","layoff",
  "unemploy","hire","fired","work","freelance","side hustle","business","crypto",
  "stock","market","bank","interest","rate","mortgage","afford","economy",
  "pm kisan","aadhaar","gst","epf","rupee","lakh","crore","emi","startup",
  "sensex","nifty","rbi","sebi","snap","medicaid","medicare","social security",
  "401k","irs","minimum wage","student loan","housing","stimulus","tariff",
  "trade","wage","poverty","wealth","rich","financial","fund","retire","spend",
  // Entertainment/Celebrity
  "celebrity","actor","actress","singer","rapper","net worth","bollywood",
  "hollywood","ott","netflix","youtube","influencer","tiktoker","reality tv",
  "divorce","breakup","scandal","controversy","award","box office","hit flop",
  // Sports
  "cricket","ipl","nba","nfl","fifa","athlete","player","team","match","league",
  "tournament","champion","transfer","contract","coach","win","loss","score",
  // Products/Shopping
  "best","review","vs","compare","worth","buy","cheap","budget","under",
  "smartphone","laptop","phone","tablet","appliance","gadget","product",
  "mixer","air fryer","refrigerator","washing machine","earbuds","camera",
  // Lifestyle
  "home","kitchen","living","decor","food","recipe","travel","trip","health",
  "fitness","diet","weight","beauty","fashion","relationship","marriage","career"
];

function fetch(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/rss+xml, application/xml, text/xml, */*"
      },
      timeout: 10000
    };
    https.get(url, options, res => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        return fetch(res.headers.location).then(resolve).catch(reject);
      }
      let data = "";
      res.on("data", d => (data += d));
      res.on("end", () => resolve(data));
    }).on("error", reject).on("timeout", () => reject(new Error("timeout")));
  });
}

function isRelevant(text) {
  const lower = text.toLowerCase();
  return FINANCE_KEYWORDS.some(k => lower.includes(k));
}

function parseRssTitles(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const titleMatch = block.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/s);
    if (titleMatch) {
      const title = titleMatch[1].replace(/<[^>]+>/g, "").replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').trim();
      if (title && title.length > 5 && !title.toLowerCase().includes("google news")) {
        // 기사 링크 추출 (이미지 소스로 활용)
        const linkMatch = block.match(/<link>(.*?)<\/link>/s) || block.match(/<guid[^>]*>(.*?)<\/guid>/s);
        const sourceMatch = block.match(/<source[^>]*>(.*?)<\/source>/s);
        items.push({
          title,
          articleUrl: linkMatch ? linkMatch[1].trim() : null,
          sourceName: sourceMatch ? sourceMatch[1].trim() : null
        });
      }
    }
  }
  return items;
}

// Google News RSS - 가장 안정적인 무료 트렌드 소스
async function fetchGoogleNews(query, geo = "US", lang = "en") {
  const ceid = geo === "IN" ? "IN:en" : "US:en";
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${lang}&gl=${geo}&ceid=${ceid}`;
  try {
    const xml = await fetch(url);
    return parseRssTitles(xml).slice(0, 5).map(item => ({
      source: `gnews_${geo}`,
      title: item.title,
      articleUrl: item.articleUrl,
      sourceName: item.sourceName,
      geo,
      score: 50
    }));
  } catch (e) {
    return [];
  }
}

// Google Trends RSS
async function fetchGoogleTrends(geo = "US") {
  try {
    const xml = await fetch(`https://trends.google.com/trends/trendingsearches/daily/rss?geo=${geo}`);
    const titles = [...xml.matchAll(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g)].map(m => m[1]);
    const traffic = [...xml.matchAll(/<ht:approx_traffic>(.*?)<\/ht:approx_traffic>/g)].map(m => m[1]);
    return titles
      .filter(t => t && t.length > 3 && !t.includes("Daily Search Trends"))
      .map((title, i) => ({
        source: `trends_${geo}`,
        title,
        geo,
        score: parseInt(traffic[i]?.replace(/[^0-9]/g, "") || "0") / 1000
      }));
  } catch (e) {
    return [];
  }
}

// YouTube 트렌딩 제목 스크래핑
async function fetchYouTubeTrending(geo = "US") {
  try {
    const gl = geo;
    const hl = geo === "IN" ? "en-IN" : "en-US";
    const html = await fetch(
      `https://www.youtube.com/feed/trending?gl=${gl}&hl=${hl}`
    );
    const matches = [...html.matchAll(/"title":\{"runs":\[\{"text":"([^"]{10,100})"\}\]/g)];
    const titles = [...new Set(matches.map(m => m[1]))].slice(0, 12);
    return titles.map(title => ({ source: `youtube_${geo}`, title, geo, score: 80 }));
  } catch (e) { return []; }
}

// Google Trends 카테고리별
async function fetchGoogleTrendsByCategory(geo = "US", cat = "3") {
  try {
    const xml = await fetch(
      `https://trends.google.com/trends/trendingsearches/daily/rss?geo=${geo}&cat=${cat}`
    );
    const titles = [...xml.matchAll(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g)].map(m => m[1]);
    const traffic = [...xml.matchAll(/<ht:approx_traffic>(.*?)<\/ht:approx_traffic>/g)].map(m => m[1]);
    return titles
      .filter(t => t && t.length > 3 && !t.includes("Daily Search Trends"))
      .map((title, i) => ({
        source: `trends_${geo}_ent`,
        title, geo,
        score: parseInt(traffic[i]?.replace(/[^0-9]/g, "") || "0") / 1000
      }));
  } catch (e) { return []; }
}

// Hacker News - 기술/비즈니스 트렌드
async function fetchHackerNews() {
  try {
    const ids = JSON.parse(await fetch("https://hacker-news.firebaseio.com/v0/topstories.json"));
    const top = ids.slice(0, 15);
    const stories = await Promise.all(
      top.map(id =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
          .then(d => JSON.parse(d))
          .catch(() => null)
      )
    );
    return stories
      .filter(s => s && s.title && s.score > 100)
      .map(s => ({ source: "hackernews", title: s.title, geo: "US", score: s.score / 100 }));
  } catch (e) {
    return [];
  }
}

async function getTrendingTopics() {
  console.log("Fetching trends...");

  const queries = {
    US: [
      // Finance
      "side hustle income 2026", "government benefits cut", "recession money",
      // Entertainment
      "celebrity net worth shocking 2026", "celebrity divorce settlement",
      "influencer fired dropped sponsor", "reality TV cast salary",
      "musician broke bankrupt 2026",
      // Sports
      "athlete contract record 2026", "NBA NFL trade drama salary",
      "sports betting win lose money",
      // Viral/lifestyle
      "viral tiktok product make money", "trending side hustle tiktok 2026",
      "get rich quick exposed", "passive income lie truth",
      // Food/Travel
      "food truck income how much", "restaurant fail close 2026",
      "cheap flight deal hack 2026",
      // Home/Living
      "best kitchen appliance 2026", "home gadget worth buying",
      "air fryer vs oven save money", "smart home budget setup"
    ],
    IN: [
      // Finance/Gov
      "india government scheme 2026", "PM Modi yojana benefit",
      "India GST income tax news",
      // Entertainment
      "Bollywood actor salary 2026", "Shah Rukh Khan Deepika net worth",
      "OTT web series cast salary", "YouTube India top earner 2026",
      "India influencer controversy money",
      // Sports
      "IPL salary auction 2026", "Virat Kohli Rohit salary endorsement",
      "kabaddi football India player income",
      // Viral/Food
      "viral food business India 2026", "chai stall profit income India",
      "street food viral instagram india",
      // Home/Living India
      "best mixer grinder India 2026", "air fryer India worth buying",
      "best smartphone under 15000 India", "best laptop student India 2026",
      "best AC India summer 2026", "washing machine buy guide India",
      "IAS officer salary India 2026", "government teacher salary India",
      "software engineer salary India fresher"
    ]
  };

  const [tUS, tIN, tUSEnt, tINEnt, ytUS, ytIN, hn, ...newsResults] = await Promise.all([
    fetchGoogleTrends("US"),
    fetchGoogleTrends("IN"),
    fetchGoogleTrendsByCategory("US", "3"),  // Entertainment
    fetchGoogleTrendsByCategory("IN", "3"),  // Entertainment India
    fetchYouTubeTrending("US"),
    fetchYouTubeTrending("IN"),
    fetchHackerNews(),
    ...queries.US.map(q => fetchGoogleNews(q, "US")),
    ...queries.IN.map(q => fetchGoogleNews(q, "IN")),
  ]);

  const newsFlat = newsResults.flat();
  const all = [...tUS, ...tIN, ...tUSEnt, ...tINEnt, ...ytUS, ...ytIN, ...hn, ...newsFlat];

  // 중복 제거
  const seen = new Set();
  const unique = all.filter(t => {
    const key = t.title.slice(0, 30).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const relevant = unique.filter(t => isRelevant(t.title));
  const irrelevant = unique.filter(t => !isRelevant(t.title));

  // 관련 주제 부족하면 비관련도 포함
  const final = relevant.length >= 10 ? relevant : [...relevant, ...irrelevant.slice(0, 10 - relevant.length)];
  const sorted = final.sort((a, b) => b.score - a.score);

  console.log(`  Collected: ${all.length} -> relevant: ${relevant.length}`);
  return sorted.slice(0, 20);
}

function trendToTitle(trend, idx) {
  const t = trend.title
    .replace(/\s*-\s*(BBC|CNN|Reuters|AP|Forbes|CNBC|Bloomberg|NYT|Guardian).*$/i, "")
    .trim();
  const year = 2026;
  const templates = [
    `What ${t} Means for Your Money in ${year}`,
    `${t}: How It Affects Your Income & What to Do Now`,
    `Is ${t} Going to Cost You Money? Here's the Truth`,
    `How to Protect Your Finances from ${t}`,
    `${t} in ${year}: Who's Affected and What You Can Do`,
    `The Hidden Financial Impact of ${t}`,
    `How Smart People Are Responding to ${t} Right Now`,
    `${t} — What It Actually Means for Your Wallet`,
  ];
  return templates[idx % templates.length];
}

function buildTrendContent(trend) {
  const topic = trend.title
    .replace(/\s*-\s*(BBC|CNN|Reuters|AP|Forbes|CNBC|Bloomberg|NYT|Guardian).*$/i, "")
    .trim();
  const geo = trend.geo || "US";
  const currency = geo === "IN" ? "₹" : "$";
  const year = 2026;

  const heroImg = geo === "IN"
    ? "https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=1200"
    : "https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg?auto=compress&cs=tinysrgb&w=1200";

  return `
<img src="${heroImg}" alt="${topic} financial impact ${year}" style="width:100%;border-radius:8px;margin-bottom:24px" loading="lazy"/>

<p>If you've been following the news about <strong>${topic}</strong> — good. Because what's happening right now has real consequences for your income, your benefits, and your financial stability in ${year}. Here's the honest breakdown.</p>

<hr style="border:none;border-top:1px solid #e0e0e0;margin:28px 0"/>

<h2>Why This Is a Financial Story, Not Just a News Story</h2>
<p>Most coverage of <strong>${topic}</strong> focuses on politics and policy. But what matters for regular people is simpler: <u>does this put money in my pocket or take it out?</u> We'll answer that directly.</p>

<hr style="border:none;border-top:1px solid #e0e0e0;margin:28px 0"/>

<h2>The Real-World Financial Impact</h2>
<img src="https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=800" alt="money impact" style="width:100%;border-radius:6px;margin:12px 0" loading="lazy"/>
<p>Based on how situations like <strong>${topic}</strong> have played out historically, here's what typically gets affected:</p>
<ul>
<li><u>Consumer prices</u> — usually the first thing to move, often within weeks</li>
<li><strong>Job availability</strong> in affected sectors — worth monitoring if you work in a related industry</li>
<li><u>Government benefit eligibility</u> — policy shifts often quietly change who qualifies</li>
<li><strong>Investment and savings returns</strong> — market reactions can create both risk and opportunity</li>
</ul>

<hr style="border:none;border-top:1px solid #e0e0e0;margin:28px 0"/>

<h2>Who Feels It Most</h2>
<p>Not everyone is equally exposed. The groups most likely to be impacted by developments around <strong>${topic}</strong>:</p>
<ul>
<li>Workers in directly connected industries</li>
<li>Households with limited financial cushion (less than 1 month of expenses saved)</li>
<li>Anyone on fixed income or government assistance</li>
<li>Small business owners with exposure to related supply chains or customer segments</li>
</ul>

<hr style="border:none;border-top:1px solid #e0e0e0;margin:28px 0"/>

<h2>6 Financial Moves That Always Make Sense in Uncertain Times</h2>
<img src="https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800" alt="financial planning" style="width:100%;border-radius:6px;margin:12px 0" loading="lazy"/>
<ol>
<li><strong>Shore up your emergency fund</strong> — 3 months of essentials, in a high-yield savings account earning 4–5% APY</li>
<li><strong>Audit your fixed monthly costs</strong> — subscriptions, insurance, memberships. Cut ${currency}100–${currency}200 from recurring costs and you've bought yourself a buffer</li>
<li><strong>Check your benefit eligibility</strong> — disruptions often create new qualifying windows. Visit benefits.gov (US) or myscheme.gov.in (India)</li>
<li><strong>Add one income stream</strong> — even ${currency}300–${currency}500/month from freelancing or gig work dramatically changes your resilience</li>
<li><strong>Don't make panic investment decisions</strong> — stay your course unless your timeline or risk tolerance has genuinely changed</li>
<li><strong>Negotiate your biggest bills now</strong> — internet, insurance, phone. Companies are more flexible when customers are paying attention to costs</li>
</ol>

<hr style="border:none;border-top:1px solid #e0e0e0;margin:28px 0"/>

<h2>The Opportunity in the Noise</h2>
<p>Every disruption reshuffles the financial deck. The people who come out ahead from situations like <strong>${topic}</strong> aren't the ones who know more — they're the ones who <u>act earlier, stay calmer, and adapt faster</u> than the people around them.</p>

<p>Start with one of the 6 moves above this week. That's enough.</p>

<div style="background:#f0f7ff;border-left:4px solid #1a73e8;padding:16px 20px;margin:28px 0;border-radius:4px">
<strong>Stay ahead:</strong> Bookmark this blog for weekly updates on money, benefits, and side income — in plain language, no jargon, no fluff.
</div>
`.trim();
}

module.exports = { getTrendingTopics, trendToTitle, buildTrendContent };

if (require.main === module) {
  getTrendingTopics().then(topics => {
    console.log("\nTop trends:");
    topics.slice(0, 10).forEach((t, i) =>
      console.log(`  ${i + 1}. [${t.geo}] ${t.title.slice(0, 70)} (${t.source})`)
    );
  });
}
