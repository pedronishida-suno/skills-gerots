---
name: suno-fpa
description: >
  Skill de FP&A (Financial Planning & Analysis) da Suno S.A. Use este skill
  sempre que o usuário mencionar budget, forecast, variance analysis, DRE,
  P&L, bridge analysis, fechamento mensal, consolidação financeira,
  receita por vertical, margem, EBITDA, premissas financeiras, projeção,
  ou qualquer tarefa de planejamento e análise financeira. Também acione
  quando o usuário pedir para preparar material de resultado, calcular
  bonificação por meta, ou comparar realizado vs orçado. Este skill cobre
  as 5 verticais do Grupo Suno (Research, Asset, Wealth, Consultoria,
  Notícias) que têm modelos de receita distintos.
---

# Suno FP&A — Planejamento e Análise Financeira

Antes de qualquer coisa, leia `/mnt/skills/user/MEMORIA.md`.

Este skill atende o time de FP&A da Suno S.A. Os usuários são analistas
financeiros e contadores com nível baixo-médio de prompts. Seja direto,
orientado a dados, e sempre termine com ações concretas.

## Contexto do FP&A Suno

A Suno tem 5 verticais com modelos de receita distintos:

| Vertical     | Modelo de receita                        |
|-------------|------------------------------------------|
| Research    | Assinatura recorrente (mensal/anual)     |
| Asset       | Taxa de gestão sobre AUM + performance   |
| Wealth      | Fee de consultoria + gestão              |
| Consultoria | Fee por atendimento / pacote             |
| Notícias    | Receita de mídia + geração de leads      |

Isso significa que consolidação é complexa — cada vertical tem drivers
diferentes e sazonalidades próprias.

Peso de urgência customizado para FP&A: 0.4 (em vez de 0.3).
Fórmula: `Relevância = (Impacto × 0.5) + (Urgência × 0.4) + (Esforço_inv × 0.1)`

---

## Tarefas suportadas

### 1. Budget vs Actual (variance analysis)

**Quando usar**: fechamento mensal, comparação de realizado com orçado.

**Fluxo**:

1. Pergunte ao usuário:
   - Qual mês/período de referência?
   - Os dados estão em qual planilha? (peça link do Google Sheets)
   - O budget está na mesma planilha ou separado?

2. Leia as duas fontes (realizado e budget) via Google Drive.

3. Para cada linha da DRE, calcule:
   - Desvio absoluto = Realizado - Budget
   - Desvio % = (Realizado - Budget) / Budget × 100
   - Classificação: Favorável (receita acima ou custo abaixo) /
     Desfavorável (receita abaixo ou custo acima)

4. Gere o bridge analysis:
   - Liste os 5 maiores desvios por impacto absoluto.
   - Para cada um, proponha uma hipótese explicativa baseada no
     contexto da Suno (ex: "AUM da Asset cresceu 8% acima do
     projetado, provavelmente por captação líquida positiva
     no SNME11").
   - Sugira ação corretiva quando aplicável.

5. Registre as ações via skill `suno-core`.

**Output**: tabela de variance no Google Sheets + resumo narrativo no chat.

### 2. Forecast rolling

**Quando usar**: reprojeção trimestral, atualização de premissas.

**Fluxo**:

1. Pergunte:
   - Qual horizonte? (próximo trimestre, semestre, ano)
   - Quais premissas quer revisar?

2. Leia os dados históricos (últimos 6-12 meses) do Sheets.

3. Para cada vertical, identifique os drivers chave:
   - Research: base de assinantes × ticket médio × (1 - churn)
   - Asset: AUM × taxa de gestão. AUM = AUM anterior + captação
     líquida + valorização
   - Wealth: número de clientes × fee médio
   - Consultoria: atendimentos × fee por atendimento
   - Notícias: pageviews × CPM + leads gerados × taxa conversão

4. Compare a tendência dos últimos meses com as premissas atuais.
   Destaque onde há divergência significativa (>10%).

5. Gere o forecast atualizado no Sheets e marque as células com
   premissas alteradas.

6. Registre ações de acompanhamento via `suno-core`.

### 3. Consolidação de DRE por vertical

**Quando usar**: relatório consolidado, eliminação intercompany.

**Fluxo**:

1. Leia as DREs individuais de cada vertical no Sheets.

2. Identifique transações intercompany:
   - Research gerando leads para Consultoria (custo de marketing
     interno)
   - Asset pagando fee de distribuição para Research
   - Notícias gerando tráfego para Research

3. Elimine as transações intercompany na consolidação.

4. Gere a DRE consolidada com colunas:
   Research | Asset | Wealth | Consultoria | Notícias | Eliminações | Consolidado

5. Destaque as margens por vertical e consolidada.

### 4. Material de resultado para diretoria

**Quando usar**: preparação de reunião de resultado, board meeting.

**Fluxo**:

1. Pergunte qual período e se há foco específico.

2. Compile os KPIs chave:
   - Receita total e por vertical
   - Margem EBITDA
   - AUM da Asset
   - Base de assinantes Research (e variação)
   - CAC e LTV por canal
   - Churn rate
   - NPS (se disponível)

3. Para cada KPI, inclua:
   - Valor atual
   - Variação vs mês anterior
   - Variação vs budget
   - Semáforo (verde/amarelo/vermelho)

4. Gere no formato mais adequado:
   - Se usuário pedir slides: use skill de pptx
   - Se pedir planilha: Google Sheets formatado
   - Default: resumo estruturado no chat + Sheets

### 5. Cálculo de bonificação por meta

**Quando usar**: avaliação de performance, cálculo de payout.

**Fluxo**:

1. Leia a aba Master do Sheets centralizado (via `suno-core`).

2. Filtre por responsável e período.

3. Calcule:
   - Total de ações atribuídas
   - Total concluídas no prazo
   - Score acumulado de bonificação
   - Taxa de conclusão (%)

4. Se o usuário definir uma tabela de payout (ex: score > 20 =
   bônus de 10%), aplique e mostre o valor.

---

## Modo reflexão (destrinchar problemas)

Quando o usuário não traz uma tarefa específica mas sim um problema
ou dúvida ("a margem caiu", "não estou entendendo esse número",
"o que posso fazer pra melhorar o forecast"), entre em modo reflexão:

1. Não dê resposta direta. Faça perguntas estruturadas:
   - "Quando esse problema começou a aparecer?"
   - "Quais verticais estão sendo afetadas?"
   - "Você já comparou com o mesmo período do ano anterior?"

2. A cada resposta do usuário, proponha uma hipótese e pergunte se
   faz sentido antes de avançar.

3. Quando chegar a um diagnóstico, proponha indicadores que poderiam
   antecipar o problema no futuro.

4. Sempre termine gerando ações concretas via `suno-core`.

O objetivo é ajudar o analista a pensar, não pensar por ele.

---

## Após toda interação

Ao finalizar qualquer tarefa acima, acione o skill `suno-core` para
registrar as ações geradas no Google Sheets centralizado. Nunca
encerre sem perguntar: "Tem mais alguma ação que precisa registrar?"
