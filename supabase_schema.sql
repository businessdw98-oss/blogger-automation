-- Supabase에서 실행: SQL Editor에 붙여넣고 Run

create table if not exists posts (
  id           bigserial primary key,
  topic_id     text,
  title        text not null,
  url          text,
  target       text,
  labels       text[],
  published_at timestamptz default now(),
  views        integer default 0,
  clicks       integer default 0,
  revenue      numeric(10,4) default 0
);

create table if not exists trend_logs (
  id         bigserial primary key,
  topic      text not null,
  source     text,
  geo        text,
  score      integer default 0,
  fetched_at timestamptz default now()
);

create table if not exists strategy (
  id              bigserial primary key,
  date            date not null,
  analysis        text,
  recommendations text,
  top_topics      text[],
  views_total     integer default 0,
  posts_total     integer default 0,
  created_at      timestamptz default now()
);

-- 유용한 뷰: 타겟별 성과
create or replace view posts_by_target as
select
  target,
  count(*)        as total_posts,
  sum(views)      as total_views,
  sum(clicks)     as total_clicks,
  sum(revenue)    as total_revenue,
  round(avg(views), 0) as avg_views
from posts
group by target
order by total_views desc;

-- 유용한 뷰: 주제별 성과
create or replace view posts_by_topic as
select
  topic_id,
  count(*)        as total_posts,
  sum(views)      as total_views,
  round(avg(views), 0) as avg_views
from posts
group by topic_id
order by avg_views desc;
