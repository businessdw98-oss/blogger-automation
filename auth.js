const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ENV_PATH = path.join(__dirname, ".env");

function loadEnv() {
  const env = {};
  fs.readFileSync(ENV_PATH, "utf8").split("\n").forEach(line => {
    const [k, ...v] = line.split("=");
    if (k && v.length) env[k.trim()] = v.join("=").trim();
  });
  return env;
}

function saveToEnv(key, value) {
  let content = fs.readFileSync(ENV_PATH, "utf8");
  const regex = new RegExp(`^${key}=.*`, "m");
  if (regex.test(content)) {
    content = content.replace(regex, `${key}=${value}`);
  } else {
    content += `\n${key}=${value}`;
  }
  fs.writeFileSync(ENV_PATH, content);
}

function post(url, data) {
  return new Promise((resolve, reject) => {
    const body = new URLSearchParams(data).toString();
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(body)
      }
    };
    const req = https.request(url, options, res => {
      let raw = "";
      res.on("data", d => (raw += d));
      res.on("end", () => {
        try { resolve(JSON.parse(raw)); }
        catch { reject(new Error(raw)); }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function refreshAccessToken(env) {
  if (!env.OAUTH2_REFRESH_TOKEN) return null;
  try {
    const tokens = await post("https://oauth2.googleapis.com/token", {
      client_id: env.OAUTH2_CLIENT_ID,
      client_secret: env.OAUTH2_CLIENT_SECRET,
      refresh_token: env.OAUTH2_REFRESH_TOKEN,
      grant_type: "refresh_token"
    });
    if (tokens.access_token) {
      saveToEnv("OAUTH2_ACCESS_TOKEN", tokens.access_token);
      console.log("✅ Access Token 갱신 완료");
      return tokens.access_token;
    }
  } catch (e) {
    console.error("토큰 갱신 실패:", e.message);
  }
  return null;
}

const REDIRECT_URI = "http://localhost:8080";

async function runOAuthFlow(env) {
  const authUrl =
    `https://accounts.google.com/o/oauth2/auth?` +
    new URLSearchParams({
      client_id: env.OAUTH2_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: "code",
      scope: "https://www.googleapis.com/auth/blogger",
      access_type: "offline",
      prompt: "consent"
    }).toString();

  console.log("\n=== OAuth 인증 ===");
  console.log("브라우저에서 businessdw98@gmail.com으로 로그인하세요...\n");
  require("child_process").exec(`start "" "${authUrl}"`);
  console.log("(브라우저가 안 열리면 아래 URL을 직접 복사해서 열어주세요)");
  console.log(authUrl);
  console.log("\n로그인 완료되면 자동으로 진행됩니다...\n");

  const code = await new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, REDIRECT_URI);
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");

      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      if (code) {
        res.end("<h2>✅ 인증 완료! 이 탭을 닫아도 됩니다.</h2>");
        server.close();
        resolve(code);
      } else {
        res.end(`<h2>❌ 오류: ${error}</h2>`);
        server.close();
        reject(new Error(error));
      }
    });
    server.listen(8080, () => {
      console.log("로컬 서버 대기 중 (port 8080)...");
    });
    server.on("error", reject);
  });

  const tokens = await post("https://oauth2.googleapis.com/token", {
    code,
    client_id: env.OAUTH2_CLIENT_ID,
    client_secret: env.OAUTH2_CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code"
  });

  if (tokens.access_token) {
    saveToEnv("OAUTH2_ACCESS_TOKEN", tokens.access_token);
    if (tokens.refresh_token) saveToEnv("OAUTH2_REFRESH_TOKEN", tokens.refresh_token);
    console.log("✅ 토큰 저장 완료!");
    return tokens.access_token;
  } else {
    throw new Error(JSON.stringify(tokens));
  }
}

async function getValidToken() {
  const env = loadEnv();

  if (env.OAUTH2_REFRESH_TOKEN) {
    const token = await refreshAccessToken(env);
    if (token) return token;
  }

  return await runOAuthFlow(env);
}

module.exports = { loadEnv, getValidToken, saveToEnv };

if (require.main === module) {
  getValidToken().then(token => {
    console.log("Access Token:", token.slice(0, 40) + "...");
  }).catch(console.error);
}
