#!/usr/bin/env node

/**
 * Super Gerots — Instalador de Skills para Claude
 *
 * Uso:
 *   npx super-gerots install    → Copia skills para /mnt/skills/user/
 *   npx super-gerots sync       → Lê patches e cria PRs no GitHub via gh CLI
 *   npx super-gerots status     → Mostra feedback pendente
 *   npx super-gerots setup      → Checa dependências e autenticação
 *
 * Requisitos:
 *   - Node.js 18+
 *   - GitHub CLI (gh) instalado e autenticado (para sync)
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const SKILLS_SOURCE = path.join(__dirname, "..", "skills");
const SKILLS_TARGET = "/mnt/skills/user";
const PATCHES_DIR = path.join(SKILLS_TARGET, "patches");
const FEEDBACK_FILE = path.join(SKILLS_TARGET, "FEEDBACK.md");

// ─── Cores pra terminal ────────────────────────────────────────
const c = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

// ─── Helpers ───────────────────────────────────────────────────
const run = (cmd, opts = {}) => {
  try {
    return execSync(cmd, { stdio: "pipe", ...opts }).toString().trim();
  } catch (e) {
    return null;
  }
};

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

function checkGh() {
  if (!run("gh --version")) {
    console.log(c.red("  ✗ GitHub CLI (gh) não encontrado."));
    console.log("    Instale: brew install gh  |  sudo apt install gh");
    console.log("    Docs: https://cli.github.com\n");
    return false;
  }
  if (!run("gh auth status")) {
    console.log(c.yellow("  ⚠ gh não autenticado. Iniciando login...\n"));
    try {
      execSync("gh auth login", { stdio: "inherit" });
    } catch {
      console.log(c.red("  ✗ Falha na autenticação.\n"));
      return false;
    }
  }
  return true;
}

// ─── Comandos ──────────────────────────────────────────────────
const commands = {
  setup() {
    console.log(c.bold("\n🚀 Super Gerots — Setup\n"));

    // Node
    const nodeV = process.version;
    const nodeMajor = parseInt(nodeV.slice(1));
    if (nodeMajor >= 18) {
      console.log(c.green(`  ✓ Node.js ${nodeV}`));
    } else {
      console.log(c.red(`  ✗ Node.js ${nodeV} (precisa >= 18)`));
    }

    // Git
    const gitV = run("git --version");
    if (gitV) {
      console.log(c.green(`  ✓ ${gitV}`));
    } else {
      console.log(c.red("  ✗ Git não encontrado"));
    }

    // gh CLI
    const ghV = run("gh --version");
    if (ghV) {
      const firstLine = ghV.split("\n")[0];
      console.log(c.green(`  ✓ ${firstLine}`));

      // Auth
      const authOk = run("gh auth status");
      if (authOk) {
        console.log(c.green("  ✓ gh autenticado"));
      } else {
        console.log(c.yellow("  ⚠ gh não autenticado"));
        console.log("    Execute: gh auth login\n");
      }
    } else {
      console.log(c.red("  ✗ GitHub CLI (gh) não encontrado"));
      console.log("    Instale: brew install gh  |  sudo apt install gh");
    }

    // Skills target
    if (fs.existsSync(SKILLS_TARGET)) {
      const count = fs
        .readdirSync(SKILLS_TARGET, { withFileTypes: true })
        .filter((d) => d.isDirectory()).length;
      console.log(c.green(`  ✓ ${SKILLS_TARGET} existe (${count} skills)`));
    } else {
      console.log(c.yellow(`  ⚠ ${SKILLS_TARGET} não existe (será criado no install)`));
    }

    console.log(c.bold("\n✅ Setup completo.\n"));
  },

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

    console.log(c.bold(`\n✅ ${skills.length} skills instaladas em ${SKILLS_TARGET}`));
    console.log(
      "   O Claude vai detectar automaticamente na próxima conversa.\n"
    );
  },

  sync() {
    console.log(c.bold("\n🔄 Super Gerots — Sincronizando patches...\n"));

    if (!checkGh()) {
      process.exit(1);
    }

    // Pull mais recente antes de criar branches
    console.log(c.dim("  Atualizando repo local..."));
    run("git pull --rebase origin main");

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
      const branchName = `feedback/${patchFile.replace(".patch.md", "")}`;

      console.log(c.yellow(`  → ${patchFile}`));
      console.log(`    Título: ${title}`);
      console.log(`    Labels: ${labels.join(", ")}`);

      try {
        // Cria branch local
        run(`git checkout -b ${branchName}`);

        // Commit o patch como evidência
        const patchDst = path.join("skills", "patches", patchFile);
        const patchDstDir = path.dirname(patchDst);
        if (!fs.existsSync(patchDstDir)) {
          fs.mkdirSync(patchDstDir, { recursive: true });
        }
        fs.copyFileSync(path.join(PATCHES_DIR, patchFile), patchDst);

        run(`git add .`);
        run(`git commit -m "feedback: ${title}"`);
        run(`git push origin ${branchName}`);

        // Cria PR via gh CLI
        const labelArgs = labels.map((l) => `--label "${l}"`).join(" ");
        const bodyEscaped = content
          .replace(/"/g, '\\"')
          .substring(0, 65000);

        run(
          `gh pr create --title "[feedback] ${title}" --body "${bodyEscaped}" --base main ${labelArgs}`,
          { stdio: "pipe" }
        );

        console.log(c.green(`    ✓ PR criado com sucesso`));

        // Volta pro main
        run("git checkout main");

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
        run("git checkout main");
      }
    }

    console.log(c.bold("\n✅ Sincronização completa.\n"));
  },

  status() {
    console.log(c.bold("\n📊 Super Gerots — Status\n"));

    // Skills instaladas
    if (fs.existsSync(SKILLS_TARGET)) {
      const skills = fs
        .readdirSync(SKILLS_TARGET, { withFileTypes: true })
        .filter((d) => d.isDirectory() && d.name !== "patches");
      console.log(c.bold(`  Skills instaladas: ${skills.length}`));
      for (const s of skills) {
        console.log(c.green(`    • ${s.name}`));
      }
    } else {
      console.log(c.yellow("  Nenhuma skill instalada ainda."));
      console.log("    Execute: npx super-gerots install\n");
      return;
    }

    // Feedbacks
    console.log("");
    if (!fs.existsSync(FEEDBACK_FILE)) {
      console.log(c.dim("  Nenhum feedback registrado ainda."));
    } else {
      const content = fs.readFileSync(FEEDBACK_FILE, "utf-8");
      const entries = content.split("---").filter((e) => e.trim().startsWith("##"));
      const pending = entries.filter((e) => e.includes("Status: pending"));
      const patched = entries.filter((e) => e.includes("Status: patched"));

      console.log(`  Feedbacks: ${entries.length} total`);
      console.log(c.yellow(`    Pendentes: ${pending.length}`));
      console.log(c.green(`    Resolvidos: ${patched.length}`));

      if (pending.length > 0) {
        console.log(c.bold("\n  Últimos pendentes:"));
        for (const entry of pending.slice(0, 5)) {
          const firstLine = entry.trim().split("\n")[0];
          console.log(`    • ${firstLine}`);
        }
        if (pending.length > 5) {
          console.log(c.dim(`    ... e mais ${pending.length - 5}`));
        }
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

    console.log("");
  },
};

// ─── Main ──────────────────────────────────────────────────────
const cmd = process.argv[2] || "install";

if (commands[cmd]) {
  commands[cmd]();
} else {
  console.log(c.red(`Comando desconhecido: ${cmd}\n`));
  console.log("Uso: npx super-gerots <comando>\n");
  console.log("Comandos:");
  console.log("  install   Instala/atualiza skills em /mnt/skills/user/");
  console.log("  sync      Envia patches como PRs no GitHub via gh CLI");
  console.log("  status    Mostra skills instaladas e feedbacks pendentes");
  console.log("  setup     Verifica dependências e autenticação\n");
  process.exit(1);
}
