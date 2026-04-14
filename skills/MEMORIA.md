# Memória operacional — Suno S.A.

Leia este arquivo inteiro antes de executar qualquer skill do Super Gerots.
Ele contém o contexto mínimo que toda resposta precisa respeitar.

---

## 1. Quem é a Suno

Fintech brasileira fundada em 2017 por Tiago Reis. Ecossistema integrado de
serviços financeiros que combina educação, análise independente, gestão de
recursos e consultoria patrimonial. Filosofia central: Value Investing —
ativos abaixo do valor intrínseco, foco no longo prazo.

### Verticais do grupo

| Unidade           | Função                              | Público principal                       |
|-------------------|-------------------------------------|-----------------------------------------|
| Suno Research     | Casa de análise independente        | Investidores PF (pequeno e médio porte) |
| Suno Asset        | Gestora de recursos (FIIs, FIAGROs) | Público geral + qualificados            |
| Suno Wealth       | Gestão de fortunas                  | Patrimônio > R$ 3 mi                    |
| Suno Consultoria  | Consultoria de investimentos        | Investidores buscando orientação        |
| Suno Notícias     | Portal de informação                | Público interessado em economia         |

Plataformas de tráfego orgânico: Status Invest, Funds Explorer, Suno Notícias.

### Modelo de funil

Conteúdo gratuito → lead → assinante Research → cliente Consultoria → cliente Wealth.
Cada etapa é uma conversão mensurável. O marketing alimenta o topo; a qualidade
analítica retém no fundo.

---

## 2. Alertas críticos e sazonalidade

### Quebra de Safra — Migração CORE (Agosto/2025)
Informações anteriores a **Agosto/2025** pertencem ao sistema antigo (CORE).
Não compare dados brutos pré e pós essa data sem normalização. Qualquer
análise que cruze esse marco deve emitir alerta ao usuário.

### Leads Bear
Ignorar "Leads Bear" em análises de conversão orgânica. Eles poluem o
volume de leads e distorcem métricas de intenção de compra. Sempre filtrar
antes de calcular taxas de conversão.

### Research Intake — Queda de Conversão (Jan–Abr 2026)
Padrão identificado: queda de conversão visitante→lead na vertical Research
causada por dois drivers simultâneos:
1. **Macro**: retração econômica reduzindo apetite por assinaturas de análise
2. **Percepção de preço**: landing page não responde à objeção de custo

**Benchmarks de referência (Janeiro 2026 — baseline pré-queda):**
- Taxa visitante→lead: 9,0%
- Taxa lead→trial: 25,0%
- Taxa trial→assinante: 20,0%

Quando a taxa visitante→lead cair abaixo de **7%**, acionar diagnóstico
de funil via `suno-marketing` antes de qualquer ação de tráfego pago.
O gargalo costuma estar em conversão (L2), não em volume (L3) — verificar
pela Regra de Pareto antes de aumentar budget.

---

## 3. Árvore hierárquica de indicadores (Gerrot/OKR)

Metodologia de estratificação obrigatória para análise de performance.
Sempre investigar do L1 para o L3 — nunca pule níveis.

| Nível | Categoria | Exemplos (FPN) |
|-------|-----------|----------------|
| **L1** | Resultado (Final) | Receita Status, Receita Aquisição B3, Receita Mídias, Receita Renovação |
| **L2** | Eficiência (Alavanca) | ROAS (30 dias), Conversão Lead→Assinante, CTR (E-mail/Criativos), Taxa Conv. LP |
| **L3** | Esforço (Volume) | Leads Totais, Leads Mídias Pagas, CPL |

**Regra de Pareto (80/20):** nunca proponha ações para indicadores de L3
se houver desvio crítico em L2. A alavanca sempre está na eficiência
antes de estar no volume.

**Bonificação Gerrot:** apenas ações com score de relevância > 3.5 são
elegíveis para a esteira de bonificação extra.

---

## 4. Regras invioláveis

### Chinese Wall (segregação de atividades)
A equipe de Research NÃO pode sofrer influência da Asset, e vice-versa.
Nenhum skill pode gerar output que cruze informações entre essas duas
unidades sem autorização explícita de Compliance. Monitorado por Risco e
Compliance conforme normas da CVM.

### Compliance regulatório
- Nunca prometer rentabilidade em nenhum output.
- Disclaimers obrigatórios em qualquer material voltado a investidores.
- Respeitar regras de suitability na recomendação de produtos.
- Código de ética e políticas de negociação de valores mobiliários.

### Tom de voz (adaptável por contexto)
- **Varejo / Research**: Educativo, acessível, anti-"economês". Rigor técnico
  por trás, linguagem simples na frente.
- **Wealth**: Sóbrio, consultivo, profissional. Reflete o dever fiduciário.
- **Asset**: Técnico, institucional. Relatórios de gestão com métricas.
- **Marketing**: Engajante mas responsável. Nunca sensacionalista.
- **Interno / FP&A**: Direto, orientado a ação, com dados.

---

## 5. Glossário operacional

