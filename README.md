# Itaú Black — conceito de interface

Projeto **conceitual e independente** de portfólio frontend, inspirado na experiência digital do Itaú Black.

**Site:** https://montibellerr.github.io/itau-black/

> **Aviso:** este projeto não tem vínculo com o Itaú Unibanco S.A. A identidade visual é usada apenas como referência para demonstrar habilidades de frontend. Não há login, captura de dados, pagamentos ou qualquer funcionalidade financeira real. Todo o conteúdo é fictício.

## A Home

Uma jornada visual em atos, com transições cinematográficas guiadas pelo scroll:

1. **Hero (universo Black)** — baralho de cartões 3D reais com parallax, reflexos e entrada animada.
2. **Transição Black → Itaú** — "Itaú. Feito de futuro." O ambiente escuro clareia, a luz azul se dissipa e o laranja surge.
3. **Ecossistema Itaú** — cartões, conta, experiências e atendimento em blocos editoriais com ilustrações próprias.
4. **Pilares** — inovação, segurança e conveniência em composição editorial.
5. **Transição Itaú → Black** — "O universo Black começa onde o comum termina."
6. **Benefícios Black** — coluna escultural de cartões que se abre em leque conforme o scroll.
7. **Encerramento** — CTA final com um horizonte de luz que funde o azul e o laranja.

O header acompanha a jornada, trocando suavemente entre os universos Black e Itaú.

## Como rodar

Requer Node.js 20.19+ ou 22.12+.

```bash
npm install
npm run dev        # servidor de desenvolvimento (http://localhost:5173)
npm run build      # typecheck + build de produção em dist/
npm run preview    # serve o build de produção
npm run lint       # ESLint
```

Para testar os níveis de movimento sem mudar o dispositivo, use o parâmetro `?motion=`:

| URL | Comportamento |
| --- | --- |
| `?motion=full` | 3D completo: parallax, inclinação e reflexos reagindo ao cursor |
| `?motion=lite` | Animações guiadas pelo scroll, sem interação com o cursor (padrão em toque) |
| `?motion=static` | Composições estáticas (padrão com `prefers-reduced-motion`) |

## Publicação

O deploy no **GitHub Pages** é automático a cada push na branch `main` (`.github/workflows/deploy.yml`): instala as dependências, roda lint, typecheck e build, e publica `dist/`.

O site é servido em `/<repositório>/`; o workflow define `BASE_PATH` e o Vite usa esse caminho como `base`. Localmente o site continua na raiz.

## Stack

- **React 19 + TypeScript + Vite 8**
- **CSS Modules** com design tokens em variáveis CSS
- **Manrope Variable** auto-hospedada via Fontsource
- Nenhuma dependência de animação: física de molas própria

## Arquitetura

```
src/
├── components/
│   ├── brand/                 marca estilizada (SVG)
│   ├── card/PaymentCard/      cartão 3D reutilizável (espessura, chip, guilhochê, reflexos)
│   ├── hero/                  hero: conteúdo, iluminação de cena e baralho 3D
│   ├── home/                  transições, ecossistema, pilares, benefícios (coluna 3D) e CTA final
│   ├── layout/                header (jornada de temas) e rodapé
│   └── ui/                    botões, ícones e tipografia
├── content/                   textos (separados dos componentes)
├── data/                      variantes de cartões
├── hooks/                     media queries, nível de movimento, ponteiro, revelação
├── lib/                       molas, ticker, cenas de scroll, utilitários
├── providers/                 nível de movimento global
└── styles/                    tokens (universos Black e Itaú) e base
```

## Decisões técnicas

**Cartões são elementos reais em 3D.** Cada cartão é um `div` com `transform-style: preserve-3d`: uma face e camadas em Z negativo que formam a espessura física da borda. Textura, guilhochê, chip e texto são vetoriais/CSS e escalam com unidades de container (`cqi`).

**Dois universos, um conjunto de tokens.** Os componentes consomem tokens semânticos (`--accent-*`, `--text-*`, `--canvas`…). Uma seção troca de universo declarando `data-theme="light"`; o header faz o mesmo ao longo do scroll.

**Física de molas em vez de keyframes.** Inclinação, parallax, abertura do leque e progresso das transições são molas integradas em passos fixos — movimento idêntico em 60 Hz ou 144 Hz e interrupções suaves.

**Zero re-render por frame.** Os motores escrevem `transform`, `opacity` e variáveis CSS diretamente no DOM; as camadas de luz são movidas só por `transform`/`opacity`, no compositor.

**Loop que dorme.** Um único `requestAnimationFrame` compartilhado só roda enquanto há movimento. Posições de scroll ficam em cache e só são remedidas quando o layout muda.

**Três níveis de movimento.** `full` (mouse), `lite` (toque, hardware modesto) e `static` (`prefers-reduced-motion`), controlando interação, camadas e animações.

## Acessibilidade

- Estrutura semântica (`header`, `nav`, `main`, seções com `aria-labelledby`)
- Link "pular para o conteúdo", foco visível por tema, alvos de toque de 44 px
- Composições 3D expostas como imagens com descrição (`role="img"`)
- Menu móvel com `aria-expanded`, `inert` quando fechado e fechamento por Esc
- Contraste AA nos dois universos
- `prefers-reduced-motion` respeitado no CSS e nos motores de movimento
