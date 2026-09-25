# Tarefa: transformar o protótipo "Preciso ou quero?" em site estático pronto para produção

## Contexto

Jogo educativo de educação financeira para crianças surdas, algumas com deficiência intelectual. Será projetado em sala, com intérprete de Libras, e controlado pelo apresentador (teclado) ou por crianças (toque na tela). O protótipo funcional está em `./prototipo.html`. Ele é a fonte da verdade para comportamento, fluxo, textos, cores e layout. Não mude a mecânica, apenas profissionalize a entrega.

## Objetivo

Gerar a pasta `site/` com arquivos estáticos que funcionem em qualquer servidor web (Apache, Nginx, IIS) sem build no servidor, sem backend e sem dependência de internet em tempo de execução.

## Estrutura esperada

```
site/
  index.html
  css/style.css
  js/app.js
  assets/emoji/       (SVGs locais de cada emoji usado)
  assets/fonts/       (Nunito 600, 800, 900 em woff2)
  icons/              (favicon.svg, icon-192.png, icon-512.png)
  manifest.webmanifest
  sw.js
  CREDITS.md
  README.md
```

## Requisitos

### 1. Separação de arquivos

Extraia CSS e JS do protótipo para `css/style.css` e `js/app.js`. JS vanilla, sem framework, sem bundler. Use `defer` no script. Todos os caminhos devem ser relativos (`./css/style.css`), para o site funcionar tanto na raiz do domínio quanto em subpasta (ex.: `https://servidor/educacao/`).

### 2. Emojis consistentes em qualquer dispositivo

O protótipo usa emojis do sistema, que mudam de aparência entre Windows, Android e iOS. Para crianças com deficiência intelectual a figura precisa ser sempre a mesma.

- Liste todos os emojis presentes no protótipo (itens das cartas, ícones das zonas, botões, faíscas, aplausos, carta virada, mão de toque, impressora, casa, recomeçar).

- Baixe o SVG de cada um do repositório `jdecked/twemoji` (pasta `assets/svg/`, nome do arquivo é o codepoint em hexadecimal minúsculo; atenção a sequências com `fe0f`, teste com e sem esse sufixo).

- Salve em `assets/emoji/` com nomes legíveis (`comida.svg`, `agua.svg`, `coracao.svg`...).

- Substitua os emojis de texto por `<img>` com `alt` descritivo em português, mantendo os mesmos tamanhos visuais do protótipo. Nas faíscas geradas por JS, use as imagens também.

- Os caracteres `▶` e `✓` podem continuar como texto ou virar SVG inline; escolha o que render melhor.

- Registre a licença CC-BY 4.0 do Twemoji em `CREDITS.md` e em um rodapé discreto na tela inicial (fonte pequena, cor `--muted`), que não aparece durante o jogo.

### 3. Fonte local

Substitua o link do Google Fonts por `@font-face` apontando para `assets/fonts/` (Nunito pesos 600, 800 e 900, woff2, subset latin). Pode obter via pacote `@fontsource/nunito` e copiar apenas os arquivos necessários. Mantenha a pilha de fallback do protótipo. Registre a licença OFL no `CREDITS.md`.

### 4. Funcionar sem internet (PWA)

- `manifest.webmanifest` com nome "Preciso ou quero?", `display: fullscreen`, `orientation: landscape`, cores do tema do protótipo e os ícones.

- `sw.js` com estratégia cache-first que pré-carrega todos os arquivos do site na instalação. Versione o nome do cache (`pq-v1`) e limpe caches antigos no `activate`.

- Registre o service worker em `app.js` apenas se `'serviceWorker' in navigator`, com caminho relativo.

- Ícones: gere `icon-192.png` e `icon-512.png` a partir do SVG do coração ou da estrela (use `sharp` ou similar). `favicon.svg` a partir do mesmo desenho.

### 5. Modo tela cheia

Adicione na barra superior do jogo um botão para entrar e sair de tela cheia (Fullscreen API) e o atalho de teclado `F`. Some o botão se a API não existir. Atualize a legenda de atalhos da tela inicial.

### 6. Preservar integralmente do protótipo

- Fluxo: início, carta virada, virar, escolher, animação até a coluna correta, próxima, tela final com aplausos e recomeçar.

- Embaralhamento sem 3 cartas seguidas do mesmo lado.

- Escolha diferente da correta sem punição visual (a carta vai até o lado escolhido e segue para o correto).

- Bolinhas de progresso coloridas pelo lado.

- Arrastar a carta com toque, `pointer events`.

- Atalhos: Espaço/Enter, setas, R, Esc.

- Tema claro e escuro via `prefers-color-scheme` e `data-theme`.

- `prefers-reduced-motion`, sem nenhum efeito piscante.

- Impressão das plaquinhas (A4 paisagem, cores exatas), agora usando os SVGs locais.

- Layout responsivo abaixo de 760px.

- Variáveis `env(safe-area-inset-*)` e meta viewport com `viewport-fit=cover`.

### 7. README.md

Instruções curtas em português: como testar localmente (`npx serve site` ou `python -m http.server`), como subir para o servidor (copiar o conteúdo de `site/`), observação de que o service worker só funciona em HTTPS ou localhost, e como forçar atualização após mudanças (incrementar a versão do cache em `sw.js`). Inclua exemplo de tipos MIME para `.webmanifest` e `.woff2` caso o servidor não os reconheça (Apache `.htaccess` e Nginx).

## Restrições

- Nenhuma requisição externa em tempo de execução. Após o build, `grep -rE "https?://" site/` só pode retornar URLs dentro de `CREDITS.md`, `README.md` e comentários.

- Sem frameworks, sem CDN, sem analytics, sem cookies, sem localStorage.

- Não altere textos, cores, ordem dos itens ou mecânica sem necessidade técnica; se precisar, justifique no resumo final.

- Não crie branch, commit ou push.

## Critérios de aceite (verifique antes de encerrar)

1. Sirva `site/` localmente e rode um teste com Playwright (headless Chromium) que: abre a página, confirma zero erros de console, joga as 12 cartas via teclado, confirma que a tela final aparece e que as duas colunas somam 12 itens.

2. Confirme que todas as `<img>` carregam (nenhuma com `naturalWidth === 0`).

3. Tire screenshots em 1366x768 (início, carta virada, carta revelada, tela final) e em 390x844, e compare visualmente com o protótipo aberto nas mesmas resoluções. Aponte diferenças.

4. Gere o PDF da impressão e confirme uma página com as duas plaquinhas coloridas.

5. Com o servidor local, carregue a página, desligue a rede do contexto do Playwright (`context.set\_offline(True)`), recarregue e confirme que o jogo abre.

6. Rode o `grep` de URLs externas da seção Restrições.

## Entrega

Ao final, apresente: árvore de arquivos de `site/`, tamanho total da pasta, resultado de cada critério de aceite e qualquer decisão que divergiu do protótipo.

