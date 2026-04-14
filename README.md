# Super Gerots — Skills para Claude

Sistema de skills modulares que transforma o Claude em assistente
especializado multi-área para a Suno S.A.

## Instalação

```bash
npx super-gerots install
```

Isso copia todos os skills para `/mnt/skills/user/` e o Claude
passa a reconhecê-los automaticamente na próxima conversa.

## Skills disponíveis

| Skill | Área | Descrição |
|-------|------|-----------|
| `suno-core` | Todas | Output obrigatório, Google Sheets, bonificação |
| `suno-fpa` | FP&A | Variance, forecast, DRE, material de resultado |
| `suno-marketing` | Marketing | Copy, funil, CAC/LTV, briefing |
| `suno-consultoria-wealth` | Consultoria/Wealth | Journey Book, suitability, carteira |
| `suno-feedback` | Sistema | Coleta feedback, gera patches automáticos |

## Arquitetura

```
super-gerots/
├── bin/install.js           ← Script do npx (install/sync/status)
├── package.json
├── CHANGELOG.md
├── skills/
│   ├── MEMORIA.md           ← Contexto persistente da Suno
│   ├── FEEDBACK.md          ← Log de feedbacks coletados
│   ├── core/SKILL.md        ← Output obrigatório
│   ├── fpa/SKILL.md         ← FP&A
│   ├── marketing/SKILL.md   ← Marketing
│   ├── consultoria-wealth/SKILL.md ← Consultoria e Wealth
│   └── feedback-collector/SKILL.md ← Coleta de feedback
└── README.md
```

## Comandos

```bash
npx super-gerots install   # Instala/atualiza skills
npx super-gerots sync      # Envia patches como PRs no GitHub
npx super-gerots status    # Mostra feedbacks pendentes
```

## Feedback loop

1. Colaborador usa o Claude normalmente
2. Claude detecta problema ou recebe sugestão
3. Skill `suno-feedback` classifica e gera patch
4. Admin roda `npx super-gerots sync`
5. PR é criado no GitHub com labels automáticas
6. Admin revisa e faz merge
7. Próximo `npx super-gerots install` traz o patch

## Variáveis de ambiente (para sync)

```bash
export GITHUB_TOKEN=ghp_seu_token
export GEROTS_REPO_OWNER=seu-usuario
export GEROTS_REPO_NAME=super-gerots
```

## Output obrigatório

Todo skill gera ações com campos obrigatórios registrados no
Google Sheets centralizado: tomada de ação, responsável,
relevância ponderada, prazo, e status. Ações concluídas no
prazo alimentam a bonificação por meta.

## Licença

Proprietário — Suno S.A. Uso interno.
