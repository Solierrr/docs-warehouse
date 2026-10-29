import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const output = join(here, "..", "data", "repository.json");

const skip = new Set([".git", "node_modules", "dist"]);

const descriptions = {
  ".github": "Workflows deste repositório: lint do OpenAPI, Storybook e a galeria publicada no Pages.",
  architecture: "Decisões de arquitetura e planos datados (segredos, ambientes e promoção de imagens).",
  assets: "Banners e ícones de stack usados nos READMEs.",
  "assets/readme": "Banners por serviço e ícones das tecnologias.",
  database: "Esquemas e coleções dos bancos relacional e documental.",
  diagrams: "Diagramas dos esquemas dos bancos, em uma pasta por banco.",
  docs: "Padrões normativos para todos os repositórios de código.",
  "docs/standards": "OpenAPI, Storybook, erros, versionamento, autenticação entre serviços e health checks.",
  gallery: "Esta galeria: aplicativo Vite que gera os diagramas publicados no Pages.",
  github: "Convenções, workflows reutilizáveis, rulesets e templates do GitHub.",
  "github/workflow": "Workflows reutilizáveis por stack, incluindo release-please.",
  "github/openapi": "Ruleset do Spectral para o lint do contrato OpenAPI.",
  helps: "Guias de apoio, como rodar o ambiente local.",
  readme: "Um documento por stack ou tipo de deploy, e uma pasta por serviço.",
  "readme/repositories": "Documentação de cada repositório (README, docs, flows, database e assets), escrita aqui antes de ir ao repositório.",
  "readme/services": "Documentação dos repositórios fora do padrão novo (elos-* e generic-template).",
  "readme/bruno": "Modelos de coleção Bruno por stack.",
  "readme/infisical": "Modelos de uso do Infisical por stack.",
  "readme/running": "Como rodar cada tipo de serviço.",
  "readme/deploy": "Modelos de deploy por tipo.",
  templates: "Arquivos para copiar aos demais repositórios: Docker, Make, HTTP, Sonar e README.",
  "templates/docker": "Dockerfiles e .dockerignore por stack.",
  "templates/readme": "Modelos de README e arquitetura.",
  "templates/make": "Makefile base e variações por stack.",
  "templates/http": "Cliente HTTP local para chamar as APIs em desenvolvimento.",
  "templates/infisical": "Arquivos de configuração do Infisical.",
  "templates/sonar": "Configuração do SonarQube.",
  LICENSE: "Licença do repositório.",
  "README.md": "Visão geral e índice dos padrões e templates.",
};

function countFiles(directory) {
  let total = 0;
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const full = join(directory, entry.name);
    total += entry.isDirectory() ? countFiles(full) : 1;
  }
  return total;
}

function describe(path) {
  return descriptions[path] ?? "";
}

function folders(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !skip.has(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function looseFiles(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

const gapY = 64;
const columnX = [0, 300, 640];

const nodes = [];
const edges = [];
let cursor = 0;

nodes.push({
  id: ".",
  label: "docs-warehouse",
  path: "",
  kind: "root",
  column: 0,
  y: 0,
  files: countFiles(root),
  folders: folders(root).length,
  description: "Repositório central de documentação e arquivos reutilizáveis da Solaria.",
  children: folders(root),
});

const topLevel = [...folders(root), ...looseFiles(root)];
for (const name of topLevel) {
  const full = join(root, name);
  const isDirectory = statSync(full).isDirectory();
  const children = isDirectory ? folders(full) : [];
  const span = Math.max(children.length, 1);
  const y = cursor + ((span - 1) * gapY) / 2;
  const id = name;
  nodes.push({
    id,
    label: isDirectory ? `${name}/` : name,
    path: name,
    kind: isDirectory ? "folder" : "file",
    column: 1,
    y,
    files: isDirectory ? countFiles(full) : 1,
    folders: children.length,
    description: describe(name),
    children,
  });
  edges.push({ source: ".", target: id });
  children.forEach((child, index) => {
    const childPath = `${name}/${child}`;
    const childFull = join(root, childPath);
    nodes.push({
      id: childPath,
      label: `${child}/`,
      path: childPath,
      kind: "folder",
      column: 2,
      y: cursor + index * gapY,
      files: countFiles(childFull),
      folders: folders(childFull).length,
      description: describe(childPath),
      children: folders(childFull),
    });
    edges.push({ source: id, target: childPath });
  });
  cursor += span * gapY + 24;
}

const rootNode = nodes[0];
rootNode.y = cursor / 2 - gapY;

const data = {
  generatedFrom: relative(process.cwd(), root).replaceAll("\\", "/") || ".",
  columnX,
  nodes,
  edges,
};
writeFileSync(output, JSON.stringify(data, null, 1) + "\n");
console.log(`repository.json: ${nodes.length} nós, ${edges.length} arestas`);

// Tecnologias de cada serviço, na ordem da linha de ícones do README em readme/repositories (ou readme/services).
// Só os nomes são lidos; a página desenha os ícones com os SVGs do pacote thesvg.
const services = JSON.parse(readFileSync(join(here, "..", "data", "services.json"), "utf8"));

function readmeStacks(id) {
  const readme = [join(root, "readme", "repositories", id, "README.md"), join(root, "readme", "services", id, "README.md")].find(existsSync);
  if (!readme) return [];
  const text = readFileSync(readme, "utf8");
  return [...text.matchAll(/assets\/readme\/stacks\/([a-z0-9-]+)\.png"[^>]*alt="([^"]*)"/g)].map(([, name, label]) => ({
    name,
    label,
  }));
}

const stack = Object.fromEntries(services.nodes.map((node) => [node.id, readmeStacks(node.id)]));
writeFileSync(join(here, "..", "data", "stack.json"), JSON.stringify(stack, null, 1) + "\n");
console.log(`stack.json: ${Object.keys(stack).length} serviços`);
