import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PLUGIN_VERSION = '1.1.0';
const TENOR_SEARCH_URL = 'https://tenor.com/zh-CN/search/pixel-pokemon-gifs';

process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));

// Curated pure-transparent animated Pixel Pokémon GIFs with exact frame-union bounding boxes (w, h, bbox: [minX, minY, maxX, maxY])
const BUILTIN_POKEMON_GIFS = [
  {
    id: '12518496361465480470',
    name: '风速狗 Arcanine',
    gif: 'https://media.tenor.com/rbqiHWsrhRYAAAAi/arcanine.gif',
    w: 498,
    h: 446,
    bbox: [0, 0, 497, 445],
  },
  {
    id: '9566807217432504006',
    name: '异色耿鬼 Shiny Gengar',
    gif: 'https://media.tenor.com/hMQgeiW1JsYAAAAi/shiny-gengar-ig.gif',
    w: 498,
    h: 491,
    bbox: [0, 40, 497, 463],
  },
  {
    id: '3683607367687920386',
    name: '水箭龟 Blastoise',
    gif: 'https://media.tenor.com/Mx7NYmMM2wIAAAAi/blastoise-pokemon-pokemon.gif',
    w: 498,
    h: 469,
    bbox: [0, 0, 497, 468],
  },
  {
    id: '5170393747768451700',
    name: '超梦 Mewtwo',
    gif: 'https://media.tenor.com/R8DtuDyjonQAAAAi/pokemon.gif',
    w: 250,
    h: 250,
    bbox: [5, 42, 177, 207],
  },
  {
    id: '5595659064217727179',
    name: '奔跑皮卡丘 Pikachu',
    gif: 'https://media.tenor.com/TafGRZbkcMsAAAAi/pikachu.gif',
    w: 50,
    h: 46,
    bbox: [0, 0, 49, 45],
  },
  {
    id: '14707690838420979208',
    name: '异色暗黑酋雷姆 Shiny Kyurem',
    gif: 'https://media.tenor.com/zBw25JJZfggAAAAi/shiny-kyurem-pixel-pokemon.gif',
    w: 398,
    h: 313,
    bbox: [16, 8, 397, 311],
  },
  {
    id: '1151050818605058867',
    name: '梦幻 Mew',
    gif: 'https://media.tenor.com/D_lanvlgizMAAAAi/javier-guerrero-mew-pokemon-nintendo-pixel.gif',
    w: 350,
    h: 239,
    bbox: [77, 16, 320, 215],
  },
  {
    id: '12755382211052782200',
    name: '跳舞百变怪 Dancing Ditto',
    gif: 'https://media.tenor.com/sQQ4ikAjQngAAAAi/dancing-ditto-ditto.gif',
    w: 498,
    h: 438,
    bbox: [15, 15, 467, 422],
  },
  {
    id: '2683502162922140827',
    name: '焚焰蚣 Centiskorch',
    gif: 'https://media.tenor.com/JT22_9b3dJsAAAAi/pokemon-cent.gif',
    w: 96,
    h: 119,
    bbox: [5, 10, 89, 118],
  },
  {
    id: '12533347377429758894',
    name: '炎兔儿 Scorbunny',
    gif: 'https://media.tenor.com/re9lCQZGQ64AAAAi/scorbunny-pokemon.gif',
    w: 498,
    h: 488,
    bbox: [10, 10, 497, 487],
  },
  {
    id: '17455873182733583914',
    name: '喷火龙与波克基斯 Charizard',
    gif: 'https://media.tenor.com/8j-4LK0aRioAAAAi/pok%C3%A9mon.gif',
    w: 494,
    h: 498,
    bbox: [31, 63, 467, 489],
  },
  {
    id: '8739735507504903030',
    name: '异色超级烈空座 Mega Rayquaza',
    gif: 'https://media.tenor.com/eUnHI5Oys3YAAAAi/mega-rayquaza-shiny.gif',
    w: 245,
    h: 261,
    bbox: [0, 0, 243, 260],
  },
  {
    id: '1249817948324721391',
    name: '妙蛙种子 Bulbasaur',
    gif: 'https://media.tenor.com/EVg-zVvNcu8AAAAi/bulbizarre.gif',
    w: 37,
    h: 38,
    bbox: [0, 5, 34, 37],
  },
  {
    id: '17364023430976702759',
    name: '漂浮梦幻 Mew',
    gif: 'https://media.tenor.com/8PlnT9rtCScAAAAi/mew-pokemon.gif',
    w: 400,
    h: 320,
    bbox: [0, 15, 324, 289],
  },
  {
    id: '1060409599997279979',
    name: '开心妙蛙种子 Bulbasaur',
    gif: 'https://media.tenor.com/DrdU6bRAfusAAAAi/bulbasaur-pokemon.gif',
    w: 380,
    h: 390,
    bbox: [10, 60, 359, 389],
  },
  {
    id: '8145718840008461076',
    name: '水跃鱼 Mudkip',
    gif: 'https://media.tenor.com/cQtoIIrpSxQAAAAi/pokemon-mudkip.gif',
    w: 277,
    h: 313,
    bbox: [30, 25, 276, 312],
  },
  {
    id: '10678036568687568560',
    name: '引梦貘人 Hypno',
    gif: 'https://media.tenor.com/lDABrz9A5rAAAAAi/pokemon-kanto.gif',
    w: 66,
    h: 62,
    bbox: [0, 0, 65, 61],
  },
  {
    id: '17757798960270703458',
    name: '喷火龙 Charizard',
    gif: 'https://media.tenor.com/9nBgEcu8e2IAAAAi/charizard-pokemon.gif',
    w: 488,
    h: 498,
    bbox: [54, 0, 487, 443],
  },
  {
    id: '441466742161328737',
    name: '海豹球 Spheal',
    gif: 'https://media.tenor.com/BiBnqbqsymEAAAAi/spheal-spheal-pokemon.gif',
    w: 250,
    h: 245,
    bbox: [0, 30, 249, 244],
  },
  {
    id: '17847391667195870811',
    name: '异色雷公 Shiny Raikou',
    gif: 'https://media.tenor.com/966sKWp5_lsAAAAi/raykou-pok%C3%A9mon.gif',
    w: 84,
    h: 68,
    bbox: [0, 1, 83, 67],
  },
  {
    id: '11283947971648612411',
    name: '奔跑雷伊布 Jolteon',
    gif: 'https://media.tenor.com/nJii5TIa6DsAAAAi/pokemon-jolteon-run-pokemon.gif',
    w: 44,
    h: 46,
    bbox: [4, 9, 43, 45],
  },
  {
    id: '10179976819260899293',
    name: '庞岩怪 Gigalith',
    gif: 'https://media.tenor.com/jUaK-zXBv90AAAAi/gigalith.gif',
    w: 80,
    h: 78,
    bbox: [0, 0, 79, 77],
  },
  {
    id: '12029632553660214636',
    name: '异色基拉祈 Shiny Jirachi',
    gif: 'https://media.tenor.com/pvHXEmNkbWwAAAAi/jirachi-pok%C3%A9mon.gif',
    w: 54,
    h: 47,
    bbox: [0, 3, 53, 46],
  },
  {
    id: '13298601281848783350',
    name: '像素梦幻 Mew Pixel',
    gif: 'https://media.tenor.com/uI4faCYmsfYAAAAi/mew-pixel.gif',
    w: 498,
    h: 309,
    bbox: [0, 22, 482, 308],
  },
  {
    id: '1651489604562972962',
    name: '展翅喷火龙 Flying Charizard',
    gif: 'https://media.tenor.com/FutFC5458SIAAAAi/charizard-pokemon.gif',
    w: 498,
    h: 498,
    bbox: [9, 89, 488, 376],
  },
  {
    id: '16705691796005011084',
    name: '杰尼龟 Squirtle',
    gif: 'https://media.tenor.com/59aKLYwJPowAAAAi/pokemon-squirtle.gif',
    w: 471,
    h: 498,
    bbox: [105, 104, 470, 497],
  },
  {
    id: '14225711143318009915',
    name: '皮宝宝 Cleffa',
    gif: 'https://media.tenor.com/xWvg6e7JODsAAAAi/pokemon-cleffa.gif',
    w: 498,
    h: 498,
    bbox: [20, 40, 467, 477],
  },
  {
    id: '13581526283291275763',
    name: '莱希拉姆 Reshiram',
    gif: 'https://media.tenor.com/vHtGMlc1MfMAAAAi/reshiram-pokemon.gif',
    w: 108,
    h: 84,
    bbox: [5, 1, 106, 83],
  },
  {
    id: '16468512493278009596',
    name: '大舌头 Lickitung',
    gif: 'https://media.tenor.com/5Ivo29TrGPwAAAAi/pokemon-pok%C3%A9mon.gif',
    w: 324,
    h: 264,
    bbox: [0, 0, 323, 263],
  },
  {
    id: '11656454853998245737',
    name: '仙子伊布 Sylveon',
    gif: 'https://media.tenor.com/ocQL7mDxd2kAAAAi/pokemon-pok%C3%A9mon.gif',
    w: 426,
    h: 455,
    bbox: [30, 11, 389, 431],
  },
  {
    id: '12328162699280152066',
    name: '异色催眠貘 Shiny Drowzee',
    gif: 'https://media.tenor.com/qxZuqFfQdgIAAAAi/pokemon-shiny.gif',
    w: 232,
    h: 232,
    bbox: [12, 20, 219, 231],
  },
  {
    id: '705103258689290758',
    name: '木守宫 Treecko',
    gif: 'https://media.tenor.com/CckHrZAlQgYAAAAi/pokemon-treecko.gif',
    w: 472,
    h: 498,
    bbox: [78, 105, 471, 497],
  },
  {
    id: '17706881922413901991',
    name: '催眠貘 Drowzee',
    gif: 'https://media.tenor.com/9bt7SxlEOKcAAAAi/pokemon-drowzee.gif',
    w: 53,
    h: 58,
    bbox: [0, 6, 52, 57],
  },
  {
    id: '751760831228325422',
    name: '精灵球 Pokéball',
    gif: 'https://media.tenor.com/Cm7KfjVqri4AAAAi/pokemon-pokeball.gif',
    w: 42,
    h: 43,
    bbox: [8, 6, 41, 42],
  },
  {
    id: '8515036446005580792',
    name: '牛蛙君 Politoed',
    gif: 'https://media.tenor.com/dit8iHWq0_gAAAAi/politoed-pokemon.gif',
    w: 51,
    h: 79,
    bbox: [2, 0, 50, 78],
  },
  {
    id: '3346351069896327461',
    name: '异色力壮鸡 Shiny Combusken',
    gif: 'https://media.tenor.com/LnCgkX7rQSUAAAAi/galifeu-pok%C3%A9mon.gif',
    w: 71,
    h: 57,
    bbox: [10, 0, 59, 56],
  },
  {
    id: '10477578637218141943',
    name: '异色月亮伊布 Shiny Umbreon',
    gif: 'https://media.tenor.com/kWfWQgmb1vcAAAAi/noctali-pok%C3%A9mon.gif',
    w: 44,
    h: 51,
    bbox: [0, 0, 43, 50],
  },
  {
    id: '5881342807630345869',
    name: '代欧奇希斯 Deoxys',
    gif: 'https://media.tenor.com/UZ66H3Ma9o0AAAAi/doexys-pok%C3%A9mon.gif',
    w: 68,
    h: 77,
    bbox: [0, 0, 67, 76],
  },
];

