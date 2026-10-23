(function () {
  var WIDGET_VERSION = '1.1.0';
  if (window.__AGY_POKEMON_WIDGET_VERSION__ === WIDGET_VERSION) return;

  if (window.__AGY_POKEMON_TIMER__) {
    clearInterval(window.__AGY_POKEMON_TIMER__);
    window.__AGY_POKEMON_TIMER__ = null;
  }
  if (window.__AGY_POKEMON_CLEANUP_EVENTS__) {
    try {
      window.__AGY_POKEMON_CLEANUP_EVENTS__();
    } catch (e) {}
  }

  var getById = (document.__agyOrigGetElementById || document.getElementById).bind(document);

  [
    'agy-sidebar-pokemon-widget',
    'agy-pokemon-gallery-modal',
    'agy-pokemon-widget-styles',
  ].forEach(function (id) {
    var el = getById(id);
    if (el) el.remove();
  });

  window.__AGY_POKEMON_WIDGET_VERSION__ = WIDGET_VERSION;

  // Curated pure-transparent animated Pixel Pokémon GIFs with pre-measured pixel bounding boxes (w, h, bbox: [minX, minY, maxX, maxY])
  var DEFAULT_POOL = [
    { id: '12518496361465480470', name: '风速狗 Arcanine', gif: 'https://media.tenor.com/rbqiHWsrhRYAAAAi/arcanine.gif', w: 498, h: 446, bbox: [0, 0, 497, 445] },
    { id: '9566807217432504006', name: '异色耿鬼 Shiny Gengar', gif: 'https://media.tenor.com/hMQgeiW1JsYAAAAi/shiny-gengar-ig.gif', w: 498, h: 491, bbox: [0, 40, 497, 463] },
    { id: '3683607367687920386', name: '水箭龟 Blastoise', gif: 'https://media.tenor.com/Mx7NYmMM2wIAAAAi/blastoise-pokemon-pokemon.gif', w: 498, h: 469, bbox: [0, 0, 497, 468] },
    { id: '5170393747768451700', name: '超梦 Mewtwo', gif: 'https://media.tenor.com/R8DtuDyjonQAAAAi/pokemon.gif', w: 250, h: 250, bbox: [5, 42, 177, 207] },
    { id: '5595659064217727179', name: '奔跑皮卡丘 Pikachu', gif: 'https://media.tenor.com/TafGRZbkcMsAAAAi/pikachu.gif', w: 50, h: 46, bbox: [0, 0, 49, 45] },
    { id: '14707690838420979208', name: '异色暗黑酋雷姆 Shiny Kyurem', gif: 'https://media.tenor.com/zBw25JJZfggAAAAi/shiny-kyurem-pixel-pokemon.gif', w: 398, h: 313, bbox: [16, 8, 397, 311] },
    { id: '1151050818605058867', name: '梦幻 Mew', gif: 'https://media.tenor.com/D_lanvlgizMAAAAi/javier-guerrero-mew-pokemon-nintendo-pixel.gif', w: 350, h: 239, bbox: [77, 16, 320, 215] },
    { id: '12755382211052782200', name: '跳舞百变怪 Dancing Ditto', gif: 'https://media.tenor.com/sQQ4ikAjQngAAAAi/dancing-ditto-ditto.gif', w: 498, h: 438, bbox: [15, 15, 467, 422] },
    { id: '2683502162922140827', name: '焚焰蚣 Centiskorch', gif: 'https://media.tenor.com/JT22_9b3dJsAAAAi/pokemon-cent.gif', w: 96, h: 119, bbox: [5, 10, 89, 118] },
    { id: '12533347377429758894', name: '炎兔儿 Scorbunny', gif: 'https://media.tenor.com/re9lCQZGQ64AAAAi/scorbunny-pokemon.gif', w: 498, h: 488, bbox: [10, 10, 497, 487] },
    { id: '17455873182733583914', name: '喷火龙与波克基斯 Charizard', gif: 'https://media.tenor.com/8j-4LK0aRioAAAAi/pok%C3%A9mon.gif', w: 494, h: 498, bbox: [31, 63, 467, 489] },
    { id: '8739735507504903030', name: '异色超级烈空座 Mega Rayquaza', gif: 'https://media.tenor.com/eUnHI5Oys3YAAAAi/mega-rayquaza-shiny.gif', w: 245, h: 261, bbox: [0, 0, 243, 260] },
    { id: '1249817948324721391', name: '妙蛙种子 Bulbasaur', gif: 'https://media.tenor.com/EVg-zVvNcu8AAAAi/bulbizarre.gif', w: 37, h: 38, bbox: [0, 5, 34, 37] },
    { id: '17364023430976702759', name: '漂浮梦幻 Mew', gif: 'https://media.tenor.com/8PlnT9rtCScAAAAi/mew-pokemon.gif', w: 400, h: 320, bbox: [0, 15, 324, 289] },
    { id: '1060409599997279979', name: '开心妙蛙种子 Bulbasaur', gif: 'https://media.tenor.com/DrdU6bRAfusAAAAi/bulbasaur-pokemon.gif', w: 380, h: 390, bbox: [10, 60, 359, 389] },
    { id: '8145718840008461076', name: '水跃鱼 Mudkip', gif: 'https://media.tenor.com/cQtoIIrpSxQAAAAi/pokemon-mudkip.gif', w: 277, h: 313, bbox: [30, 25, 276, 312] },
    { id: '10678036568687568560', name: '引梦貘人 Hypno', gif: 'https://media.tenor.com/lDABrz9A5rAAAAAi/pokemon-kanto.gif', w: 66, h: 62, bbox: [0, 0, 65, 61] },
    { id: '17757798960270703458', name: '喷火龙 Charizard', gif: 'https://media.tenor.com/9nBgEcu8e2IAAAAi/charizard-pokemon.gif', w: 488, h: 498, bbox: [54, 0, 487, 443] },
    { id: '441466742161328737', name: '海豹球 Spheal', gif: 'https://media.tenor.com/BiBnqbqsymEAAAAi/spheal-spheal-pokemon.gif', w: 250, h: 245, bbox: [0, 30, 249, 244] },
    { id: '17847391667195870811', name: '异色雷公 Shiny Raikou', gif: 'https://media.tenor.com/966sKWp5_lsAAAAi/raykou-pok%C3%A9mon.gif', w: 84, h: 68, bbox: [0, 1, 83, 67] },
    { id: '11283947971648612411', name: '奔跑雷伊布 Jolteon', gif: 'https://media.tenor.com/nJii5TIa6DsAAAAi/pokemon-jolteon-run-pokemon.gif', w: 44, h: 46, bbox: [4, 9, 43, 45] },
    { id: '10179976819260899293', name: '庞岩怪 Gigalith', gif: 'https://media.tenor.com/jUaK-zXBv90AAAAi/gigalith.gif', w: 80, h: 78, bbox: [0, 0, 79, 77] },
    { id: '12029632553660214636', name: '异色基拉祈 Shiny Jirachi', gif: 'https://media.tenor.com/pvHXEmNkbWwAAAAi/jirachi-pok%C3%A9mon.gif', w: 54, h: 47, bbox: [0, 3, 53, 46] },
    { id: '13298601281848783350', name: '像素梦幻 Mew Pixel', gif: 'https://media.tenor.com/uI4faCYmsfYAAAAi/mew-pixel.gif', w: 498, h: 309, bbox: [0, 22, 482, 308] },
    { id: '1651489604562972962', name: '展翅喷火龙 Flying Charizard', gif: 'https://media.tenor.com/FutFC5458SIAAAAi/charizard-pokemon.gif', w: 498, h: 498, bbox: [9, 89, 488, 376] },
    { id: '16705691796005011084', name: '杰尼龟 Squirtle', gif: 'https://media.tenor.com/59aKLYwJPowAAAAi/pokemon-squirtle.gif', w: 471, h: 498, bbox: [105, 104, 470, 497] },
    { id: '14225711143318009915', name: '皮宝宝 Cleffa', gif: 'https://media.tenor.com/xWvg6e7JODsAAAAi/pokemon-cleffa.gif', w: 498, h: 498, bbox: [20, 40, 467, 477] },
    { id: '13581526283291275763', name: '莱希拉姆 Reshiram', gif: 'https://media.tenor.com/vHtGMlc1MfMAAAAi/reshiram-pokemon.gif', w: 108, h: 84, bbox: [5, 1, 106, 83] },
    { id: '16468512493278009596', name: '大舌头 Lickitung', gif: 'https://media.tenor.com/5Ivo29TrGPwAAAAi/pokemon-pok%C3%A9mon.gif', w: 324, h: 264, bbox: [0, 0, 323, 263] },
    { id: '11656454853998245737', name: '仙子伊布 Sylveon', gif: 'https://media.tenor.com/ocQL7mDxd2kAAAAi/pokemon-pok%C3%A9mon.gif', w: 426, h: 455, bbox: [30, 11, 389, 431] },
    { id: '12328162699280152066', name: '异色催眠貘 Shiny Drowzee', gif: 'https://media.tenor.com/qxZuqFfQdgIAAAAi/pokemon-shiny.gif', w: 232, h: 232, bbox: [12, 20, 219, 231] },
    { id: '705103258689290758', name: '木守宫 Treecko', gif: 'https://media.tenor.com/CckHrZAlQgYAAAAi/pokemon-treecko.gif', w: 472, h: 498, bbox: [78, 105, 471, 497] },
    { id: '17706881922413901991', name: '催眠貘 Drowzee', gif: 'https://media.tenor.com/9bt7SxlEOKcAAAAi/pokemon-drowzee.gif', w: 53, h: 58, bbox: [0, 6, 52, 57] },
    { id: '751760831228325422', name: '精灵球 Pokéball', gif: 'https://media.tenor.com/Cm7KfjVqri4AAAAi/pokemon-pokeball.gif', w: 42, h: 43, bbox: [8, 6, 41, 42] },
    { id: '8515036446005580792', name: '牛蛙君 Politoed', gif: 'https://media.tenor.com/dit8iHWq0_gAAAAi/politoed-pokemon.gif', w: 51, h: 79, bbox: [2, 0, 50, 78] },
    { id: '3346351069896327461', name: '异色力壮鸡 Shiny Combusken', gif: 'https://media.tenor.com/LnCgkX7rQSUAAAAi/galifeu-pok%C3%A9mon.gif', w: 71, h: 57, bbox: [10, 0, 59, 56] },
    { id: '10477578637218141943', name: '异色月亮伊布 Shiny Umbreon', gif: 'https://media.tenor.com/kWfWQgmb1vcAAAAi/noctali-pok%C3%A9mon.gif', w: 44, h: 51, bbox: [0, 0, 43, 50] },
    { id: '5881342807630345869', name: '代欧奇希斯 Deoxys', gif: 'https://media.tenor.com/UZ66H3Ma9o0AAAAi/doexys-pok%C3%A9mon.gif', w: 68, h: 77, bbox: [0, 0, 67, 76] },
  ];

  var BBOX_MAP = {};
  DEFAULT_POOL.forEach(function (it) {
    BBOX_MAP[it.id] = { w: it.w, h: it.h, bbox: it.bbox };
  });

  var pool = DEFAULT_POOL.slice();
  var isLocked = localStorage.getItem('agy_pokemon_locked') === '1';
  var lockedId = localStorage.getItem('agy_pokemon_locked_id') || '';
  var isGalleryOpen = false;

  var currentPokemon = null;
  if (isLocked && lockedId) {
    currentPokemon = pool.find(function (p) { return p.id === lockedId; }) || null;
  }
  if (!currentPokemon) {
    currentPokemon = pickRandomFromPool(null);
  }

  function pickRandomFromPool(excludeId) {
    if (!pool || pool.length === 0) return DEFAULT_POOL[0];
    if (pool.length === 1) return pool[0];
    var candidates = excludeId
      ? pool.filter(function (p) { return p.id !== excludeId; })
      : pool;
    if (candidates.length === 0) candidates = pool;
    var idx = Math.floor(Math.random() * candidates.length);
    return candidates[idx];
  }

  // Compute uniform visual dimensions & centering offsets so every Pokémon has the exact same visual proportion
  function computeNormalizedMetrics(p, targetVisualPx, maxW, maxH) {
    var meta = (p && p.w && p.h && p.bbox) ? p : BBOX_MAP[p && p.id];
    var target = targetVisualPx || 86;
    var limitW = maxW || 104;
    var limitH = maxH || 92;
    if (!meta || !meta.w || !meta.h || !meta.bbox) {
      return { w: target, h: target, ox: 0, oy: 0 };
    }
    var w = meta.w;
    var h = meta.h;
    var minX = meta.bbox[0];
    var minY = meta.bbox[1];
    var maxX = meta.bbox[2];
    var maxY = meta.bbox[3];
    var bw = Math.max(1, maxX - minX + 1);
    var bh = Math.max(1, maxY - minY + 1);
    var eff = Math.max(bw, bh) * 0.6 + Math.sqrt(bw * bh) * 0.4;
    var scale = target / eff;
    if (bw * scale > limitW) scale = limitW / bw;
    if (bh * scale > limitH) scale = limitH / bh;
    var rw = Math.round(w * scale);
    var rh = Math.round(h * scale);
    var ox = Math.round((w / 2 - (minX + maxX) / 2) * scale);
    var oy = Math.round((h / 2 - (minY + maxY) / 2) * scale);
    return { w: rw, h: rh, ox: ox, oy: oy };
  }

  function rollNextPokemon(forceEvenIfLocked) {
    if (isLocked && !forceEvenIfLocked) return;
    var prevId = currentPokemon ? currentPokemon.id : null;
    currentPokemon = pickRandomFromPool(prevId);
    if (isLocked) {
      lockedId = currentPokemon.id;
      localStorage.setItem('agy_pokemon_locked_id', lockedId);
    }
    renderAll(true);
  }

  function selectPokemonById(id) {
    var found = pool.find(function (p) { return String(p.id) === String(id); });
    if (!found) return;
    currentPokemon = found;
    if (isLocked) {
      lockedId = currentPokemon.id;
      localStorage.setItem('agy_pokemon_locked_id', lockedId);
    }
    renderAll(true);
  }

  var lastBlurOrHideAt = 0;
  var lastAutoSwitchAt = Date.now();

  function onWindowBlur() {
    lastBlurOrHideAt = Date.now();
  }

  function onWindowFocus() {
    var now = Date.now();
    if (lastBlurOrHideAt > 0 && now - lastBlurOrHideAt >= 450 && now - lastAutoSwitchAt >= 800) {
      lastAutoSwitchAt = now;
      lastBlurOrHideAt = 0;
      rollNextPokemon(false);
    }
  }

  function onVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      lastBlurOrHideAt = Date.now();
    } else if (document.visibilityState === 'visible') {
      var now = Date.now();
      if (now - lastAutoSwitchAt >= 600) {
        lastAutoSwitchAt = now;
        lastBlurOrHideAt = 0;
        rollNextPokemon(false);
      }
    }
  }

  window.addEventListener('blur', onWindowBlur);
  window.addEventListener('focus', onWindowFocus);
  document.addEventListener('visibilitychange', onVisibilityChange);

  window.__AGY_POKEMON_CLEANUP_EVENTS__ = function () {
    window.removeEventListener('blur', onWindowBlur);
    window.removeEventListener('focus', onWindowFocus);
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };

  function ensureStyles() {
    if (getById('agy-pokemon-widget-styles')) return;
    var style = document.createElement('style');
    style.id = 'agy-pokemon-widget-styles';
    style.textContent = [
      '@keyframes agyPkmnPop {',
      '  0% { transform: scale(0.84); opacity: 0.5; }',
      '  65% { transform: scale(1.05); opacity: 1; }',
      '  100% { transform: scale(1); opacity: 1; }',
      '}',
      '.agy-pkmn-card {',
      '  width: 100%;',
      '  margin-bottom: 4px;',
      '  border: none !important;',
      '  outline: none !important;',
      '  background: transparent !important;',
      '  box-shadow: none !important;',
      '  color: var(--foreground, inherit);',
      '  padding: 2px 4px 4px 4px;',
      '  box-sizing: border-box;',
      '  user-select: none;',
      '  position: relative;',
      '}',
      '.agy-pkmn-toolbar {',
      '  position: absolute;',
      '  top: 2px;',
      '  right: 4px;',
      '  display: flex;',
      '  align-items: center;',
      '  gap: 2px;',
      '  opacity: 0;',
      '  pointer-events: none;',
      '  transition: opacity 0.15s ease;',
      '  z-index: 3;',
      '  background: rgba(15, 23, 42, 0.72);',
      '  backdrop-filter: blur(8px);',
      '  padding: 2px 3px;',
      '  border-radius: 7px;',
      '}',
      '.agy-pkmn-card:hover .agy-pkmn-toolbar {',
      '  opacity: 1;',
      '  pointer-events: auto;',
      '}',
      '.agy-pkmn-icon-btn {',
      '  background: transparent;',
      '  border: none;',
      '  outline: none;',
      '  color: #e2e8f0;',
      '  cursor: pointer;',
      '  padding: 2px 4.5px;',
      '  border-radius: 5px;',
      '  font-size: 11px;',
      '  line-height: 1.2;',
      '  display: inline-flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  transition: background 0.12s ease, transform 0.12s ease;',
      '}',
      '.agy-pkmn-icon-btn:hover {',
      '  background: rgba(255, 255, 255, 0.16);',
      '  transform: scale(1.08);',
      '}',
      '.agy-pkmn-icon-btn.active {',
      '  color: #facc15;',
      '  background: rgba(250, 204, 21, 0.18);',
      '}',
      '.agy-pkmn-stage {',
      '  width: 100%;',
      '  height: 98px;',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  cursor: pointer;',
      '  position: relative;',
      '  overflow: hidden;',
      '  border: none !important;',
      '  outline: none !important;',
      '  background: transparent !important;',
      '  box-shadow: none !important;',
      '}',
      '.agy-pkmn-img {',
      '  display: block;',
      '  flex-shrink: 0;',
      '  image-rendering: pixelated;',
      '  border: none !important;',
      '  outline: none !important;',
      '  background: transparent !important;',
      '  box-shadow: none !important;',
      '  filter: none !important;',
      '  clip-path: inset(1px);',
      '  pointer-events: none;',
      '}',
      '.agy-pkmn-pop {',
      '  animation: agyPkmnPop 0.28s cubic-bezier(0.22, 1, 0.36, 1) forwards;',
      '}',
      '.agy-pkmn-footer {',
      '  opacity: 0;',
      '  height: 0;',
      '  margin: 0;',
      '  overflow: hidden;',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  gap: 4px;',
      '  font-size: 10px;',
      '  transition: opacity 0.15s ease, height 0.15s ease;',
      '}',
      '.agy-pkmn-card:hover .agy-pkmn-footer {',
      '  opacity: 0.85;',
      '  height: 15px;',
      '  margin-top: 2px;',
      '}',
      '.agy-pkmn-name {',
      '  font-weight: 600;',
      '  color: var(--muted-foreground, #64748b);',
      '  white-space: nowrap;',
      '  overflow: hidden;',
      '  text-overflow: ellipsis;',
      '}',
      '.agy-pkmn-modal-overlay {',
      '  position: fixed;',
      '  inset: 0;',
      '  z-index: 100000;',
      '  background: rgba(0, 0, 0, 0.58);',
      '  backdrop-filter: blur(5px);',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  padding: 20px;',
      '}',
      '.agy-pkmn-modal-dialog {',
      '  width: min(680px, 94vw);',
      '  max-height: 84vh;',
      '  overflow-y: auto;',
      '  border-radius: 14px;',
      '  border: 1px solid rgba(128,128,128,0.28);',
      '  background: var(--background, #0f172a);',
      '  color: var(--foreground, #f8fafc);',
      '  box-shadow: 0 22px 54px rgba(0,0,0,0.65);',
      '  padding: 16px 20px;',
      '  font-size: 12px;',
      '}',
      '.agy-pkmn-modal-grid {',
      '  display: grid;',
      '  grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));',
      '  gap: 9px;',
      '  margin-top: 12px;',
      '}',
      '.agy-pkmn-modal-item {',
      '  border-radius: 10px;',
      '  border: 1px solid rgba(128,128,128,0.2);',
      '  background: rgba(128,128,128,0.06);',
      '  padding: 8px 6px;',
      '  display: flex;',
      '  flex-direction: column;',
      '  align-items: center;',
      '  gap: 6px;',
      '  cursor: pointer;',
      '  transition: all 0.14s ease;',
      '}',
      '.agy-pkmn-modal-item:hover {',
      '  border-color: rgba(250, 204, 21, 0.65);',
      '  background: rgba(250, 204, 21, 0.1);',
      '  transform: translateY(-2px);',
      '}',
      '.agy-pkmn-modal-item.selected {',
      '  border-color: #38bdf8;',
      '  background: rgba(56, 189, 248, 0.12);',
      '}',
    ].join('\n');
    document.head.appendChild(style);
  }

  function buildWidgetHtml() {
    var p = currentPokemon || DEFAULT_POOL[0];
    var m = computeNormalizedMetrics(p, 86, 104, 92);
    var lockTitle = isLocked
      ? '已锁定当前宝可梦（唤出窗口时不自动更换，点击解锁）'
      : '每次唤出窗口自动随机切换（点击锁定当前宝可梦）';

    var imgStyle =
      'width:' + m.w + 'px;' +
      'height:' + m.h + 'px;' +
      'transform:translate(' + m.ox + 'px,' + m.oy + 'px);';

    return (
      '<div class="agy-pkmn-toolbar">' +
      '<button class="agy-pkmn-icon-btn" data-action="next" title="随机换一只宝可梦 (🎲)">🎲</button>' +
      '<button class="agy-pkmn-icon-btn ' + (isLocked ? 'active' : '') + '" data-action="toggle-lock" title="' + lockTitle + '">' + (isLocked ? '📌' : '🔓') + '</button>' +
      '<button class="agy-pkmn-icon-btn" data-action="open-gallery" title="打开像素宝可梦 GIF 图鉴 (' + pool.length + ' 只)">📖</button>' +
      '</div>' +
      '<div class="agy-pkmn-stage" data-action="stage-click" title="点击随机换一只宝可梦 · ' + p.name + '">' +
      '<img class="agy-pkmn-img" src="' + p.gif + '" alt="' + p.name + '" style="' + imgStyle + '" />' +
      '</div>' +
      '<div class="agy-pkmn-footer">' +
      '<span class="agy-pkmn-name">' + (isLocked ? '📌 ' : '⚡ ') + p.name + '</span>' +
      '</div>'
    );
  }

  function buildGalleryModalHtml() {
    var curId = currentPokemon ? currentPokemon.id : '';
    var cards = pool.map(function (it, i) {
      var isSel = it.id === curId;
      var gm = computeNormalizedMetrics(it, 62, 72, 68);
      var gStyle =
        'width:' + gm.w + 'px;' +
        'height:' + gm.h + 'px;' +
        'transform:translate(' + gm.ox + 'px,' + gm.oy + 'px);' +
        'image-rendering:pixelated;clip-path:inset(1px);';
      return (
        '<div class="agy-pkmn-modal-item ' + (isSel ? 'selected' : '') + '" data-select-id="' + it.id + '" title="点击召唤 ' + it.name + '">' +
        '<div style="width:76px;height:72px;display:flex;align-items:center;justify-content:center;overflow:hidden;">' +
        '<img src="' + it.gif + '" alt="' + it.name + '" loading="lazy" style="' + gStyle + '" />' +
        '</div>' +
        '<div style="font-size:10.5px;font-weight:600;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%;">' +
        '#' + String(i + 1).padStart(2, '0') + ' ' + it.name +
        '</div>' +
        '</div>'
      );
    }).join('');

    return (
      '<div class="agy-pkmn-modal-dialog" data-stop-prop="1">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">' +
      '<div>' +
      '<div style="font-size:15px;font-weight:700;display:flex;align-items:center;gap:6px;">⚡ Tenor 像素宝可梦 GIF 图鉴 (' + pool.length + ' 只)</div>' +
      '<div style="font-size:11px;color:var(--muted-foreground,#94a3b8);margin-top:2px;">已全部统一视觉比例并去除边框 · 点击任意宝可梦立即召唤至左下角</div>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:6px;">' +
      '<button class="agy-pkmn-icon-btn" data-action="next" style="border:1px solid rgba(128,128,128,0.3);padding:5px 10px;border-radius:7px;font-size:11.5px;">🎲 随机抽一只</button>' +
      '<button class="agy-pkmn-icon-btn" data-action="close-gallery" style="border:1px solid rgba(128,128,128,0.3);padding:5px 9px;border-radius:7px;font-size:11.5px;">✕</button>' +
      '</div>' +
      '</div>' +
      '<div class="agy-pkmn-modal-grid">' + cards + '</div>' +
      '</div>'
    );
  }

  function handleAction(action) {
    if (action === 'next' || action === 'stage-click') {
      rollNextPokemon(true);
    } else if (action === 'toggle-lock') {
      isLocked = !isLocked;
      localStorage.setItem('agy_pokemon_locked', isLocked ? '1' : '0');
      if (isLocked && currentPokemon) {
        lockedId = currentPokemon.id;
        localStorage.setItem('agy_pokemon_locked_id', lockedId);
      }
      renderAll(false);
    } else if (action === 'open-gallery') {
      isGalleryOpen = true;
      renderAll(false);
    } else if (action === 'close-gallery') {
      isGalleryOpen = false;
      renderAll(false);
    }
  }

  function renderAll(triggerPop) {
    ensureStyles();

    var settingsBtn = document.querySelector('[data-testid="settings-button"]');
    var card = getById('agy-sidebar-pokemon-widget');

    if (settingsBtn && settingsBtn.parentElement) {
      if (!card) {
        card = document.createElement('div');
        card.id = 'agy-sidebar-pokemon-widget';
        card.className = 'agy-pkmn-card';
        card.addEventListener('click', function (e) {
          var btn = e.target.closest('[data-action]');
          if (!btn) return;
          e.stopPropagation();
          handleAction(btn.getAttribute('data-action'));
        });
        settingsBtn.parentElement.insertBefore(card, settingsBtn);
      } else if (card.nextElementSibling !== settingsBtn) {
        settingsBtn.parentElement.insertBefore(card, settingsBtn);
      }

      var nextHtml = buildWidgetHtml();
      if (card.__lastHtml !== nextHtml) {
        card.__lastHtml = nextHtml;
        card.innerHTML = nextHtml;
      }

      if (triggerPop) {
        var stage = card.querySelector('.agy-pkmn-stage');
        if (stage) {
          stage.classList.remove('agy-pkmn-pop');
          void stage.offsetWidth;
          stage.classList.add('agy-pkmn-pop');
        }
      }
    }

    var modal = getById('agy-pokemon-gallery-modal');
    if (isGalleryOpen) {
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'agy-pokemon-gallery-modal';
        modal.className = 'agy-pkmn-modal-overlay';
        modal.addEventListener('click', function (e) {
          var selItem = e.target.closest('[data-select-id]');
          if (selItem) {
            selectPokemonById(selItem.getAttribute('data-select-id'));
            isGalleryOpen = false;
            renderAll(false);
            return;
          }
          var actBtn = e.target.closest('[data-action]');
          if (actBtn) {
            handleAction(actBtn.getAttribute('data-action'));
            return;
          }
          if (!e.target.closest('[data-stop-prop]')) {
            isGalleryOpen = false;
            renderAll(false);
          }
        });
        document.body.appendChild(modal);
      }
      var nextModalHtml = buildGalleryModalHtml();
      if (modal.__lastHtml !== nextModalHtml) {
        modal.__lastHtml = nextModalHtml;
        modal.innerHTML = nextModalHtml;
      }
    } else if (modal) {
      modal.remove();
    }
  }

  window.__AGY_UPDATE_POKEMON_POOL__ = function (payload) {
    if (payload && Array.isArray(payload.items) && payload.items.length > 0) {
      pool = payload.items.map(function (it) {
        var b = BBOX_MAP[it.id];
        if (b && (!it.w || !it.bbox)) {
          return Object.assign({}, it, b);
        }
        return it;
      });
      window.__AGY_POKEMON_POOL__ = pool;
      if (currentPokemon && !pool.some(function (p) { return p.id === currentPokemon.id; })) {
        currentPokemon = pickRandomFromPool(null);
      }
    }
    renderAll(false);
  };

  window.__AGY_POKEMON_NEXT__ = function (force) {
    rollNextPokemon(force !== false);
  };

  window.__AGY_POKEMON_SELECT__ = function (id) {
    selectPokemonById(id);
  };

  renderAll(true);
  window.__AGY_POKEMON_TIMER__ = setInterval(function () {
    renderAll(false);
  }, 1200);
})();
