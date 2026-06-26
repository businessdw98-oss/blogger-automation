/**
 * 이미지 풀 — 세션 전체에서 Set 기반 중복 방지
 * 같은 카테고리라도 풀이 소진될 때까지 같은 이미지 재사용 안 함
 */
const POOL = {
  finance: [
    "https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg",
    "https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg",
    "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg",
    "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg",
    "https://images.pexels.com/photos/4475524/pexels-photo-4475524.jpeg",
    "https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg",
    "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg",
    "https://images.pexels.com/photos/210990/pexels-photo-210990.jpeg",
    "https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg",
    "https://images.pexels.com/photos/1602726/pexels-photo-1602726.jpeg",
    "https://images.pexels.com/photos/6693661/pexels-photo-6693661.jpeg",
    "https://images.pexels.com/photos/5849569/pexels-photo-5849569.jpeg",
  ],
  income: [
    "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg",
    "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
    "https://images.pexels.com/photos/5466777/pexels-photo-5466777.jpeg",
    "https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg",
    "https://images.pexels.com/photos/7176319/pexels-photo-7176319.jpeg",
    "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg",
    "https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg",
    "https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg",
  ],
  laptop: [
    "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg",
    "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg",
    "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
    "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
    "https://images.pexels.com/photos/4974912/pexels-photo-4974912.jpeg",
    "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg",
    "https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg",
    "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg",
  ],
  india: [
    "https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg",
    "https://images.pexels.com/photos/2467285/pexels-photo-2467285.jpeg",
    "https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg",
    "https://images.pexels.com/photos/3881099/pexels-photo-3881099.jpeg",
    "https://images.pexels.com/photos/3951628/pexels-photo-3951628.jpeg",
    "https://images.pexels.com/photos/2105416/pexels-photo-2105416.jpeg",
    "https://images.pexels.com/photos/784879/pexels-photo-784879.jpeg",
    "https://images.pexels.com/photos/1583582/pexels-photo-1583582.jpeg",
  ],
  food: [
    "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
    "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg",
    "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg",
    "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
    "https://images.pexels.com/photos/2313686/pexels-photo-2313686.jpeg",
    "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg",
    "https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg",
  ],
  kitchen: [
    "https://images.pexels.com/photos/3771120/pexels-photo-3771120.jpeg",
    "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg",
    "https://images.pexels.com/photos/6996059/pexels-photo-6996059.jpeg",
    "https://images.pexels.com/photos/5765/pexels-photo-5765.jpeg",
    "https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg",
    "https://images.pexels.com/photos/4397920/pexels-photo-4397920.jpeg",
    "https://images.pexels.com/photos/3738730/pexels-photo-3738730.jpeg",
    "https://images.pexels.com/photos/6996058/pexels-photo-6996058.jpeg",
  ],
  home: [
    "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
    "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    "https://images.pexels.com/photos/2631746/pexels-photo-2631746.jpeg",
    "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg",
    "https://images.pexels.com/photos/4846461/pexels-photo-4846461.jpeg",
    "https://images.pexels.com/photos/3935339/pexels-photo-3935339.jpeg",
    "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
    "https://images.pexels.com/photos/2079249/pexels-photo-2079249.jpeg",
    "https://images.pexels.com/photos/439227/pexels-photo-439227.jpeg",
    "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg",
  ],
  living: [
    "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg",
    "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg",
    "https://images.pexels.com/photos/1668860/pexels-photo-1668860.jpeg",
    "https://images.pexels.com/photos/3144580/pexels-photo-3144580.jpeg",
    "https://images.pexels.com/photos/4050318/pexels-photo-4050318.jpeg",
    "https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg",
  ],
  sports: [
    "https://images.pexels.com/photos/46798/pexels-photo-46798.jpeg",
    "https://images.pexels.com/photos/3621059/pexels-photo-3621059.jpeg",
    "https://images.pexels.com/photos/163444/pexels-photo-163444.jpeg",
    "https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg",
    "https://images.pexels.com/photos/248547/pexels-photo-248547.jpeg",
    "https://images.pexels.com/photos/3621044/pexels-photo-3621044.jpeg",
    "https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg",
    "https://images.pexels.com/photos/235922/pexels-photo-235922.jpeg",
  ],
  cricket: [
    "https://images.pexels.com/photos/3718495/pexels-photo-3718495.jpeg",
    "https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg",
    "https://images.pexels.com/photos/3628909/pexels-photo-3628909.jpeg",
    "https://images.pexels.com/photos/1661951/pexels-photo-1661951.jpeg",
  ],
  celebrity: [
    "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg",
    "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg",
    "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg",
    "https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg",
    "https://images.pexels.com/photos/1722198/pexels-photo-1722198.jpeg",
    "https://images.pexels.com/photos/2774546/pexels-photo-2774546.jpeg",
    "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg",
  ],
  travel: [
    "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg",
    "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg",
    "https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg",
    "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg",
    "https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg",
    "https://images.pexels.com/photos/1010519/pexels-photo-1010519.jpeg",
    "https://images.pexels.com/photos/672358/pexels-photo-672358.jpeg",
  ],
  money: [
    "https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg",
    "https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg",
    "https://images.pexels.com/photos/210990/pexels-photo-210990.jpeg",
    "https://images.pexels.com/photos/1602726/pexels-photo-1602726.jpeg",
    "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg",
    "https://images.pexels.com/photos/6693661/pexels-photo-6693661.jpeg",
  ],
  family: [
    "https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg",
    "https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg",
    "https://images.pexels.com/photos/1231365/pexels-photo-1231365.jpeg",
    "https://images.pexels.com/photos/4473871/pexels-photo-4473871.jpeg",
    "https://images.pexels.com/photos/1683975/pexels-photo-1683975.jpeg",
    "https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg",
  ],
  benefits: [
    "https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg",
    "https://images.pexels.com/photos/5699516/pexels-photo-5699516.jpeg",
    "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg",
    "https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg",
    "https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg",
    "https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg",
    "https://images.pexels.com/photos/7567535/pexels-photo-7567535.jpeg",
    "https://images.pexels.com/photos/6801659/pexels-photo-6801659.jpeg",
  ],
  ai: [
    "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg",
    "https://images.pexels.com/photos/8386423/pexels-photo-8386423.jpeg",
    "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
    "https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg",
    "https://images.pexels.com/photos/8438946/pexels-photo-8438946.jpeg",
  ],
};

