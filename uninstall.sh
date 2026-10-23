#!/bin/sh
set -e

TARGET_DIR="$HOME/.gemini/config/plugins/pixel-pokemon-widget"

echo "🧹 正在停用/卸载像素宝可梦伴侣插件 (pixel-pokemon-widget)..."

# 1. 自动发现正在运行的 Antigravity Language Server 并停用 Sidecar 与插件
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
    curl -sS -X POST "http://127.0.0.1:${LS_PORT}/exa.language_server_pb.LanguageServerService/ManageSidecar" \
      -H "Content-Type: application/json" \
      -H "x-codeium-csrf-token: ${CSRF_TOKEN}" \
      -d '{"sidecarId":"pixel-pokemon-widget/pokemon","action":"SIDECAR_ACTION_DISABLE"}' >/dev/null 2>&1 || true

    curl -sS -X POST "http://127.0.0.1:${LS_PORT}/exa.language_server_pb.LanguageServerService/JetboxWriteState" \
      -H "Content-Type: application/json" \
      -H "x-codeium-csrf-token: ${CSRF_TOKEN}" \
      -d '{"userConfig":{"plugins":{"pixel-pokemon-widget":{"enabled":false}}}}' >/dev/null 2>&1 || true
  fi
fi

# 2. 清理独立守护进程（如有）
pkill -f "pixel-pokemon-widget/sidecars/pokemon/server.mjs" 2>/dev/null || true

# 3. 实时清理已打开窗口中的 DOM 节点与事件监听
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
      const res = await fetch(`http://127.0.0.1:${port}/json`);
      const targets = await res.json();
      const cleanupJs = `
        if (window.__AGY_POKEMON_TIMER__) clearInterval(window.__AGY_POKEMON_TIMER__);
        if (window.__AGY_POKEMON_CLEANUP_EVENTS__) { try { window.__AGY_POKEMON_CLEANUP_EVENTS__(); } catch (e) {} }
        window.__AGY_POKEMON_WIDGET_VERSION__ = null;
        const getById = (document.__agyOrigGetElementById || document.getElementById).bind(document);
        ["agy-sidebar-pokemon-widget","agy-pokemon-gallery-modal","agy-pokemon-widget-styles"].forEach(id => {
          const el = getById(id);
          if (el) el.remove();
        });
      `;
      for (const t of targets.filter(x => x.type === "page" && x.webSocketDebuggerUrl && !x.url.startsWith("devtools://"))) {
        await new Promise((resolve) => {
          const ws = new WebSocket(t.webSocketDebuggerUrl);
          const timer = setTimeout(() => { try { ws.close(); } catch {} resolve(); }, 1000);
          ws.onopen = () => {
            ws.send(JSON.stringify({ id: 1, method: "Runtime.evaluate", params: { expression: cleanupJs, silent: true } }));
            setTimeout(() => { clearTimeout(timer); try { ws.close(); } catch {} resolve(); }, 150);
          };
          ws.onerror = () => { clearTimeout(timer); resolve(); };
        });
      }
    })().catch(() => {});
  ' >/dev/null 2>&1 || true
fi

if [ "$1" = "--delete" ] && [ -d "$TARGET_DIR" ]; then
  rm -rf "$TARGET_DIR"
  echo "✅ 已彻底删除 pixel-pokemon-widget 插件目录！"
else
  echo "✅ 已停用 pixel-pokemon-widget 插件并清理窗口左下角宝可梦组件！"
fi
