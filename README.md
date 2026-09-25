# Preciso ou quero?

Jogo de educação financeira para projetar em sala de aula. A criança vê um item
e decide se ele é uma **necessidade** (PRECISO) ou um **desejo** (QUERO).

Feito para turmas de crianças surdas, com intérprete de Libras: sem texto longo,
sem som, figuras iguais em qualquer aparelho e nada que pisque na tela. Funciona
no teclado do apresentador ou no toque da criança.

Site estático em HTML, CSS e JavaScript puros. Sem build, sem backend e sem
internet depois de carregado.

## Rodar no computador

No Windows, clique duas vezes em `start.bat`. Ele confere o Node, instala o que
falta na primeira vez, sobe o servidor e abre o navegador. Para escolher a
porta: `start.bat 9000`.

Em qualquer sistema:

```bash
npm start              # http://localhost:8080
```

Abrir o `index.html` direto pelo gerenciador de arquivos também funciona, mas
sem o modo offline: o service worker exige HTTP.

## Publicar

Copie o **conteúdo** da pasta `site/` para a pasta pública do servidor. Todos os
caminhos são relativos, então funciona tanto na raiz do domínio quanto em
subpasta. Detalhes de tipos MIME, cache e service worker estão em
[`site/README.md`](site/README.md).

## Atalhos de teclado

| Tecla | Ação |
|---|---|
| `Espaço` ou `Enter` | começar, virar a carta, próxima carta |
| `←` | responder PRECISO |
| `→` | responder QUERO |
| `F` | tela cheia |
| `R` | recomeçar a rodada |
| `Esc` | voltar para a tela inicial |

O botão **Plaquinhas** na tela inicial imprime uma folha A4 com as duas placas
coloridas, para recortar e colar na parede.

## Estrutura do repositório

```
site/                   o jogo, pronto para publicar
  index.html            tela inicial, jogo e plaquinhas
  css/ js/              visual e mecânica
  assets/ icons/        figuras Twemoji, fonte Nunito, ícones
  sw.js                 cache offline
  README.md             guia de publicação
  CREDITS.md            licenças
docs/
  prototipo.html        protótipo original, arquivo único
  especificacao.md      requisitos que geraram a pasta site/
serve.js                servidor estático local, sem dependências
start.bat               atalho de Windows para subir o jogo
```

## Licenças

Figuras [Twemoji](https://github.com/twitter/twemoji) (CC-BY 4.0) e fonte
[Nunito](https://fonts.google.com/specimen/Nunito) (SIL OFL 1.1). Detalhes em
[`site/CREDITS.md`](site/CREDITS.md).