// 세션 전체에서 사용된 이미지 URL 추적 (리셋 안 함)
const _sessionUsed = new Set();

// 카테고리 내 within-post 카운터 (포스트마다 다른 위치 시작)
const _postSeed = {};

function getImg(category, alt, width = "100%", size = "1200") {
  const pool = POOL[category] || POOL.finance;

  // 세션에서 아직 안 쓴 이미지 목록
  let available = pool.filter(url => !_sessionUsed.has(url));

  // 풀 소진 시 이 카테고리만 초기화
  if (available.length === 0) {
    pool.forEach(url => _sessionUsed.delete(url));
    available = [...pool];
  }

  // 랜덤 선택
  const url = available[Math.floor(Math.random() * available.length)];
  _sessionUsed.add(url);

  return `<img src="${url}?auto=compress&cs=tinysrgb&w=${size}" alt="${alt}" style="width:${width};border-radius:8px;margin:16px 0" loading="lazy"/>`;
}

// 하위 호환 유지 (이제 within-post 리셋은 의미 없지만 오류 방지)
function resetImageTracker() {}

// 현재 세션 사용 현황
function getSessionStats() {
  return { used: _sessionUsed.size, categories: Object.keys(POOL).length };
}

module.exports = { getImg, resetImageTracker, getSessionStats, POOL };
