#!/bin/sh
# Auto-locate Node.js across standard macOS / Linux / version-manager paths
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.volta/bin:$HOME/.fnm/current/bin:$HOME/.asdf/shims:$HOME/.local/bin:$PATH"

if ! command -v node >/dev/null 2>&1; then
  if [ -d "$HOME/.nvm/versions/node" ]; then
    LATEST_NVM_NODE=$(ls -d "$HOME/.nvm/versions/node"/*/bin 2>/dev/null | tail -n 1)
    if [ -n "$LATEST_NVM_NODE" ]; then
      export PATH="$LATEST_NVM_NODE:$PATH"
    fi
  fi
fi

exec node server.mjs
