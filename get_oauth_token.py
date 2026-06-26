"""
OAuth 2.0 토큰 발급 스크립트
실행: python get_oauth_token.py
브라우저에서 Google 로그인 후 코드를 붙여넣으면 토큰 자동 저장
"""
import os
import json
import urllib.request
import urllib.parse
from dotenv import load_dotenv

load_dotenv()

CLIENT_ID = os.getenv("OAUTH2_CLIENT_ID")
CLIENT_SECRET = os.getenv("OAUTH2_CLIENT_SECRET")
REDIRECT_URI = "urn:ietf:wg:oauth:2.0:oob"
SCOPE = "https://www.googleapis.com/auth/blogger"

def get_auth_url():
    params = urllib.parse.urlencode({
        "client_id": CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "response_type": "code",
        "scope": SCOPE,
        "access_type": "offline",
        "prompt": "consent"
    })
    return f"https://accounts.google.com/o/oauth2/auth?{params}"

def exchange_code(code):
    data = urllib.parse.urlencode({
        "code": code,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code"
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://oauth2.googleapis.com/token",
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST"
    )
    with urllib.request.urlopen(req) as res:
        return json.loads(res.read())

def save_tokens(tokens):
    env_path = ".env"
    with open(env_path, "r") as f:
        content = f.read()

    content = content.replace(
        f"OAUTH2_ACCESS_TOKEN=",
        f"OAUTH2_ACCESS_TOKEN={tokens['access_token']}"
    ) if "OAUTH2_ACCESS_TOKEN=" in content and not tokens.get('access_token') in content else content

    lines = content.splitlines()
    new_lines = []
    for line in lines:
        if line.startswith("OAUTH2_ACCESS_TOKEN="):
            new_lines.append(f"OAUTH2_ACCESS_TOKEN={tokens['access_token']}")
        elif line.startswith("OAUTH2_REFRESH_TOKEN="):
            new_lines.append(f"OAUTH2_REFRESH_TOKEN={tokens.get('refresh_token', '')}")
        else:
            new_lines.append(line)

    with open(env_path, "w") as f:
        f.write("\n".join(new_lines))

    print("✅ .env에 토큰 저장 완료")

if __name__ == "__main__":
    if not CLIENT_ID or not CLIENT_SECRET:
        print("❌ .env에 OAUTH2_CLIENT_ID, OAUTH2_CLIENT_SECRET를 먼저 입력하세요")
        print("   Google Cloud Console > API 및 서비스 > 사용자 인증 정보 > OAuth 2.0 클라이언트 ID")
        exit(1)

    print("=== OAuth 2.0 토큰 발급 ===\n")
    print("1. 아래 URL을 브라우저에서 열어 imda0708@gmail.com으로 로그인하세요:")
    print()
    print(get_auth_url())
    print()
    code = input("2. 브라우저에 표시된 코드를 붙여넣으세요: ").strip()

    try:
        tokens = exchange_code(code)
        save_tokens(tokens)
        print(f"\n✅ 토큰 발급 성공!")
        print(f"   Access Token: {tokens['access_token'][:30]}...")
        print(f"   Refresh Token: {tokens.get('refresh_token', 'N/A')[:30]}...")
    except Exception as e:
        print(f"❌ 토큰 발급 실패: {e}")
