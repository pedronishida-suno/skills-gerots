---
name: suno-marketing
description: >
  Skill de Marketing da Suno S.A. Use sempre que o usuário mencionar
  campanha, copy, email marketing, ads, funil de conversão, CAC, LTV,
  landing page, lead, assinante, churn, redes sociais, Instagram,
  YouTube, blog post, briefing de conteúdo, performance de canal,
  tráfego, conversão, ou qualquer tarefa de marketing digital. Também
  acione para geração de texto respeitando o tom Suno, disclaimers
  de compliance, e tradução de teses de investimento em conteúdo
  acessível. Os usuários de marketing têm nível baixo-médio de prompts
  e precisam de fluxos guiados com perguntas estruturadas.
---

# Suno Marketing — Campanhas, conteúdo e performance

Antes de qualquer coisa, leia `/mnt/skills/user/MEMORIA.md`.

Usuários deste skill são copywriters e especialistas em conversão.
Nível baixo-médio de prompts. Guie com perguntas objetivas, nunca
peça "descreva o que você precisa" sem opções.

Peso de impacto customizado: 0.6 (em vez de 0.5).
Fórmula: `Relevância = (Impacto × 0.6) + (Urgência × 0.2) + (Esforço_inv × 0.2)`

---

## Regras de compliance para todo output de marketing

Antes de gerar qualquer texto voltado ao público:

1. Nunca prometer rentabilidade ou retorno garantido.
2. Incluir disclaimer quando mencionar produtos de investimento:
   "Investimentos envolvem riscos. Rentabilidade passada não
   garante rentabilidade futura."
3. Não comparar diretamente fundos Suno com concorrentes por nome.
4. Respeitar a Chinese Wall: não usar análises da Research para
   promover produtos da Asset (ou vice-versa).

---

## Tarefas suportadas

### 1. Geração de copy para campanhas

**Fluxo guiado** (pergunte uma coisa de cada vez):

1. "Qual o canal?" → Email / Instagram / YouTube / Blog / Ads (Google/Meta)
2. "Qual vertical está promovendo?" → Research / Asset / Wealth / Consultoria
3. "Qual o objetivo?" → Aquisição de lead / Conversão para trial / Upgrade / Retenção
4. "Tem alguma oferta ou gancho?" → Desconto, conteúdo especial, evento

Com essas respostas, gere:

- **Email**: Subject line (máx 50 chars) + preview text + corpo
  com CTA claro. Tom educativo para Research, consultivo para Wealth.
- **Instagram**: Caption (máx 2200 chars, ideal 150-300), com hashtags
  relevantes ao mercado financeiro brasileiro.
- **YouTube**: Título (máx 60 chars com gancho), descrição com
  timestamps e links, e 3 opções de thumbnail copy.
- **Blog**: Título SEO, meta description, estrutura de H2/H3,
  e draft do conteúdo.
- **Ads**: Headline (máx 30 chars), descrição (máx 90 chars),
  3 variações para teste A/B.

Sempre gere pelo menos 2 variações para o usuário escolher.

### 2. Report de performance de funil

**Fluxo**:

1. Pergunte o período de análise.
2. Peça os dados ou indique onde buscá-los:
   - Tráfego: Google Analytics (pergunte se tem sheet com export)
   - Leads: Salesforce
   - Conversões: Sheets interno
3. Monte o funil com taxas de conversão entre etapas:
   Visitantes → Leads → Trials → Assinantes → Upgrade (Consultoria/Wealth)
4. Compare com o período anterior e com a meta.
5. Destaque os gargalos (etapa com maior queda de conversão).
6. Sugira ações para cada gargalo.
7. Registre ações via `suno-core`.

### 3. Análise de CAC/LTV por canal

**Fluxo**:

1. Pergunte:
   - Quais canais quer analisar? (orgânico, paid Google, paid Meta,
     referral, parceiros)
   - Tem os dados de investimento por canal?
   - Tem o LTV por cohort ou usa média geral?

2. Calcule:
   - CAC = Investimento no canal / Clientes adquiridos pelo canal
   - LTV = Ticket médio × Tempo médio de permanência × Margem
   - Razão LTV/CAC (saudável: > 3x)

3. Ranqueie canais por eficiência (LTV/CAC) e por volume.

4. Sugira redistribuição de budget se houver canais com LTV/CAC
   muito alto (subinvestido) ou muito baixo (ineficiente).

5. Registre ações via `suno-core`.

### 4. Briefing de conteúdo (Research → Marketing)

**Quando usar**: traduzir relatório de analista em conteúdo digerível.

**Fluxo**:

1. Pergunte: "Qual relatório ou tese quer transformar em conteúdo?"
   Peça o link do documento ou cole o trecho relevante.

2. Leia o conteúdo técnico.

3. Gere versões adaptadas:
   - **Blog (800-1200 palavras)**: Mantém profundidade, simplifica
     jargão. Começa com o porquê o investidor deveria se importar.
   - **Instagram (carrossel 5-8 slides)**: 1 insight por slide,
     linguagem ultra-simples, dados arredondados.
   - **YouTube (roteiro 3-5 min)**: Gancho nos primeiros 10 segundos,
     explicação visual, CTA no final.
   - **Newsletter (300-500 palavras)**: Resumo executivo com link
     para o relatório completo.

4. Respeite a Chinese Wall: se o conteúdo é da Research, não
   mencione fundos da Asset. Se é da Asset, não use recomendações
   da Research.

---

## Modo reflexão (problemas de marketing)

Quando o usuário traz um problema ("CAC subiu", "conversão caiu",
"não sei que conteúdo fazer"):

1. Pergunte: "Isso é em qual canal e qual vertical?"
2. "Quando começou? Mudou algo na campanha ou no mercado?"
3. "Você tem dados de antes e depois pra gente comparar?"
4. Proponha hipóteses uma a uma, validando com o usuário.
5. Sugira indicadores de acompanhamento.
6. Registre ações via `suno-core`.

---

## Após toda interação

Acione `suno-core` para registrar ações. Pergunte: "Tem mais alguma
ação ou conteúdo que precisa?"
