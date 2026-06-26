// 카테고리별 이미지 풀 — 중복 없이 로테이션
const POOL = {
  finance: [
    "https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg",
    "https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg",
    "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg",
    "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg",
    "https://images.pexels.com/photos/4475524/pexels-photo-4475524.jpeg",
    "https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg",
    "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg",
  ],
  income: [
    "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg",
    "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
    "https://images.pexels.com/photos/5466777/pexels-photo-5466777.jpeg",
    "https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg",
    "https://images.pexels.com/photos/7176319/pexels-photo-7176319.jpeg",
  ],
  laptop: [
    "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg",
    "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg",
    "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
    "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
    "https://images.pexels.com/photos/4974912/pexels-photo-4974912.jpeg",
  ],
  india: [
    "https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg",
    "https://images.pexels.com/photos/2467285/pexels-photo-2467285.jpeg",
    "https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg",
    "https://images.pexels.com/photos/3881099/pexels-photo-3881099.jpeg",
    "https://images.pexels.com/photos/3951628/pexels-photo-3951628.jpeg",
  ],
  food: [
    "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
    "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg",
    "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg",
    "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
    "https://images.pexels.com/photos/2313686/pexels-photo-2313686.jpeg",
  ],
  kitchen: [
    "https://images.pexels.com/photos/3771120/pexels-photo-3771120.jpeg",
    "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg",
    "https://images.pexels.com/photos/6996059/pexels-photo-6996059.jpeg",
    "https://images.pexels.com/photos/5765/pexels-photo-5765.jpeg",
    "https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg",
  ],
  home: [
    "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
    "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    "https://images.pexels.com/photos/2631746/pexels-photo-2631746.jpeg",
    "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg",
    "https://images.pexels.com/photos/4846461/pexels-photo-4846461.jpeg",
    "https://images.pexels.com/photos/3935339/pexels-photo-3935339.jpeg",
  ],
  living: [
    "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg",
    "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg",
    "https://images.pexels.com/photos/1668860/pexels-photo-1668860.jpeg",
    "https://images.pexels.com/photos/3144580/pexels-photo-3144580.jpeg",
  ],
  sports: [
    "https://images.pexels.com/photos/46798/pexels-photo-46798.jpeg",
    "https://images.pexels.com/photos/3621059/pexels-photo-3621059.jpeg",
    "https://images.pexels.com/photos/163444/pexels-photo-163444.jpeg",
    "https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg",
    "https://images.pexels.com/photos/248547/pexels-photo-248547.jpeg",
    "https://images.pexels.com/photos/3621044/pexels-photo-3621044.jpeg",
  ],
  cricket: [
    "https://images.pexels.com/photos/3718495/pexels-photo-3718495.jpeg",
    "https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg",
  ],
  celebrity: [
    "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg",
    "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg",
    "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg",
    "https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg",
  ],
  travel: [
    "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg",
    "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg",
    "https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg",
    "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg",
    "https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg",
  ],
  money: [
    "https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg",
    "https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg",
    "https://images.pexels.com/photos/210990/pexels-photo-210990.jpeg",
    "https://images.pexels.com/photos/1602726/pexels-photo-1602726.jpeg",
  ],
  family: [
    "https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg",
    "https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg",
    "https://images.pexels.com/photos/1231365/pexels-photo-1231365.jpeg",
    "https://images.pexels.com/photos/4473871/pexels-photo-4473871.jpeg",
  ],
  benefits: [
    "https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg",
    "https://images.pexels.com/photos/5699516/pexels-photo-5699516.jpeg",
    "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg",
    "https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg",
  ],
  ai: [
    "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg",
    "https://images.pexels.com/photos/8386423/pexels-photo-8386423.jpeg",
    "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
  ],
};

const _usedIndices = {};

function getImg(category, alt, width = "100%", size = "1200") {
  const pool = POOL[category] || POOL.finance;
  const key = category;
  if (!_usedIndices[key]) _usedIndices[key] = 0;
  const url = pool[_usedIndices[key] % pool.length];
  _usedIndices[key]++;
  return `<img src="${url}?auto=compress&cs=tinysrgb&w=${size}" alt="${alt}" style="width:${width};border-radius:8px;margin:16px 0" loading="lazy"/>`;
}

// 리셋 (새 글 생성 시마다 호출)
function resetImageTracker() {
  Object.keys(_usedIndices).forEach(k => delete _usedIndices[k]);
}

module.exports = { getImg, resetImageTracker };
