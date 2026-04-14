#!/usr/bin/env node

/**
 * Super Gerots — Instalador de Skills para Claude
 *
 * Uso:
 *   npx super-gerots install    → Copia skills para /mnt/skills/user/
 *   npx super-gerots sync       → Lê patches e cria PRs no GitHub
 *   npx super-gerots status     → Mostra feedback pendente
 *
 * Requisitos:
 *   - Node.js 18+
 *   - Git configurado
 *   - GITHUB_TOKEN no env (para sync)
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const SKILLS_SOURCE = path.join(__dirname, "..", "skills");
const SKILLS_TARGET = "/mnt/skills/user";
const PATCHES_DIR = path.join(SKILLS_TARGET, "patches");
const FEEDBACK_FILE = path.join(SKILLS_TARGET, "FEEDBACK.md");

const REPO_OWNER = process.env.GEROTS_REPO_OWNER || "seu-usuario";
const REPO_NAME = process.env.GEROTS_REPO_NAME || "super-gerots";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// ─── Cores pra terminal ────────────────────────────────────────
const c = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

// ─── Comandos ──────────────────────────────────────────────────
const commands = {
  install() {
    console.log(c.bold("\n🔧 Super Gerots — Instalando skills...\n"));

    if (!fs.existsSync(SKILLS_TARGET)) {
      fs.mkdirSync(SKILLS_TARGET, { recursive: true });
    }

    const skills = fs
      .readdirSync(SKILLS_SOURCE, { withFileTypes: true })
      .filter((d) => d.isDirectory());

    for (const skill of skills) {
      const src = path.join(SKILLS_SOURCE, skill.name);
      const dst = path.join(SKILLS_TARGET, skill.name);
      copyDirSync(src, dst);
      console.log(c.green(`  ✓ ${skill.name}`));
    }

    // Copia arquivos raiz (MEMORIA.md, FEEDBACK.md)
    for (const file of ["MEMORIA.md", "FEEDBACK.md"]) {
      const src = path.join(SKILLS_SOURCE, file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(SKILLS_TARGET, file));
        console.log(c.green(`  ✓ ${file}`));
      }
    }

    // Cria diretório de patches se não existir
    if (!fs.existsSync(PATCHES_DIR)) {
      fs.mkdirSync(PATCHES_DIR, { recursive: true });
    }

    console.log(c.bold("\n✅ Skills instaladas em " + SKILLS_TARGET));
    console.log(
      "   O Claude vai detectar automaticamente na próxima conversa.\n"
    );
  },

  sync() {
    console.log(c.bold("\n🔄 Super Gerots — Sincronizando patches...\n"));

    if (!GITHUB_TOKEN) {
      console.log(
        c.red("  ✗ GITHUB_TOKEN não encontrado no ambiente.")
      );
      console.log(
        "    Defina com: export GITHUB_TOKEN=ghp_seu_token\n"
      );
      process.exit(1);
    }

    if (!fs.existsSync(PATCHES_DIR)) {
      console.log(c.yellow("  Nenhum patch encontrado.\n"));
      return;
    }

    const patches = fs
      .readdirSync(PATCHES_DIR)
      .filter((f) => f.endsWith(".patch.md"));

    if (patches.length === 0) {
      console.log(c.yellow("  Nenhum patch pendente.\n"));
      return;
    }

    console.log(`  Encontrados ${patches.length} patch(es):\n`);

    for (const patchFile of patches) {
      const content = fs.readFileSync(
        path.join(PATCHES_DIR, patchFile),
        "utf-8"
      );
      const title = extractTitle(content);
      const labels = extractLabels(patchFile);

      console.log(c.yellow(`  → ${patchFile}`));
      console.log(`    Título: ${title}`);
      console.log(`    Labels: ${labels.join(", ")}`);

      try {
        createGitHubPR({
          title: `[feedback] ${title}`,
          body: content,
          branch: `feedback/${patchFile.replace(".patch.md", "")}`,
          labels,
        });
        console.log(c.green(`    ✓ PR criado com sucesso`));

        // Move patch para processados
        const processed = path.join(PATCHES_DIR, ".processed");
        if (!fs.existsSync(processed)) {
          fs.mkdirSync(processed);
        }
        fs.renameSync(
          path.join(PATCHES_DIR, patchFile),
          path.join(processed, patchFile)
        );
      } catch (err) {
        console.log(c.red(`    ✗ Erro: ${err.message}`));
      }
    }

    console.log(c.bold("\n✅ Sincronização completa.\n"));
  },

  status() {
    console.log(c.bold("\n📊 Super Gerots — Status de feedback\n"));

    if (!fs.existsSync(FEEDBACK_FILE)) {
      console.log(c.yellow("  Nenhum feedback registrado ainda.\n"));
      return;
    }

    const content = fs.readFileSync(FEEDBACK_FILE, "utf-8");
    const entries = content.split("---").filter((e) => e.trim().startsWith("##"));

    const pending = entries.filter((e) => e.includes("Status: pending"));
    const patched = entries.filter((e) => e.includes("Status: patched"));

    console.log(`  Total de feedbacks: ${entries.length}`);
    console.log(c.yellow(`  Pendentes: ${pending.length}`));
    console.log(c.green(`  Resolvidos: ${patched.length}`));

    if (pending.length > 0) {
      console.log(c.bold("\n  Pendentes:\n"));
      for (const entry of pending.slice(0, 5)) {
        const firstLine = entry.trim().split("\n")[0];
        console.log(`    • ${firstLine}`);
      }
      if (pending.length > 5) {
        console.log(`    ... e mais ${pending.length - 5}`);
      }
    }

    // Patches não sincronizados
    if (fs.existsSync(PATCHES_DIR)) {
      const patches = fs
        .readdirSync(PATCHES_DIR)
        .filter((f) => f.endsWith(".patch.md"));
      if (patches.length > 0) {
        console.log(
          c.yellow(
            `\n  ⚠ ${patches.length} patch(es) aguardando sync.`
          )
        );
        console.log("    Execute: npx super-gerots sync\n");
      }
    }
  },
};

// ─── Helpers ───────────────────────────────────────────────────
function copyDirSync(src, dst) {
  if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) copyDirSync(s, d);
    else fs.copyFileSync(s, d);
  }
}

function extractTitle(content) {
  const match = content.match(/^# Patch: (.+)/m);
  return match ? match[1] : "Feedback patch";
}

function extractLabels(filename) {
  const labels = [];
  if (filename.includes("bug")) labels.push("bug");
  else if (filename.includes("enhancement")) labels.push("enhancement");
  else if (filename.includes("new-skill")) labels.push("new-skill");
  else if (filename.includes("style")) labels.push("style");
  else if (filename.includes("data-update")) labels.push("data-update");
  labels.push("auto-feedback");
  return labels;
}

function createGitHubPR({ title, body, branch, labels }) {
  const base = "main";

  // Criar branch, commit, e PR via GitHub API
  // Aqui usamos curl porque é o que está disponível no ambiente
  const apiBase = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;
  const headers = `-H "Authorization: token ${GITHUB_TOKEN}" -H "Accept: application/vnd.github.v3+json"`;

  // Pega SHA do main
  const mainRef = JSON.parse(
    execSync(`curl -s ${headers} ${apiBase}/git/ref/heads/main`).toString()
  );
  const sha = mainRef.object.sha;

  // Cria branch
  execSync(
    `curl -s ${headers} -X POST ${apiBase}/git/refs -d '${JSON.stringify({
      ref: `refs/heads/${branch}`,
      sha,
    })}'`
  );

  // Cria PR
  const prData = JSON.stringify({
    title,
    body: body.substring(0, 65000), // GitHub limit
    head: branch,
    base,
    labels,
  });

  execSync(
    `curl -s ${headers} -X POST ${apiBase}/pulls -d '${prData}'`
  );
}

// ─── Main ──────────────────────────────────────────────────────
const cmd = process.argv[2] || "install";

if (commands[cmd]) {
  commands[cmd]();
} else {
  console.log(c.red(`Comando desconhecido: ${cmd}`));
  console.log("Uso: npx super-gerots [install|sync|status]");
  process.exit(1);
}