// Exclude non-transparent, static 1-frame, or non-Pokémon items
const EXCLUDED_IDS = new Set([
  '10442168578654829458', // Octopus Pink
  '16425663193241559968', // Generic arrow pixel
  '3973998804904151705',  // Danganronpa Ishimaru
  '1068863632907093594',  // Non-transparent Flareon with solid background box
  '18023551824800170796', // Pikachu Eyebrow with frame border artifacts
  '975239851112227690',   // Static 1-frame image
  '14083143474562285380', // Static 1-frame image
  '1720457426526321355',  // Static 1-frame trainer image
  '15872857098495932180', // Human trainer
  '10457942118558745507', // Human trainer
  '2872330182237004921',  // Human trainer
  '373390148464612968',   // Human trainer
  '1942539076440967733',  // 2-frame Psyduck with corner pixels
]);

function getClientInjectScript() {
  return fs.readFileSync(path.join(__dirname, 'client-widget.js'), 'utf-8');
}

async function loadSidecarApp() {
  const candidates = [
    path.join(os.homedir(), '.gemini', 'config', 'node_modules', 'sidecar_sdk', 'index.mjs'),
    path.join(os.homedir(), '.gemini', 'antigravity', 'lib', 'node_modules', 'sidecar_sdk', 'index.mjs'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      const mod = await import(pathToFileURL(candidate).href);
      return mod.SidecarApp;
    }
  }
  const mod = await import('sidecar_sdk');
  return mod.SidecarApp;
}

