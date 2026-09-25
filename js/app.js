/* Preciso ou quero? - lógica do jogo
   Vanilla JS, sem dependências, sem requisições externas. */
(() => {
  'use strict';

  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  const EMOJI = './assets/emoji/';

  // f = arquivo em assets/emoji, n = legenda, t = lado correto
  const ALL = [
    {f:'comida',        n:'Comida',            t:'p'},
    {f:'agua',          n:'Água',              t:'p'},
    {f:'casa',          n:'Casa',              t:'p'},
    {f:'remedio',       n:'Remédio',           t:'p'},
    {f:'casaco',        n:'Casaco no frio',    t:'p'},
    {f:'escova-dentes', n:'Escova de dentes',  t:'p'},
    {f:'videogame',     n:'Videogame',         t:'q'},
    {f:'tenis',         n:'Tênis novo',        t:'q'},
    {f:'celular',       n:'Celular novo',      t:'q'},
    {f:'doce',          n:'Doce',              t:'q'},
    {f:'brinquedo',     n:'Brinquedo',         t:'q'},
    {f:'fone',          n:'Fone novo',         t:'q'}
  ];

  // deixa as figuras prontas antes da primeira carta, para não piscar
  ALL.concat([{f:'interrogacao'},{f:'faiscas'},{f:'estrela'}]).forEach(it => {
    const img = new Image(); img.src = EMOJI + it.f + '.svg';
  });

  function emojiImg(file, alt){
    const img = document.createElement('img');
    img.className = 'emoji';
    img.src = EMOJI + file + '.svg';
    img.alt = alt || '';
    return img;
  }

  // embaralha sem deixar 3 cartas seguidas do mesmo lado
  function shuffle(){
    let a;
    do {
      a = ALL.slice();
      for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; }
    } while (a.some((x,i) => i > 1 && x.t === a[i-1].t && x.t === a[i-2].t));
    return a;
  }

  const card = $('#card'), zoneP = $('#zoneP'), zoneQ = $('#zoneQ'), cardEmoji = $('#cardEmoji');
  let items = [], idx = 0, phase = 'start';

  function show(id){ $$('.screen').forEach(s => s.classList.toggle('active', s.id === id)); }

  function setCardFace(file, alt){ cardEmoji.src = EMOJI + file + '.svg'; cardEmoji.alt = alt; }

  function startGame(){
    show('game');
    items = shuffle(); idx = 0;
    $('#pileP').innerHTML = ''; $('#pileQ').innerHTML = '';
    $('#progress').innerHTML = items.map(() => '<i></i>').join('');
    $('#endbox').classList.remove('show');
    dealCard();
  }
  function goHome(){ phase = 'start'; show('start'); }

  function dealCard(){
    zoneP.classList.remove('hit','ready'); zoneQ.classList.remove('hit','ready');
    $('#next').classList.remove('show');
    $('#arrows').classList.add('hide');
    $$('#progress i').forEach((d,i) => d.classList.toggle('now', i === idx));
    card.style.transition = 'none'; card.style.transform = ''; card.style.opacity = '1'; card.style.animation = '';
    card.style.display = 'flex';
    card.className = 'card back';
    setCardFace('interrogacao', 'Carta virada'); $('#cardName').textContent = '.';
    void card.offsetWidth; card.classList.add('enter');
    phase = 'hidden';
  }

  // virar a carta: dá tempo do intérprete preparar a turma
  function flip(){
    if (phase !== 'hidden') return;
    phase = 'flipping';
    const it = items[idx];
    card.classList.remove('enter');
    card.style.transition = 'transform .22s ease-in';
    card.style.transform = 'scaleX(0)';
    setTimeout(() => {
      card.className = 'card front';
      setCardFace(it.f, it.n); $('#cardName').textContent = it.n;
      card.style.transition = 'transform .22s ease-out';
      card.style.transform = 'scaleX(1)';
      setTimeout(() => {
        card.style.transform = '';
        $('#arrows').classList.remove('hide');
        zoneP.classList.add('ready'); zoneQ.classList.add('ready');
        phase = 'ask';
      }, 230);
    }, 230);
  }

  function sparkle(zone){
    const r = zone.getBoundingClientRect();
    const cx = r.left + r.width/2, cy = r.top + r.height*0.2;
    for (let i = 0; i < 7; i++){
      const s = document.createElement('span');
      s.className = 'spark';
      s.appendChild(emojiImg(i % 2 ? 'faiscas' : 'estrela'));
      const ang = (Math.PI*2/7)*i, dist = 90 + Math.random()*40;
      s.style.left = (cx-22)+'px'; s.style.top = (cy-22)+'px';
      s.style.setProperty('--dx', Math.cos(ang)*dist+'px');
      s.style.setProperty('--dy', Math.sin(ang)*dist+'px');
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 950);
    }
  }

  function choose(side){
    if (phase !== 'ask') return;
    phase = 'anim';
    const it = items[idx], right = it.t;
    zoneP.classList.remove('ready'); zoneQ.classList.remove('ready');
    $('#arrows').classList.add('hide');
    const zone = right === 'p' ? zoneP : zoneQ;
    const pile = right === 'p' ? $('#pileP') : $('#pileQ');
    const fly = () => {
      const a = card.getBoundingClientRect(), b = pile.getBoundingClientRect();
      const n = pile.children.length;
      const tx = b.left + (b.width/3)*(n%3) + b.width/6;
      const ty = b.top + 40 + Math.floor(n/3)*70;
      card.style.transition = 'transform .65s cubic-bezier(.2,.8,.2,1), opacity .65s';
      card.style.transform = `translate(${tx-(a.left+a.width/2)}px,${ty-(a.top+a.height/2)}px) scale(.2)`;
      card.style.opacity = '0';
      setTimeout(() => {
        const s = document.createElement('span'); s.appendChild(emojiImg(it.f, it.n)); pile.appendChild(s);
        zone.classList.add('hit');
        if (side === right) sparkle(zone);
        const dot = $$('#progress i')[idx]; dot.classList.remove('now'); dot.classList.add(right);
        card.style.display = 'none';
        if (idx === items.length - 1){ phase = 'end'; setTimeout(() => $('#endbox').classList.add('show'), 500); }
        else { phase = 'placed'; $('#next').classList.add('show'); }
      }, 680);
    };
    card.style.transition = 'none'; card.style.transform = '';
    if (side !== right){
      // escolha diferente: a carta vai até o lado escolhido e volta para o lugar certo, sem punição
      card.style.animation = (side === 'p' ? 'nudgeL' : 'nudgeR') + ' .5s ease-in-out';
      setTimeout(() => { card.style.animation = ''; fly(); }, 520);
    } else fly();
  }

  function next(){ if (phase === 'placed'){ idx++; dealCard(); } }

  /* ---------- tela cheia ---------- */
  const fsBtn = $('#fsBtn');
  const root = document.documentElement;
  const canFullscreen = !!(root.requestFullscreen || root.webkitRequestFullscreen);

  if (!canFullscreen) fsBtn.remove();

  function fullscreenOn(){ return !!(document.fullscreenElement || document.webkitFullscreenElement); }

  function toggleFullscreen(){
    if (!canFullscreen) return;
    try {
      const p = fullscreenOn()
        ? (document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen())
        : (root.requestFullscreen ? root.requestFullscreen({navigationUI:'hide'}) : root.webkitRequestFullscreen());
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch (_) { /* navegador recusou: segue sem tela cheia */ }
  }

  function syncFullscreen(){
    const on = fullscreenOn();
    root.classList.toggle('is-fullscreen', on);
    if (fsBtn) fsBtn.setAttribute('aria-label', on ? 'Sair da tela cheia' : 'Entrar em tela cheia');
  }
  document.addEventListener('fullscreenchange', syncFullscreen);
  document.addEventListener('webkitfullscreenchange', syncFullscreen);
  if (fsBtn) fsBtn.addEventListener('click', toggleFullscreen);

  /* ---------- eventos ---------- */
  $('#startBtn').addEventListener('click', startGame);
  $('#againBtn').addEventListener('click', startGame);
  $('#restartBtn').addEventListener('click', startGame);
  $('#homeBtn').addEventListener('click', goHome);
  $('#printBtn').addEventListener('click', () => window.print());
  zoneP.addEventListener('click', () => choose('p'));
  zoneQ.addEventListener('click', () => choose('q'));
  $('#btnP').addEventListener('click', () => choose('p'));
  $('#btnQ').addEventListener('click', () => choose('q'));
  $('#next').addEventListener('click', next);

  // toque vira a carta; depois de virada, dá para arrastar
  let drag = null, moved = false;
  card.addEventListener('pointerdown', e => {
    if (phase === 'hidden'){ flip(); return; }
    if (phase !== 'ask') return;
    drag = {x:e.clientX, y:e.clientY}; moved = false; card.setPointerCapture(e.pointerId);
    card.style.transition = 'none';
  });
  card.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (Math.abs(dx) > 5) moved = true;
    card.style.transform = `translate(${dx}px,${dy}px) rotate(${dx/25}deg)`;
  });
  card.addEventListener('pointerup', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x; drag = null;
    if (dx < -110) choose('p');
    else if (dx > 110) choose('q');
    else { card.style.transition = 'transform .3s'; card.style.transform = ''; }
  });

  document.addEventListener('keydown', e => {
    const k = e.key, sp = (k === ' ' || k === 'Enter');
    if (k === 'f' || k === 'F'){ e.preventDefault(); toggleFullscreen(); return; }
    if (k === 'Escape'){ goHome(); return; }
    if (phase === 'start'){ if (sp){ e.preventDefault(); startGame(); } return; }
    if (k === 'r' || k === 'R'){ startGame(); return; }
    if (sp){
      e.preventDefault();
      if (phase === 'hidden') flip();
      else if (phase === 'placed') next();
      else if (phase === 'end') startGame();
    }
    if (phase === 'ask' && k === 'ArrowLeft'){ e.preventDefault(); choose('p'); }
    if (phase === 'ask' && k === 'ArrowRight'){ e.preventDefault(); choose('q'); }
  });

  /* ---------- funcionar sem internet ---------- */
  if ('serviceWorker' in navigator){
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {
        /* sem HTTPS/localhost o navegador recusa: o jogo continua funcionando online */
      });
    });
  }
})();
