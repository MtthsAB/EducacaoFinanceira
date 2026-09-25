/* Preciso ou quero? - service worker
   Estratégia cache-first: tudo entra no cache na instalação e o jogo passa a
   funcionar sem internet. Ao publicar uma versão nova, troque CACHE para
   pq-v2, pq-v3... para o navegador baixar os arquivos atualizados. */

const CACHE = 'pq-v2';

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/style.css',
  './js/app.js',
  './icons/favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './assets/fonts/nunito-600.woff2',
  './assets/fonts/nunito-800.woff2',
  './assets/fonts/nunito-900.woff2',
  './assets/emoji/aplausos.svg',
  './assets/emoji/bicicleta.svg',
  './assets/emoji/bola.svg',
  './assets/emoji/bone.svg',
  './assets/emoji/brinquedo.svg',
  './assets/emoji/casa.svg',
  './assets/emoji/casaco.svg',
  './assets/emoji/celular.svg',
  './assets/emoji/comida.svg',
  './assets/emoji/coracao.svg',
  './assets/emoji/doce.svg',
  './assets/emoji/escova-dentes.svg',
  './assets/emoji/estrela.svg',
  './assets/emoji/faiscas.svg',
  './assets/emoji/guarda-chuva.svg',
  './assets/emoji/impressora.svg',
  './assets/emoji/lapis.svg',
  './assets/emoji/meias.svg',
  './assets/emoji/maca.svg',
  './assets/emoji/mochila.svg',
  './assets/emoji/pao.svg',
  './assets/emoji/pensando.svg',
  './assets/emoji/pipoca.svg',
  './assets/emoji/recomecar.svg',
  './assets/emoji/refrigerante.svg',
  './assets/emoji/remedio.svg',
  './assets/emoji/sorvete.svg',
  './assets/emoji/tenis.svg',
  './assets/emoji/uniforme.svg',
  './assets/emoji/videogame.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req, {ignoreSearch: true}).then(hit => {
      if (hit) return hit;
      return fetch(req)
        .then(res => {
          // guarda o que vier do mesmo site, para a próxima vez já sair do cache
          if (res && res.ok && res.type === 'basic'){
            const copy = res.clone();
            caches.open(CACHE).then(cache => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => {
          // offline e fora do cache: navegação cai na página inicial
          if (req.mode === 'navigate') return caches.match('./index.html');
          return Response.error();
        });
    })
  );
});
