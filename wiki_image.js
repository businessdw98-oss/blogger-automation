/**
 * Wikipedia / Wikimedia Commons 무료 이미지 fetcher
 * CC 라이선스 이미지 - 상업 이용 가능
 */
const https = require("https");

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { "User-Agent": "SmartBenefitsGuide/1.0 (blogspot.com)" }
    }, res => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        return httpsGet(res.headers.location).then(resolve).catch(reject);
      }
      let data = "";
      res.on("data", d => (data += d));
      res.on("end", () => resolve(data));
    }).on("error", reject).on("timeout", () => reject(new Error("timeout")));
  });
}

// Wikipedia 인물/주제 이미지 가져오기
async function getWikipediaImage(searchTerm) {
  try {
    // 1. 검색으로 페이지 제목 찾기
    const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm.replace(/\s+/g, "_"))}`;
    const raw = await httpsGet(searchUrl);
    const data = JSON.parse(raw);
    if (data.thumbnail && data.thumbnail.source) {
      // 고해상도 버전으로 교체 (800px → 1200px)
      const highRes = data.thumbnail.source.replace(/\/\d+px-/, "/1200px-");
      return {
        url: highRes,
        caption: data.description || searchTerm,
        source: "Wikipedia",
        sourceUrl: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(searchTerm)}`,
        license: "CC BY-SA"
      };
    }
  } catch {}

  try {
    // 2. Wikimedia Commons 검색 폴백
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&format=json&srnamespace=6&srlimit=3`;
    const raw = await httpsGet(apiUrl);
    const data = JSON.parse(raw);
    const results = data?.query?.search || [];
    if (results.length > 0) {
      const title = results[0].title;
      const imgUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(title.replace("File:", ""))}?width=1200`;
      return {
        url: imgUrl,
        caption: title.replace("File:", "").replace(/\.[^.]+$/, ""),
        source: "Wikimedia Commons",
        sourceUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(title)}`,
        license: "CC"
      };
    }
  } catch {}

  return null;
}

// 제목에서 인물명/장소명 추출 → Wikipedia 이미지 검색
async function getRelevantImage(postTitle, category) {
  // 유명인 이름 추출 패턴
  const celebPatterns = [
    /\b(Shah Rukh Khan|Deepika|Virat Kohli|Rohit Sharma|Elon Musk|Taylor Swift|Beyoncé|Kim Kardashian|Drake|Rihanna|Jeff Bezos|Bill Gates)\b/i,
    /(?:^|\s)([A-Z][a-z]+ [A-Z][a-z]+)(?:\s|$)/
  ];

  for (const pat of celebPatterns) {
    const m = postTitle.match(pat);
    if (m && m[1]) {
      const img = await getWikipediaImage(m[1]);
      if (img) return img;
    }
  }

  // 인물명 없으면 주제어로 검색
  const topicMap = {
    "Entertainment": "entertainment industry",
    "Sports": "sports stadium",
    "Government Benefits": "government welfare benefits",
    "celebrity": "celebrity entertainment",
    "SNAP": "SNAP food stamps program",
    "Republican": "United States Congress",
    "WIC": "WIC Women Infants Children program",
    "IPL": "Indian Premier League cricket",
    "Bollywood": "Bollywood cinema Mumbai",
  };

  for (const [keyword, searchTerm] of Object.entries(topicMap)) {
    if (postTitle.toLowerCase().includes(keyword.toLowerCase())) {
      const img = await getWikipediaImage(searchTerm);
      if (img) return img;
    }
  }

  return null;
}

// 이미지 HTML 태그 + 출처 표기
function imgTagWithCredit(imageData, style = "width:100%;border-radius:8px;margin:16px 0") {
  if (!imageData) return null;
  return `<figure style="margin:16px 0">
<img src="${imageData.url}" alt="${imageData.caption}" style="${style}" loading="lazy"/>
<figcaption style="font-size:11px;color:#888;margin-top:4px">📷 ${imageData.caption} — <a href="${imageData.sourceUrl}" target="_blank" rel="noopener nofollow">${imageData.source}</a> (${imageData.license})</figcaption>
</figure>`;
}

module.exports = { getWikipediaImage, getRelevantImage, imgTagWithCredit };

// 테스트
if (require.main === module) {
  (async () => {
    console.log("Testing Wikipedia image API...");
    const result = await getWikipediaImage("SNAP food program United States");
    console.log(result);
    const result2 = await getRelevantImage("Celebrity Divorces of 2026", "Entertainment");
    console.log(result2);
  })();
}