### Indicadores financeiros
- **DY (Dividend Yield)**: Proventos 12m / Preço da cota. Central para FIIs.
- **Valor Intrínseco**: Calculado via DCF (Fluxo de Caixa Descontado).
  FCF / (1+WACC)^t + Valor Terminal.
- **Alpha (α)**: Retorno acima do benchmark atribuído à competência do gestor.
- **AUM (Assets Under Management)**: Total sob gestão. Suno Asset: ~R$ 2bi em 2025.
- **CAC**: Custo de aquisição de cliente. Crítico para Marketing.
- **LTV**: Lifetime value do assinante/cliente.
- **Churn**: Taxa de cancelamento de assinaturas.

### Benchmarks de referência
- **CDI**: Referência para renda fixa.
- **IPCA**: Inflação. Referência para retorno real.
- **IFIX**: Índice de FIIs. Benchmark da Suno Asset.
- **Ibovespa**: Benchmark de renda variável.

### Produtos internos
- **Journey Book**: Documento estratégico da Consultoria. Mapa da jornada
  financeira do cliente.
- **IPS (Investment Policy Statement)**: Diretrizes de alocação do Wealth.
- **SNFF11, SNAG11, SNEL11, SNME11**: Tickers dos fundos da Suno Asset.

### Ferramentas internas
- Google Sheets (financeiro, FP&A)
- Salesforce (CRM — Consultoria, Wealth, Vendas)
- Slack (comunicação interna)
- monday.com (gestão de projetos e tarefas)
- Risbank (monitoramento de riscos bancários)

---

## 6. Perfil dos usuários internos

| Área                | Perfil técnico          | Nível de prompts | Necessidade de guia |
|---------------------|-------------------------|-------------------|---------------------|
| Dados e IA          | Devs, Eng. de Dados     | Especialista      | Baixa               |
| Marketing e Vendas  | Copywriters, Conversão  | Baixo-Médio       | Alta (templates)    |
| Financeiro e FP&A   | Analistas, Contadores   | Baixo-Médio       | Média (dados)       |
| Jurídico/Compliance | Advogados, Risco        | Baixo             | Alta (validação)    |
| Research            | Analistas CNPI          | Médio             | Média (síntese)     |

Regra geral: quanto menor o nível de prompts, mais o skill precisa guiar
com perguntas estruturadas em vez de esperar input livre.

---

## 7. Output obrigatório (todo skill)

Toda interação que gere uma ação deve produzir os seguintes campos,
escritos no Google Sheets centralizado via API:

| Campo               | Descrição                                      |
|---------------------|-------------------------------------------------|
| Tomada de ação      | O que fazer, verbo no infinitivo, concreto      |
| Responsável         | Nome da pessoa dona da ação                     |
| Relevância (score)  | Média ponderada (ver fórmula abaixo)            |
| Prazo               | Data limite (dd/mm/aaaa)                        |
| Status              | Pendente / Em andamento / Concluído / Bloqueado |
| Área                | Qual vertical ou departamento                   |
| Skill de origem     | Qual skill gerou esta ação                      |

### Fórmula de relevância ponderada

```
Relevância = (Impacto × 0.5) + (Urgência × 0.3) + (Esforço_inverso × 0.2)
```

Cada dimensão vai de 1 a 5:

**Impacto no negócio**
- 5 = Afeta receita diretamente (conversão, AUM, novos clientes)
- 4 = Afeta retenção ou satisfação do cliente
- 3 = Melhora eficiência operacional interna
- 2 = Melhoria de processo sem impacto direto em receita
- 1 = Cosmético ou incremental

**Urgência**
- 5 = Deadline regulatório/CVM ou risco operacional imediato
- 4 = Fechamento mensal ou ciclo de reporting
- 3 = Demanda de stakeholder com prazo definido
- 2 = Melhoria planejada sem pressão
- 1 = Backlog sem data

**Esforço inverso** (quick wins pontuam mais)
- 5 = Menos de 1 hora
- 4 = Até 1 dia
- 3 = Até 1 semana
- 2 = Até 1 mês
- 1 = Mais de 1 mês

Os pesos podem ser ajustados por área (soma sempre = 1.0):
- FP&A: Urgência 0.4, Esforço 0.1 (fechamentos mensais são críticos)
- Marketing: Impacto 0.6, Urgência 0.2 (campanhas que convertem)
- Compliance: Urgência 0.5, Impacto 0.3 (deadlines regulatórios)

### Bonificação por meta
Quando todos os campos estão preenchidos E a ação é concluída dentro do
prazo, o responsável acumula o score de relevância como pontos de
bonificação. O acumulado é calculado no Sheets centralizado.

---

## 8. Informações sensíveis

Este arquivo contém apenas estrutura e glossário. Dados financeiros reais
(receita, margem, AUM detalhado, informações de clientes) NÃO devem ser
armazenados aqui. Esses dados são acessados sob demanda via Google Sheets
ou Salesforce, apenas quando o usuário solicita explicitamente.

Regra: o skill nunca puxa dados sensíveis proativamente. Sempre espera
a iniciativa do usuário.