function getDevToolsPortFileCandidates() {
  const home = os.homedir();
  return [
    process.env.AGY_BROWSER_ACTIVE_PORT_FILE,
    path.join(home, 'Library', 'Application Support', 'Antigravity', 'DevToolsActivePort'),
    path.join(home, '.config', 'Antigravity', 'DevToolsActivePort'),
    process.env.APPDATA ? path.join(process.env.APPDATA, 'Antigravity', 'DevToolsActivePort') : null,
  ].filter(Boolean);
}

function getDataDir() {
  const dir =
    process.env.ANTIGRAVITY_EXECUTABLE_DATA_DIR ||
    path.join(
      os.homedir(),
      '.gemini',
      'antigravity',
      'sidecar_data',
      'pixel-pokemon-widget',
      'pokemon',
      'data'
    );
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch {
    // ignore
  }
  return dir;
}

let pokemonPool = [...BUILTIN_POKEMON_GIFS];

// --- CDP Injector Manager (attaches to Antigravity Renderer Windows) ---
const activeSockets = new Map(); // pageId -> WebSocket

async function syncRendererWindows(payload, commandExpr = '') {
  let portStr = '';
  for (const candidate of getDevToolsPortFileCandidates()) {
    try {
      if (fs.existsSync(candidate)) {
        portStr = fs.readFileSync(candidate, 'utf-8').split('\n')[0].trim();
        if (portStr) break;
      }
    } catch {
      // try next
    }
  }
  const port = parseInt(portStr, 10);
  if (!port) return;

  let targets = [];
  try {
    const res = await fetch(`http://127.0.0.1:${port}/json`);
    if (res.ok) {
      targets = await res.json();
    }
  } catch {
    return;
  }

  const pages = targets.filter(
    (t) => t.type === 'page' && t.webSocketDebuggerUrl && !t.url.startsWith('devtools://')
  );

  const clientScript = getClientInjectScript();
  const payloadJson = JSON.stringify(payload);
  const evalExpr = `${clientScript}\nif (typeof window.__AGY_UPDATE_POKEMON_POOL__ === 'function') { window.__AGY_UPDATE_POKEMON_POOL__(${payloadJson}); }\n${commandExpr}`;

  for (const page of pages) {
    const existing = activeSockets.get(page.id);
    if (existing && existing.readyState === WebSocket.OPEN) {
      existing.send(
        JSON.stringify({
          id: Date.now() % 1000000,
          method: 'Runtime.evaluate',
          params: { expression: evalExpr, silent: true },
        })
      );
      continue;
    }

    if (existing && existing.readyState === WebSocket.CONNECTING) {
      continue;
    }

    try {
      const ws = new WebSocket(page.webSocketDebuggerUrl);
      activeSockets.set(page.id, ws);

      ws.onopen = () => {
        ws.send(JSON.stringify({ id: 1, method: 'Page.enable', params: {} }));
        ws.send(
          JSON.stringify({
            id: 2,
            method: 'Page.addScriptToEvaluateOnNewDocument',
            params: { source: clientScript },
          })
        );
        ws.send(
          JSON.stringify({
            id: 3,
            method: 'Runtime.evaluate',
            params: { expression: evalExpr, silent: true },
          })
        );
      };

      ws.onclose = () => {
        activeSockets.delete(page.id);
      };

      ws.onerror = () => {
        activeSockets.delete(page.id);
      };
    } catch {
      activeSockets.delete(page.id);
    }
  }
}

