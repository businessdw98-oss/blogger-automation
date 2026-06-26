# SmartBenefitsGuide — Blogger 자동화 프로젝트

## 핵심 목표
인도(트래픽) + 미국/영국/호주(높은 CPC $5–30) 독자 타겟  
매일 자동 발행 → AdSense 수익 극대화  
Claude/LLM API 없음 — 로컬 템플릿 + 웹 스크래핑만 사용

---

## 계정 정보
| 항목 | 값 |
|------|-----|
| Google 계정 | businessdw98@gmail.com |
| 블로그 URL | smartbenefitsguide.blogspot.com |
| 블로그 ID | 4621819361046846662 |
| GitHub | https://github.com/businessdw98-oss/blogger-automation |
| Supabase | https://xzfcfhrcuzvetcausqlg.supabase.co |

**⚠️ imda0708@gmail.com은 절대 사용 금지**

---

## 파일 구조
```
blogger-project/
├── .env                  # 모든 API 키 (OAuth, Supabase, Blogger)
├── auto_publish.js       # 메인 오케스트레이터 — 10분 간격 발행
├── generator.js          # 주제별 콘텐츠 생성기 (50+ 주제)
├── topics.js             # 40+ 주제 정의 (weight, target, keywords)
├── content_engine.js     # 트렌드 글 빌더 (정책/허슬/경제/일반)
├── trend_fetcher.js      # 트렌드 수집 (Google News/Trends/YouTube/HN)
├── images.js             # Pexels 이미지 풀 (카테고리별 중복 방지)
├── wiki_image.js         # Wikipedia CC 이미지 fetcher (인물/기관)
├── blogger.js            # Blogger API (발행/수정/목록)
├── auth.js               # OAuth2 토큰 관리 (자동 갱신)
├── tracker.js            # 로컬 performance.json 기록
├── supabase.js           # Supabase REST API (통계 저장)
├── fix_posts.js          # 기발행 글 수정 스크립트
├── setup_scheduler.ps1   # Windows Task Scheduler 등록
└── performance.json      # 발행 이력 로컬 저장
```

---

## 발행 전략
| 비율 | 유형 | 방법 |
|------|------|------|
| 55% | 트렌드 글 | `content_engine.js` — 국가 맥락 + 훅 제목 |
| 45% | 템플릿 글 | `generator.js` — 주제별 전문 콘텐츠 |

**발행 간격: 10분 (AI 계정 의심 방지)**  
**일일 목표: 15개 (사용량 30% 여유 유지 → 실제 10–12개 권장)**

---

## 콘텐츠 규칙 (항상 준수)
1. **인간적 톤**: 축약형 사용, 반문, 개인 관점, 다양한 단락 길이
2. **국가 맥락 명시**: "US Republicans...", "India's PM Modi..." — 독자가 어느 나라 얘기인지 즉시 알아야 함
3. **훅킹 제목**: 숫자, 긴급감, 독자 이익 중심 ("Here's What You Need to Do")
4. **이미지**:
   - 인물/정치인/유명인 → `wiki_image.js` Wikipedia CC 사진 + 출처 표기
   - 제품/장소 → `images.js` Pexels 카테고리별 이미지
   - AI 생성 이미지 사용 금지
5. **SEO 구조**: FAQ 섹션, 질문형 H2, 답변 우선 형식, 긴꼬리 키워드

---

## 카테고리 & 타겟
| 카테고리 | 타겟 | 예시 주제 |
|----------|------|-----------|
| Finance | US/ALL | 세금, 대출, 신용카드 |
| Government Benefits | IN/US/AU/UK | SNAP, EPF, Centrelink |
| Side Income | ALL | 사이드허슬, 프리랜서 |
| Home & Living | IN/ALL | 가전, 인테리어, 절약 |
| Entertainment | IN/ALL | 볼리우드, 셀럽 수입 |
| Sports | IN/US | IPL, NBA 연봉 |
| India Salary Series | IN | IAS, 소프트웨어, 교사 등 |

---

## 자동 실행 설정
```
Task Scheduler 이름: BloggerAutoPublish
실행 시간: 매일 08:00 AM
명령: node C:\Users\AAA\.claude\blogger-project\auto_publish.js 10
```

### 재등록 방법 (PC 초기화 후):
```powershell
cd C:\Users\AAA\.claude\blogger-project
.\setup_scheduler.ps1
```

---

## 트러블슈팅
| 문제 | 원인 | 해결 |
|------|------|------|
| 토큰 만료 | access_token 만료 | `node auth.js` 실행 → 브라우저 로그인 |
| 이미지 깨짐 | Unsplash redirect URL | Pexels CDN 직접 URL만 사용 |
| 제목 깨짐 | trendToTitle wrapping | `content_engine.js`의 `makeTitle()` 사용 |
| 내용-제목 불일치 | generator 없는 topic | `generator.js`에 해당 topicId 추가 |
| Blogger 403 | 토큰 또는 blog_id 오류 | `.env` 확인 |

---

## 품질 체크 명령어
```bash
# 발행 현황 확인
node auto_publish.js --status

# 현재 트렌드 미리보기
node auto_publish.js --trends

# 기발행 글 내용-제목 불일치 점검
node -e "require('./fix_posts.js')" 

# Wikipedia 이미지 테스트
node wiki_image.js
```

---

## 수익화 포인트
- **고CPC 키워드**: insurance, loan, credit card, mortgage, tax (US $15–30 CPC)
- **고트래픽**: India salary series, government schemes (IN 대용량)
- **전환율 높은 카테고리**: Home & Living (제품 리뷰), Finance (금융 상품)
- AdSense 승인됨 ✅

---

## 메모 & 다음 액션
- [ ] 이미지 실제 뉴스 사진 자동 연동 (wiki_image.js 고도화)
- [ ] Supabase 뷰 데이터로 성과 낮은 주제 자동 교체
- [ ] 30일 후 Google Search Console 데이터 분석
- [ ] 인도 지역 키워드 확장 (Bihar, UP, Maharashtra 특화)
