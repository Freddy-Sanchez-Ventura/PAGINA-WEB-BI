import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const errors = [];
const files = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === ".git") continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(fullPath);
    else files.push(fullPath);
  }
}

function relative(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

function isLegacyRedirect(file) {
  const rel = relative(file);
  return (
    rel === "404.html" ||
    /^[^/]+\.html$/i.test(rel) ||
    /^BLOG\/HTML\/.*\.html$/i.test(rel)
  );
}

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

await walk(root);

for (const file of files.filter((item) => item.endsWith(".json"))) {
  try {
    JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    errors.push(`${relative(file)}: JSON inválido (${error.message})`);
  }
}

for (const file of files.filter((item) => item.endsWith(".html"))) {
  const html = await readFile(file, "utf8");
  const rel = relative(file);

  if (!isLegacyRedirect(file) && !/<link rel="canonical" href="https:\/\/bimingenieros\.online\//i.test(html)) {
    errors.push(`${rel}: falta canonical absoluto`);
  }

  const references = html.matchAll(/(?:href|src|data-source|data-syllabus)\s*=\s*["']([^"']+)["']/gi);

  for (const match of references) {
    const reference = match[1];
    if (/^(https?:|mailto:|tel:|data:|javascript:|#|\/\/)/i.test(reference)) continue;

    if (!isLegacyRedirect(file) && /\.html(?:[?#]|$)/i.test(reference)) {
      errors.push(`${rel}: enlace interno con extensión (${reference})`);
    }

    const clean = reference.split(/[?#]/)[0];
    if (!clean) continue;

    let target;
    if (clean.startsWith("/")) {
      target = path.join(root, clean.slice(1));
    } else {
      target = path.resolve(path.dirname(file), clean);
    }

    if (clean.endsWith("/")) target = path.join(target, "index.html");
    if (!(await exists(target))) errors.push(`${rel}: recurso inexistente (${reference})`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Sitio válido: ${files.length} archivos revisados.`);
}