// --- Aux Pane Web UI HTML ---
function renderAuxPaneHtml() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>像素宝可梦图鉴</title>
  <script src="/preload.js"></script>
  <style>
    :root { color-scheme: dark light; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--background, #0f172a);
      color: var(--foreground, #f8fafc);
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
      gap: 8px;
      flex-wrap: wrap;
    }
    .title {
      font-size: 15px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .actions {
      display: flex;
      gap: 6px;
    }
    .btn {
      padding: 6px 11px;
      border-radius: 8px;
      border: 1px solid rgba(128,128,128,0.28);
      background: rgba(128,128,128,0.1);
      color: inherit;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: all 0.15s ease;
    }
    .btn:hover {
      background: rgba(56, 189, 248, 0.18);
      border-color: rgba(56, 189, 248, 0.45);
    }
    .sub {
      font-size: 12px;
      opacity: 0.72;
      margin-bottom: 14px;
      line-height: 1.45;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));
      gap: 10px;
    }
    .card {
      border-radius: 11px;
      border: 1px solid rgba(128,128,128,0.22);
      background: rgba(128,128,128,0.06);
      padding: 10px 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      cursor: pointer;
      transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease;
    }
    .card:hover {
      transform: translateY(-2px);
      border-color: rgba(250, 204, 21, 0.6);
      background: rgba(250, 204, 21, 0.08);
    }
    .sprite-wrap {
      width: 76px;
      height: 76px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .sprite-wrap img {
       width: 72px;
      height: 72px;
      object-fit: contain;
      image-rendering: pixelated;
    }
    .name {
      font-size: 11px;
      font-weight: 600;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">⚡ 像素宝可梦 GIF 图鉴</div>
    <div class="actions">
      <button class="btn" id="rollBtn">🎲 随机换一只</button>
    </div>
  </div>
  <div class="sub">
    点击任意宝可梦即可立即召唤至左下角！每次重新唤出窗口时也会自动随机切换。
  </div>
  <div class="grid" id="grid">正在加载宝可梦图鉴...</div>

  <script>
    const fetcher = window.sidecar?.fetch || fetch;
    let items = [];

    async function loadPool() {
      try {
        const res = await fetcher('/api/pokemon', { method: 'GET' });
        const data = await res.json();
        items = data.items || [];
        render();
      } catch (e) {
        console.error(e);
      }
    }

    async function selectPokemon(id) {
      try {
        await fetcher('/api/select', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
      } catch (e) {
        console.error(e);
      }
    }

    function render() {
      const grid = document.getElementById('grid');
      grid.innerHTML = items.map((it, idx) => \`
        <div class="card" data-id="\${it.id}" title="点击在左下角召唤 \${it.name}">
          <div class="sprite-wrap">
            <img src="\${it.gif}" alt="\${it.name}" loading="lazy" />
          </div>
          <div class="name">#\${String(idx + 1).padStart(2, '0')} \${it.name}</div>
        </div>
      \`).join('');

      grid.querySelectorAll('.card').forEach(el => {
        el.onclick = () => selectPokemon(el.getAttribute('data-id'));
      });
    }

    document.getElementById('rollBtn').onclick = () => selectPokemon('random');
    loadPool();
  </script>
</body>
</html>`;
}

async function tick(commandExpr = '') {
  const payload = {
    version: PLUGIN_VERSION,
    sourceUrl: TENOR_SEARCH_URL,
    items: pokemonPool,
    updatedAt: new Date().toISOString(),
  };
  await syncRendererWindows(payload, commandExpr);
  return payload;
}

async function main() {
  const pidFile = path.join(getDataDir(), 'daemon.pid');
  if (!process.env.ANTIGRAVITY_SIDECAR_WEB_PORT) {
    try {
      if (fs.existsSync(pidFile)) {
        const oldPid = parseInt(fs.readFileSync(pidFile, 'utf-8').trim(), 10);
        if (oldPid && oldPid !== process.pid) {
          try {
            process.kill(oldPid, 'SIGTERM');
          } catch {}
        }
      }
      fs.writeFileSync(pidFile, String(process.pid), 'utf-8');
    } catch {}
  } else {
    try {
      if (fs.existsSync(pidFile)) {
        const oldPid = parseInt(fs.readFileSync(pidFile, 'utf-8').trim(), 10);
        if (oldPid && oldPid !== process.pid) {
          try {
            process.kill(oldPid, 'SIGTERM');
          } catch {}
        }
        fs.unlinkSync(pidFile);
      }
    } catch {}
  }

  await tick();

  setInterval(() => {
    tick().catch((err) => console.error('[pokemon tick error]', err));
  }, 3500);

  if (process.env.ANTIGRAVITY_SIDECAR_WEB_PORT) {
    const SidecarApp = await loadSidecarApp();
    const app = new SidecarApp();
    app.page('/', () => renderAuxPaneHtml());
    app.api(
      '/api/pokemon',
      async () => {
        return await tick();
      },
      'GET'
    );
    app.api(
      '/api/select',
      async (data) => {
        const targetId = data?.id || 'random';
        const expr =
          targetId === 'random'
            ? `if (typeof window.__AGY_POKEMON_NEXT__ === 'function') window.__AGY_POKEMON_NEXT__(true);`
            : `if (typeof window.__AGY_POKEMON_SELECT__ === 'function') window.__AGY_POKEMON_SELECT__(${JSON.stringify(targetId)});`;
        return await tick(expr);
      },
      'POST'
    );
    await app.run();
  }
}

main().catch((err) => {
  console.error('[pixel-pokemon-widget fatal]', err);
  process.exit(1);
});
