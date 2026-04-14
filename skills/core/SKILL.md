---
name: suno-core
description: >
  Módulo central do Super Gerots. Gerencia o output obrigatório que todo skill
  deve produzir: tomada de ação, responsável, relevância ponderada, prazo e
  status. Também faz o append no Google Sheets centralizado. Use este skill
  SEMPRE que qualquer outro skill do Super Gerots finalizar uma análise e
  precisar registrar ações. Também acione quando o usuário pedir para ver,
  filtrar ou atualizar ações já registradas, calcular bonificação acumulada,
  ou gerar dashboard de gestão cross-área.
---

# Suno Core — Output obrigatório e registro de ações

Antes de qualquer coisa, leia `/mnt/skills/user/MEMORIA.md` para ter
o contexto da empresa, glossário e regras.

## Quando este skill é acionado

1. Outro skill terminou uma análise e precisa registrar ações.
2. O usuário pede para ver, filtrar ou atualizar ações existentes.
3. O usuário quer calcular bonificação acumulada de alguém.
4. O usuário pede um dashboard ou visão consolidada.

## Fluxo de registro de ação

### Passo 1 — Coletar os campos obrigatórios

Se o skill anterior já gerou os campos, use-os. Se não, pergunte ao
usuário de forma estruturada:

```
Para registrar essa ação, preciso de:
1. O que precisa ser feito? (verbo no infinitivo, concreto)
2. Quem é o responsável?
3. Qual o prazo? (dd/mm/aaaa)
```

### Passo 2 — Calcular relevância automaticamente

Avalie as três dimensões com base no contexto da conversa:

- Impacto no negócio (1-5): analise se afeta receita, retenção,
  eficiência ou é incremental.
- Urgência (1-5): verifique se há deadline regulatório, fechamento
  mensal, demanda de stakeholder ou se é backlog.
- Esforço inverso (1-5): estime o tempo necessário pela complexidade
  da tarefa descrita.

Aplique a fórmula:
```
Relevância = (Impacto × 0.5) + (Urgência × 0.3) + (Esforço_inverso × 0.2)
```

Consulte o MEMORIA.md para verificar se a área tem pesos customizados.

Mostre o cálculo ao usuário antes de registrar:
```
Relevância: 4.1
  Impacto: 5 (afeta conversão de leads) × 0.5 = 2.5
  Urgência: 4 (fechamento mensal) × 0.3 = 1.2
  Esforço: 2 (estimativa 2 semanas) × 0.2 = 0.4
```

O usuário pode ajustar se discordar.

### Passo 3 — Registrar no Google Sheets

Use a integração com Google Drive para fazer append na planilha
centralizada. A planilha deve ter a seguinte estrutura:

**Aba: [Nome da área]** (ex: FP&A, Marketing, Consultoria)

| Coluna | Conteúdo |
|--------|----------|
| A | Data de registro (auto) |
| B | Tomada de ação |
| C | Responsável |
| D | Relevância (score) |
| E | Impacto (1-5) |
| F | Urgência (1-5) |
| G | Esforço inv. (1-5) |
| H | Prazo |
| I | Status |
| J | Área |
| K | Skill de origem |
| L | Contexto (resumo de 1 linha da conversa) |
| M | Concluído em (data) |
| N | Pontos bonificação (score se concluído no prazo, 0 se não) |

**Aba: Master** — consolidação automática de todas as abas via fórmula
do Sheets. Não escreva nesta aba; ela puxa das outras.

Se a planilha ainda não existir, crie com a estrutura acima e
compartilhe o link com o usuário.

### Passo 4 — Confirmar com o usuário

Mostre um resumo antes de gravar:

```
Ação: Consolidar DRE das 5 verticais para fechamento de março
Responsável: Ana Silva
Relevância: 4.1
Prazo: 05/04/2026
Status: Pendente
Área: FP&A
Skill: suno-fpa

Registrar no Sheets? (sim/não)
```

## Atualização de status

Quando o usuário pedir para atualizar o status de uma ação:

1. Busque a ação no Sheets pelo nome ou pelo responsável.
2. Atualize o status.
3. Se o novo status for "Concluído":
   - Registre a data em "Concluído em".
   - Compare com o Prazo.
   - Se dentro do prazo: copie o score de relevância para "Pontos
     bonificação".
   - Se fora do prazo: registre 0 em "Pontos bonificação".

## Dashboard de gestão

Quando o usuário pedir visão consolidada:

1. Leia a aba Master do Sheets.
2. Apresente:
   - Total de ações por status (pendente, em andamento, concluído, bloqueado)
   - Top 5 ações por relevância que estão pendentes
   - Ações vencidas (prazo < hoje e status != Concluído)
   - Ranking de bonificação por pessoa
3. Use gráficos quando apropriado (chart no chat ou no Sheets).

## Cálculo de bonificação

Quando o usuário pedir bonificação de alguém:

1. Filtre a aba Master por responsável.
2. Some a coluna "Pontos bonificação" (apenas ações concluídas no prazo).
3. Mostre o total e o detalhamento por ação.
