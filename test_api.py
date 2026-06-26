"""
Step 1: API 키로 블로그 연결 테스트 (읽기)
Step 2: OAuth 토큰으로 글 발행 테스트 (쓰기)
"""
import os
import json
import urllib.request
import urllib.parse
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("BLOGGER_API_KEY")
BLOG_ID = os.getenv("BLOG_ID")
ACCESS_TOKEN = os.getenv("OAUTH2_ACCESS_TOKEN")

def test_read():
    """API 키로 블로그 정보 읽기"""
    url = f"https://www.googleapis.com/blogger/v3/blogs/{BLOG_ID}?key={API_KEY}"
    try:
        with urllib.request.urlopen(url) as res:
            data = json.loads(res.read())
            print("✅ 블로그 연결 성공!")
            print(f"   이름: {data.get('name')}")
            print(f"   URL: {data.get('url')}")
            print(f"   글 수: {data.get('posts', {}).get('totalItems', 0)}")
            return True
    except Exception as e:
        print(f"❌ 블로그 읽기 실패: {e}")
        return False

def test_write():
    """OAuth 토큰으로 테스트 글 발행"""
    if not ACCESS_TOKEN:
        print("❌ OAUTH2_ACCESS_TOKEN이 비어있음. OAuth 인증 필요 → run: python get_oauth_token.py")
        return False

    url = f"https://www.googleapis.com/blogger/v3/blogs/{BLOG_ID}/posts/"
    payload = json.dumps({
        "kind": "blogger#post",
        "title": "[TEST] API Auto Post",
        "content": "<p>This is a test post via Blogger API v3.</p>"
    }).encode("utf-8")

    req = urllib.request.Request(
        url,
        data=payload,
        headers={
            "Authorization": f"Bearer {ACCESS_TOKEN}",
            "Content-Type": "application/json"
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as res:
            data = json.loads(res.read())
            print("✅ 글 발행 성공!")
            print(f"   제목: {data.get('title')}")
            print(f"   URL: {data.get('url')}")
            return True
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"❌ 글 발행 실패 ({e.code}): {body}")
        return False

if __name__ == "__main__":
    print("=== Blogger API 테스트 ===\n")
    ok = test_read()
    if ok:
        print()
        test_write()
