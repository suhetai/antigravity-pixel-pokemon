#!/bin/sh
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TARGET_DIR="$HOME/.gemini/config/plugins/pixel-pokemon-widget"

echo "⚡ 正在安装/激活 Antigravity 像素宝可梦伴侣插件 (pixel-pokemon-widget)..."

mkdir -p "$HOME/.gemini/config/plugins"

if [ "$SCRIPT_DIR" != "$TARGET_DIR" ]; then
  rm -rf "$TARGET_DIR"
  cp -R "$SCRIPT_DIR" "$TARGET_DIR"
fi

chmod +x "$TARGET_DIR/sidecars/pokemon/run.sh" "$TARGET_DIR/install.sh" "$TARGET_DIR/uninstall.sh" 2>/dev/null || true

# 1. 自动发现正在运行的 Antigravity Language Server 并启用插件与 Sidecar
LS_PID=$(ps -axo pid=,command= | awk '/language_server.*--csrf_token/ && !/awk/ {print $1; exit}')
if [ -n "$LS_PID" ]; then
  CSRF_TOKEN=$(ps -p "$LS_PID" -o command= | sed -n 's/.*--csrf_token \([^ ]*\).*/\1/p')
  PORTS=$(/usr/sbin/lsof -Pan -p "$LS_PID" -iTCP -sTCP:LISTEN 2>/dev/null | awk '/127\.0\.0\.1:/{split($9,a,":"); print a[length(a)]}')
  LS_PORT=""
  for P in $PORTS; do
    if curl -sS --max-time 1 "http://127.0.0.1:${P}/healthz" >/dev/null 2>&1; then
      LS_PORT="$P"
      break
    fi
  done

  if [ -n "$CSRF_TOKEN" ] && [ -n "$LS_PORT" ]; then
    curl -sS -X POST "http://127.0.0.1:${LS_PORT}/exa.language_server_pb.LanguageServerService/JetboxWriteState" \
      -H "Content-Type: application/json" \
      -H "x-codeium-csrf-token: ${CSRF_TOKEN}" \
      -d '{"userConfig":{"plugins":{"pixel-pokemon-widget":{"enabled":true}}}}' >/dev/null 2>&1 || true

    curl -sS -X POST "http://127.0.0.1:${LS_PORT}/exa.language_server_pb.LanguageServerService/ManageSidecar" \
      -H "Content-Type: application/json" \
      -H "x-codeium-csrf-token: ${CSRF_TOKEN}" \
      -d '{"sidecarId":"pixel-pokemon-widget/pokemon","action":"SIDECAR_ACTION_ENABLE"}' >/dev/null 2>&1 || true

    curl -sS -X POST "http://127.0.0.1:${LS_PORT}/exa.language_server_pb.LanguageServerService/ManageSidecar" \
      -H "Content-Type: application/json" \
      -H "x-codeium-csrf-token: ${CSRF_TOKEN}" \
      -d '{"sidecarId":"pixel-pokemon-widget/pokemon","action":"SIDECAR_ACTION_RESTART"}' >/dev/null 2>&1 || true
  fi
fi

# 若新创建的插件目录尚未被当前会话的 Sidecar 管理器加载，则启动后台守护进程实时注入
sleep 0.3
if ! ps -axo command= | grep -q "pixel-pokemon-widget/sidecars/pokemon" 2>/dev/null; then
  (cd "$TARGET_DIR/sidecars/pokemon" && nohup /bin/sh "$TARGET_DIR/sidecars/pokemon/run.sh" >/dev/null 2>&1 &)
fi

# 2. 立即向当前已打开的窗口注入组件（无需等待重启）
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.nvm/versions/node/$(ls "$HOME/.nvm/versions/node" 2>/dev/null | tail -n 1)/bin:$HOME/.volta/bin:$HOME/.fnm/current/bin:$PATH"
if command -v node >/dev/null 2>&1; then
  node -e '
    const fs = require("fs");
    const os = require("os");
    const path = require("path");
    (async () => {
      const candidates = [
        path.join(os.homedir(), "Library", "Application Support", "Antigravity", "DevToolsActivePort"),
        path.join(os.homedir(), ".config", "Antigravity", "DevToolsActivePort")
      ];
      let port = 0;
      for (const c of candidates) {
        if (fs.existsSync(c)) {
          port = parseInt(fs.readFileSync(c, "utf8").split("\n")[0].trim(), 10);
          if (port) break;
        }
      }
      if (!port) return;
      const scriptPath = path.join(os.homedir(), ".gemini", "config", "plugins", "pixel-pokemon-widget", "sidecars", "pokemon", "client-widget.js");
      const clientJs = fs.readFileSync(scriptPath, "utf8");
      const res = await fetch(`http://127.0.0.1:${port}/json`);
      const targets = await res.json();
      for (const t of targets.filter(x => x.type === "page" && x.webSocketDebuggerUrl && !x.url.startsWith("devtools://"))) {
        await new Promise((resolve) => {
          const ws = new WebSocket(t.webSocketDebuggerUrl);
          const timer = setTimeout(() => { try { ws.close(); } catch {} resolve(); }, 1200);
          ws.onopen = () => {
            ws.send(JSON.stringify({ id: 1, method: "Page.enable", params: {} }));
            ws.send(JSON.stringify({ id: 2, method: "Page.addScriptToEvaluateOnNewDocument", params: { source: clientJs } }));
            ws.send(JSON.stringify({ id: 3, method: "Runtime.evaluate", params: { expression: clientJs, silent: true } }));
            setTimeout(() => { clearTimeout(timer); try { ws.close(); } catch {} resolve(); }, 200);
          };
          ws.onerror = () => { clearTimeout(timer); resolve(); };
        });
      }
    })().catch(() => {});
  ' >/dev/null 2>&1 || true
fi

echo "✅ 已成功安装并实时激活 pixel-pokemon-widget！请查看 Antigravity 左下角 Settings 按钮上方。"
