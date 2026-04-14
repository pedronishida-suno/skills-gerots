# Research Intake KPI — Diagnóstico e Plano de Ação

**Período:** Janeiro – Abril 2026
**Vertical:** Research (assinatura recorrente)
**Status:** KPI de intake em queda — ação imediata necessária

---

## Contexto

Queda identificada em conversão de visitantes para leads na vertical Research.
Dois drivers principais:

1. **Macro econômico** — mercado retraído, investidores menos propensos a assinar serviços de Research
2. **Percepção de custo** — produto percebido como caro em relação ao valor entregue na landing page

---

## Dados do Funil (Jan–Abr 2026)

| Métrica | Jan | Fev | Mar | Abr (até dia 14) |
|---|---|---|---|---|
| Visitantes únicos | 42.000 | 38.500 | 31.200 | 12.800 |
| Leads gerados | 3.780 | 2.890 | 1.872 | 614 |
| Taxa visitante→lead | 9,0% | 7,5% | 6,0% | 4,8% |
| Trials iniciados | 945 | 635 | 374 | 98 |
| Taxa lead→trial | 25,0% | 22,0% | 20,0% | 16,0% |
| Novos assinantes | 189 | 108 | 60 | 13 |
| Taxa trial→assinante | 20,0% | 17,0% | 16,0% | 13,3% |

---

## Queda Acumulada (Jan → Abr projetado)

```
             Jan        Abr (mês cheio projetado)   Variação
Visitantes   42.000  →  27.400                       -35%
Leads         3.780  →   1.315                       -65%
Trials          945  →     211                       -78%
Assinantes      189  →      28                       -85%
```

**Gargalo principal:** visitante → lead (-65%)
O tráfego caiu 35%, mas a conversão caiu muito mais — confirma que o problema não é só macro, é também percepção de valor/preço na landing page.

---

## Hipóteses Priorizadas

| # | Hipótese | Evidência |
|---|---|---|
| 1 | Landing page não responde à objeção de preço | Conv. visitante→lead caindo mais que tráfego |
| 2 | Oferta de trial não está clara ou atraente | Lead→trial caindo de 25% → 16% |
| 3 | Tráfego pago reduzido ou CPL subindo | Visitantes -35% |

---

## Plano de Ação (suno-core)

### A1 — A/B Test na Landing Page Research
**Ação:** Criar variante B com ancoragem de preço ("por menos de R$ X por dia") e prova social (depoimentos + ROI médio dos assinantes)
**Responsável:** Bruno Lima
**Prazo:** 25/04/2026
**Status:** Pendente

```
Relevância: 4.6
  Impacto: 5 × 0.6 = 3.0  (gargalo principal — conv. visitante→lead -65%)
  Urgência: 4 × 0.2 = 0.8  (queda ativa agora)
  Esforço inv: 4 × 0.2 = 0.8  (1 semana de dev + copy)
```

---

### A2 — Revisar Campanhas Pagas de Tráfego
**Ação:** Auditar CPL por canal (Google/Meta) e redistribuir budget para canais com LTV/CAC > 3x
**Responsável:** Carla Mendes
**Prazo:** 18/04/2026
**Status:** Pendente

```
Relevância: 4.2
  Impacto: 4 × 0.6 = 2.4  (tráfego -35%, impacto direto no topo do funil)
  Urgência: 5 × 0.2 = 1.0  (mais urgente — prazo mais curto)
  Esforço inv: 4 × 0.2 = 0.8  (análise rápida, 2-3 dias)
```

---

### A3 — Oferta de Trial Estendido
**Ação:** Criar campanha de trial 30 dias (vs 7 dias atual) com desconto de onboarding para novos assinantes Research
**Responsável:** Ana Souza
**Prazo:** 22/04/2026
**Status:** Pendente

```
Relevância: 3.8
  Impacto: 4 × 0.6 = 2.4  (reduz barreira macro de preço)
  Urgência: 3 × 0.2 = 0.6  (importante mas não imediato)
  Esforço inv: 4 × 0.2 = 0.8  (copy + config de produto)
```

---

## Dashboard — Aba Master

| Ação | Responsável | Relevância | Prazo | Status |
|---|---|---|---|---|
| A/B test landing page | Bruno Lima | 4.6 | 25/04/2026 | Pendente |
| Auditoria paid media | Carla Mendes | 4.2 | 18/04/2026 | Pendente |
| Trial estendido | Ana Souza | 3.8 | 22/04/2026 | Pendente |

**Ordem de execução recomendada: A2 → A1 → A3**
A2 tem prazo mais curto e destrava tráfego para A1 ter mais volume no teste A/B.

---

## Skills utilizados

- `suno-marketing` — diagnóstico de funil, modo reflexão, geração de ações
- `suno-core` — cálculo de relevância, registro de ações, dashboard master

---

*Gerado em 14/04/2026*
