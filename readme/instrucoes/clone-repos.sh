#!/usr/bin/env bash
# Baixa ou atualiza todos os repositórios documentados, mais o docs-warehouse.
# Uso no Git Bash: bash clone-repos.sh [pasta]   (padrão: ~/solaria-repos)
# Nunca descarta trabalho local: repositório com mudança ou fora da main é só avisado.
set -u

DEST="${1:-$HOME/solaria-repos}"
ORG="https://github.com/Solierrr"
REPOS=(
  docs-warehouse
  ai-accessibility ai-assistant ai-geographic ai-operational ai-validation
  api-auth api-core api-email api-google api-messenger api-notify api-recommendation
  database-bootstrap database-console database-rpa databricks-stocker databricks-sync
  docs-reports
  infra-broker infra-gateway infra-gitops infra-grafana infra-keepalive infra-otel-collector infra-platform infra-stress
  lib-ai lib-web mcp-database mobile-app mocks-warehouse
  web-app web-docs web-sandbox web-worker
)

mkdir -p "$DEST" || exit 1
failed=()
for repo in "${REPOS[@]}"; do
  dir="$DEST/$repo"
  if [ ! -d "$dir/.git" ]; then
    echo "clone  $repo"
    git clone --quiet "$ORG/$repo.git" "$dir" || failed+=("$repo")
    continue
  fi
  git -C "$dir" fetch --quiet origin || { failed+=("$repo"); continue; }
  branch=$(git -C "$dir" branch --show-current)
  if [ -n "$(git -C "$dir" status --porcelain)" ]; then
    echo "skip   $repo (mudanças locais, nada foi alterado)"
  elif [ "$branch" != "main" ]; then
    echo "skip   $repo (na branch $branch, nada foi alterado)"
  else
    echo "pull   $repo"
    git -C "$dir" pull --quiet --ff-only origin main || failed+=("$repo")
  fi
done

echo
echo "Repositórios em $DEST"
if [ ${#failed[@]} -gt 0 ]; then
  echo "Falharam: ${failed[*]}"
  exit 1
fi
