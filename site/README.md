# Preciso ou quero?

Jogo de educação financeira para projetar em sala. Site estático: HTML, CSS e
JavaScript puros. Não precisa de build, nem de backend, nem de internet depois
de carregado.

## Testar no computador

O jogo precisa ser servido por HTTP (abrir o `index.html` direto pelo Explorer
não ativa o modo offline). Na pasta que contém `site/`:

```bash
npx serve site
# ou
cd site && python -m http.server 8080
```

Depois abra o endereço que o comando mostrar (`http://localhost:3000` ou
`http://localhost:8080`).

No Windows, o arquivo `start.bat` na pasta acima faz isso sozinho: confere o
Node, instala as dependências na primeira vez, sobe o servidor e abre o
navegador. Se a porta 8080 estiver ocupada ele pula para a próxima livre e
mostra o endereço na tela. Para escolher a porta: `start.bat 9000`.

## Colocar no servidor

Copie **o conteúdo** da pasta `site/` para a pasta pública do servidor
(Apache, Nginx, IIS). Funciona na raiz do domínio ou em subpasta, porque todos
os caminhos são relativos:

```
https://servidor/              -> copie para a raiz
https://servidor/educacao/     -> copie para a pasta "educacao"
```

Nenhuma configuração de PHP, Node ou banco de dados é necessária.

## Atalhos de teclado (apresentador)

| Tecla | Ação |
|---|---|
| `Espaço` ou `Enter` | começar, virar a carta, próxima carta |
| `←` | responder PRECISO |
| `→` | responder QUERO |
| `F` | entrar e sair da tela cheia |
| `R` | recomeçar a rodada |
| `Esc` | voltar para a tela inicial |

Na tela sensível ao toque a criança pode tocar na carta para virar, arrastar a
carta para um dos lados ou tocar direto na coluna PRECISO / QUERO.

## Plaquinhas para imprimir

Botão **Plaquinhas** na tela inicial. Sai uma folha A4 em paisagem com as duas
placas coloridas, para recortar e colar na parede. Na caixa de impressão do
navegador, mantenha **"Gráficos de plano de fundo"** ligado e as margens em
**Nenhuma**.

## Modo offline (service worker)

O `sw.js` guarda todos os arquivos no cache do navegador na primeira visita.
Depois disso o jogo abre mesmo sem rede.

**O service worker só é registrado em HTTPS ou em `localhost`.** Em um servidor
interno sem certificado (`http://10.0.0.5/...`) o jogo funciona normalmente,
mas sem o modo offline.

### Forçar atualização depois de mexer nos arquivos

O navegador continua servindo a versão antiga do cache até a versão mudar.
Ao publicar qualquer alteração, edite a primeira linha útil do `sw.js`:

```js
const CACHE = 'pq-v1';   // troque para 'pq-v2', 'pq-v3', ...
```

Na próxima visita o service worker baixa tudo de novo e apaga o cache anterior.
Para limpar na hora durante um teste: DevTools → Application → Service Workers →
*Unregister*, ou `Ctrl+Shift+R`.

## Tipos MIME

Alguns servidores não conhecem `.webmanifest` e `.woff2` e entregam os arquivos
com o tipo errado (o manifesto é ignorado e a fonte não carrega). Se isso
acontecer:

### Apache — `.htaccess` dentro da pasta do site

```apache
AddType application/manifest+json .webmanifest
AddType font/woff2 .woff2
AddType image/svg+xml .svg

# opcional: cache longo para os arquivos versionados pelo service worker
<FilesMatch "\.(woff2|svg|png)$">
  Header set Cache-Control "public, max-age=31536000"
</FilesMatch>
<FilesMatch "^(sw\.js|index\.html)$">
  Header set Cache-Control "no-cache"
</FilesMatch>
```

### Nginx — dentro do `server { }` ou no `mime.types`

```nginx
types {
    application/manifest+json  webmanifest;
    font/woff2                 woff2;
    image/svg+xml              svg;
}

location = /sw.js      { add_header Cache-Control "no-cache"; }
location = /index.html { add_header Cache-Control "no-cache"; }
```

### IIS — `web.config`

```xml
<configuration>
  <system.webServer>
    <staticContent>
      <mimeMap fileExtension=".webmanifest" mimeType="application/manifest+json" />
      <mimeMap fileExtension=".woff2" mimeType="font/woff2" />
    </staticContent>
  </system.webServer>
</configuration>
```

## Estrutura

```
index.html              tela inicial, jogo e plaquinhas de impressão
css/style.css           todo o visual, temas claro/escuro, impressão
js/app.js               mecânica do jogo, atalhos, tela cheia, service worker
assets/emoji/*.svg      figuras Twemoji (iguais em qualquer aparelho)
assets/fonts/*.woff2    Nunito 600 / 800 / 900, subset latin
icons/                  favicon e ícones do atalho na tela inicial
manifest.webmanifest    nome, cores e modo de exibição do atalho
sw.js                   cache offline (versão do cache: pq-v1)
CREDITS.md              licenças das figuras e da fonte
```

Licenças: figuras Twemoji (CC-BY 4.0) e fonte Nunito (SIL OFL 1.1).
Detalhes em `CREDITS.md`.
