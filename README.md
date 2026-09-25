# Preciso ou quero?

Jogo de educação financeira para crianças, feito como **projeto extensionista
da faculdade FSG**. A criança vê um item do dia a dia e decide se ele é uma
**necessidade** (PRECISO) ou um **desejo** (QUERO).

Pensado para turmas de crianças surdas, com intérprete de Libras: sem texto
longo, sem som, figuras iguais em qualquer aparelho e nada que pisque na tela.
Funciona projetado em sala, no teclado do apresentador, ou no toque da criança
em celular e tablet.

Site estático em HTML, CSS e JavaScript puros. Sem build, sem backend e sem
internet depois de carregado.

## Como funciona

Cada rodada sorteia **6 cartas** (3 de cada lado) de um banco de 22 itens, então
toda rodada é diferente. A criança responde arrastando a carta para um lado ou
tocando nos botões. Se errar, a carta vai até o lado escolhido e depois segue
para o certo, sem punição.

| Preciso | Quero |
| --- | --- |
| Arroz e feijão, Pão, Maçã | Refrigerante, Pirulito, Sorvete, Pipoca |
| Remédio, Escova de dentes, Meias | Videogame, Celular novo, Brinquedo |
| Casaco no frio, Guarda-chuva | Tênis da moda, Boné |
| Mochila da escola, Uniforme da escola, Lápis | Bola nova, Bicicleta nova |

Para mudar os itens ou o tamanho da rodada, edite a lista `ALL` e a constante
`ROUND` em [`js/app.js`](js/app.js).

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

Copie os arquivos do repositório (menos `docs/`, `node_modules/` e os scripts
de servidor local) para a pasta pública do servidor. Todos os caminhos são
relativos, então funciona tanto na raiz do domínio quanto em subpasta.

Ao publicar uma versão nova, troque o nome do cache em `sw.js` (`pq-v2`,
`pq-v3`...). Sem isso, quem já abriu o jogo continua vendo a versão antiga.

## Atalhos de teclado

| Tecla | Ação |
| --- | --- |
| `Espaço` ou `Enter` | começar, próxima carta |
| `←` | responder PRECISO |
| `→` | responder QUERO |
| `F` | tela cheia |
| `R` | recomeçar a rodada |
| `Esc` | voltar para a tela inicial |

O botão **Imprimir Plaquinhas** na tela inicial imprime uma folha A4 com as duas
placas coloridas, para recortar e colar na parede.

## Estrutura do repositório

```text
index.html              tela inicial, jogo e plaquinhas
css/ js/                visual e mecânica (itens das cartas em js/app.js)
assets/ icons/          figuras Twemoji, fonte Nunito, ícones
manifest.webmanifest    instalação como app
sw.js                   cache offline
CREDITS.md              licenças
docs/
  prototipo.html        protótipo original, arquivo único
  especificacao.md      requisitos da versão de produção
serve.js                servidor estático local, sem dependências
start.bat               atalho de Windows para subir o jogo
```

## Licenças

Figuras [Twemoji](https://github.com/jdecked/twemoji) (CC-BY 4.0) e fonte
[Nunito](https://fonts.google.com/specimen/Nunito) (SIL OFL 1.1). Detalhes em
[`CREDITS.md`](CREDITS.md).
