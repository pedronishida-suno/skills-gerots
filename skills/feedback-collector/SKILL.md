---
name: suno-feedback
description: >
  Coletor de feedback do Super Gerots. Use este skill sempre que o usuário
  reportar um problema, bug, sugestão de melhoria, ou insatisfação com
  qualquer skill do sistema. Também acione quando detectar feedback
  implícito: o usuário corrigiu o output manualmente, reformulou a mesma
  pergunta mais de uma vez, abandonou uma tarefa, disse "isso tá errado",
  "não era isso", "seria melhor se", "poderia ter", "faltou", "não
  funciona", ou expressou frustração com o resultado. Este skill também é
  acionado por "reportar bug", "sugerir melhoria", "feedback", ou "o
  skill não funcionou". Atenção: se o usuário reformular a mesma pergunta
  2+ vezes na mesma conversa, isso É um sinal de feedback — acione
  proativamente.
---

# Suno Feedback Collector — Coleta, classifica e gera patches

Antes de qualquer coisa, leia `/mnt/skills/user/MEMORIA.md`.

Este skill fecha o loop de melhoria contínua do Super Gerots. Ele
coleta feedback dos 50+ colaboradores da Suno e o estrutura para
que patches possam ser gerados de forma rápida e rastreável.

---

## Detecção de feedback

### Triggers explícitos
O usuário disse diretamente que algo está errado ou pode melhorar.
Exemplos: "isso tá errado", "não era isso", "bug", "sugestão",
"poderia ser melhor se...", "faltou X".

### Triggers implícitos
- Usuário corrigiu o output manualmente (editou o texto gerado).
- Mesma pergunta reformulada 2+ vezes (o skill não entendeu).
- Tarefa abandonada no meio.
- Usuário pediu para "tentar de novo" ou "refaz".

### Trigger proativo (usar com moderação)
Após tarefas complexas (3+ trocas de mensagem), pergunte:
"Esse resultado ficou bom? Se algo puder melhorar, me diz."
Não pergunte em toda conversa — apenas quando a tarefa foi longa
ou o output foi complexo.

---

## Fluxo de coleta

### Passo 1 — Reconhecer e confirmar

Quando detectar feedback, confirme com o usuário:

```
Parece que [descrição do problema]. Quer que eu registre isso
como sugestão de melhoria para o skill de [nome do skill]?
```

Se o usuário disser sim, prossiga. Se não, respeite e siga.

### Passo 2 — Classificar

Pergunte (ou infira pelo contexto):

| Tipo         | Descrição                                    | Label GitHub    |
|--------------|----------------------------------------------|-----------------|
| Bug          | Skill deu output errado ou quebrou           | `bug`           |
| Melhoria     | Funciona, mas poderia ser melhor             | `enhancement`   |
| Novo skill   | Área ou tarefa não coberta                   | `new-skill`     |
| Tom/formato  | Output correto mas tom ou formato inadequado | `style`         |
| Dados        | Glossário, premissa ou dado desatualizado    | `data-update`   |

### Passo 3 — Estruturar o registro

Colete e organize:

```yaml
data: 2026-04-14
reporter: Nome do Colaborador
area: FP&A
skill_afetado: suno-fpa
tipo: enhancement
severidade: medium  # low / medium / high / critical
descricao: >
  O skill de variance analysis não inclui template de bridge
  analysis no output. O usuário teve que montar manualmente.
contexto_conversa: >
  Usuário pediu variance analysis do mês de março. O output
  trouxe a tabela de desvios mas sem o bridge explicativo.
sugestao_patch: >
  Adicionar no passo 4 do fluxo de variance analysis a geração
  automática do bridge com os 5 maiores desvios.
```

### Passo 4 — Gravar em FEEDBACK.md

Faça append no arquivo `/mnt/skills/user/FEEDBACK.md`:

```markdown
---
## [2026-04-14] enhancement | suno-fpa | medium
**Reporter**: Nome do Colaborador
**Descrição**: O skill de variance analysis não inclui bridge analysis.
**Sugestão**: Adicionar geração automática de bridge no passo 4.
**Status**: pending
---
```

### Passo 5 — Gerar patch automaticamente

Se a melhoria é clara o suficiente para ser implementada:

1. Leia o SKILL.md afetado.
2. Identifique a seção que precisa mudar.
3. Gere a versão corrigida.
4. Salve como `/mnt/skills/user/patches/[skill]-[data]-[tipo].patch.md`
   contendo:
   - Arquivo afetado
   - Seção antes (trecho relevante)
   - Seção depois (com a correção)
   - Justificativa

Formato do patch:

```markdown
# Patch: suno-fpa bridge analysis
- Arquivo: skills/fpa/SKILL.md
- Seção: "### 1. Budget vs Actual (variance analysis)"
- Tipo: enhancement
- Autor do feedback: Nome do Colaborador

## Antes
(trecho atual do SKILL.md)

## Depois
(trecho corrigido)

## Justificativa
O bridge analysis é parte essencial da variance analysis e
estava sendo feito manualmente. Este patch automatiza a geração.
```

### Passo 6 — Registrar no CHANGELOG.md

Faça append no `/mnt/skills/user/CHANGELOG.md`:

```markdown
## [v1.2.1] - 2026-04-14
### suno-fpa
- [enhancement] Adicionado bridge analysis automático na variance
  analysis (feedback de Nome do Colaborador)
```

### Passo 7 — Confirmar com o usuário

```
Registrado! Criei um patch para incluir bridge analysis no
skill de FP&A. O patch está em:
/patches/suno-fpa-20260414-enhancement.patch.md

Na próxima sincronização, isso vira um PR no repositório.
Obrigado pelo feedback!
```

---

## Priorização automática

Quando houver múltiplos feedbacks pendentes, priorize por:

1. **Severidade**: critical > high > medium > low
2. **Frequência**: mesmo problema reportado por N pessoas vale N×
3. **Tipo**: bug > enhancement > style > data-update > new-skill

Gere um resumo semanal (se solicitado) com:
- Total de feedbacks recebidos
- Distribuição por skill e por tipo
- Top 5 mais urgentes
- Patches gerados vs pendentes de revisão

---

## Sincronização com GitHub

O script `install.js` do npx inclui um comando de sync que:

1. Lê todos os arquivos em `/patches/`
2. Para cada patch:
   - Cria uma branch: `feedback/[skill]-[descrição-curta]-[data]`
   - Aplica a mudança no SKILL.md
   - Commit com mensagem padronizada
   - Abre PR com labels automáticas
   - Body do PR inclui o patch completo + contexto

O admin (você) revisa e faz merge. O próximo `npx install` traz
o patch para todos os usuários.

---

## O que este skill NÃO faz

- Não aplica patches diretamente nos skills em produção.
- Não remove ou desativa skills.
- Não expõe dados de quem reportou para outros usuários
  (feedback é visível apenas para o admin).
