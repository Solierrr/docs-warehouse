import android from "thesvg/android";
import apacheMaven from "thesvg/apache-maven";
import argocd from "thesvg/argocd";
import bruno from "thesvg/bruno";
import cloudflare from "thesvg/cloudflare";
import cloudflareWorkers from "thesvg/cloudflare-workers";
import cloudinary from "thesvg/cloudinary";
import databricks from "thesvg/databricks";
import docker from "thesvg/docker";
import fastapi from "thesvg/fastapi";
import fastify from "thesvg/fastify";
import firebase from "thesvg/firebase";
import gemini from "thesvg/gemini";
import github from "thesvg/github";
import githubActions from "thesvg/github-actions";
import githubPages from "thesvg/github-pages";
import googleCloud from "thesvg/google-cloud";
import googleMaps from "thesvg/google-maps";
import googleTranslate from "thesvg/google-translate";
import gradle from "thesvg/gradle";
import grafana from "thesvg/grafana";
import groq from "thesvg/groq";
import helm from "thesvg/helm";
import html5 from "thesvg/html5";
import infisical from "thesvg/infisical";
import java from "thesvg/java";
import javascript from "thesvg/javascript";
import jetpackCompose from "thesvg/jetpack-compose";
import jwt from "thesvg/jwt";
import k6 from "thesvg/k6";
import kong from "thesvg/kong";
import kotlin from "thesvg/kotlin";
import kubernetes from "thesvg/kubernetes";
import langchain from "thesvg/langchain";
import mailpit from "thesvg/mailpit";
import markdown from "thesvg/markdown";
import modelContextProtocol from "thesvg/model-context-protocol";
import mongodb from "thesvg/mongodb";
import neo4j from "thesvg/neo4j";
import nginx from "thesvg/nginx";
import npm from "thesvg/npm";
import openai from "thesvg/openai";
import opentelemetry from "thesvg/opentelemetry";
import postgresql from "thesvg/postgresql";
import pydantic from "thesvg/pydantic";
import pypi from "thesvg/pypi";
import python from "thesvg/python";
import qdrant from "thesvg/qdrant";
import rabbitmq from "thesvg/rabbitmq";
import react from "thesvg/react";
import redis from "thesvg/redis";
import render from "thesvg/render";
import sonarcloud from "thesvg/sonarcloud";
import springBoot from "thesvg/spring-boot";
import springSecurity from "thesvg/spring-security";
import storybook from "thesvg/storybook";
import swagger from "thesvg/swagger";
import tailwindcss from "thesvg/tailwindcss";
import terraform from "thesvg/terraform";
import tomcat from "thesvg/tomcat";
import typescript from "thesvg/typescript";
import upstash from "thesvg/upstash";
import vite from "thesvg/vite";
interface IconModule {
  title: string;
  svg: string;
  variants: Record<string, string>;
}

// Nomes de stack usados em services.json e nas linhas de ícones dos READMEs. Os logos
// brancos usam a variante "light", que é a escura, para aparecer no fundo claro.
const icons: Record<string, [IconModule, string?]> = {
  android: [android],
  argocd: [argocd],
  bruno: [bruno],
  cloudflare: [cloudflare],
  "cloudflare-workers": [cloudflareWorkers],
  cloudinary: [cloudinary],
  databricks: [databricks],
  docker: [docker],
  fastapi: [fastapi],
  fastify: [fastify, "light"],
  firebase: [firebase],
  gcp: [googleCloud],
  gemini: [gemini],
  github: [github],
  "github-actions": [githubActions],
  "github-pages": [githubPages],
  "google-maps": [googleMaps],
  "google-translate": [googleTranslate],
  gradle: [gradle],
  grafana: [grafana],
  groq: [groq],
  helm: [helm],
  html: [html5],
  infisical: [infisical],
  java: [java],
  javascript: [javascript],
  "jetpack-compose": [jetpackCompose],
  jwt: [jwt],
  k6: [k6],
  kong: [kong],
  kotlin: [kotlin],
  kubernetes: [kubernetes],
  langchain: [langchain],
  "kubernetes-deployment": [kubernetes],
  "kubernetes-ingress": [kubernetes],
  "kubernetes-service": [kubernetes],
  mailpit: [mailpit],
  markdown: [markdown, "light"],
  maven: [apacheMaven],
  mcp: [modelContextProtocol, "light"],
  mongodb: [mongodb],
  neo4j: [neo4j],
  nginx: [nginx],
  npm: [npm],
  openai: [openai, "light"],
  opentelemetry: [opentelemetry],
  postgresql: [postgresql],
  pydantic: [pydantic],
  pypi: [pypi],
  python: [python],
  qdrant: [qdrant],
  rabbitmq: [rabbitmq],
  react: [react],
  redis: [redis],
  render: [render],
  sonarcloud: [sonarcloud],
  "spring-security": [springSecurity],
  springboot: [springBoot],
  storybook: [storybook],
  swagger: [swagger],
  tailwind: [tailwindcss],
  terraform: [terraform],
  tomcat: [tomcat],
  typescript: [typescript],
  upstash: [upstash],
  vite: [vite],
};

export interface StackIcon {
  title: string;
  svg: string;
}

export function stackIcon(name: string): StackIcon | undefined {
  const entry = icons[name];
  if (!entry) return undefined;
  const [module, variant] = entry;
  return { title: module.title, svg: (variant && module.variants[variant]) || module.svg };
}

export function svgUrl(svg: string, size: number) {
  const sized = svg.replace(/<svg\b([^>]*)>/, (_tag, attributes: string) => {
    const rest = attributes.replace(/\s(width|height)="[^"]*"/g, "");
    return `<svg${rest} width="${size}" height="${size}">`;
  });
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sized)}`;
}

function tileCanvas(size: number) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  context?.beginPath();
  context?.roundRect(0, 0, size, size, size * 0.24);
  if (context) context.fillStyle = "#ffffff";
  context?.fill();
  return { canvas, context };
}

// Ladrilho com as iniciais, para provedores que não têm logo no pacote.
export function monogramTile(label: string, size = 256): string {
  const { canvas, context } = tileCanvas(size);
  if (!context) return "";
  const initials = label
    .split(/[\s·-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
  context.fillStyle = "#1f2937";
  context.font = `700 ${Math.round(size * 0.36)}px "Plus Jakarta Sans", sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(initials, size / 2, size / 2 + size * 0.02);
  return canvas.toDataURL("image/png");
}

// Desenha o logo num ladrilho branco arredondado, já no tamanho da textura do nó.
export async function nodeTile(svg: string, size = 256): Promise<string> {
  const image = new Image();
  image.src = svgUrl(svg, Math.round(size * 0.68));
  await image.decode();
  const { canvas, context } = tileCanvas(size);
  if (!context) return "";
  context.drawImage(image, (size - image.width) / 2, (size - image.height) / 2);
  return canvas.toDataURL("image/png");
}
