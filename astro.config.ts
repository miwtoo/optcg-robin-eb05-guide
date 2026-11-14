import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

const repository = process.env.GITHUB_REPOSITORY;
const [owner, repo] = repository?.split("/") ?? [];
const isUserOrOrganizationSite =
  owner && repo && repo.toLowerCase() === `${owner.toLowerCase()}.github.io`;

const inferredSite = owner ? `https://${owner.toLowerCase()}.github.io` : undefined;
const inferredBase = owner && repo && !isUserOrOrganizationSite ? `/${repo}` : "/";
const site = process.env.ASTRO_SITE?.trim() || inferredSite;
const base = process.env.ASTRO_BASE?.trim() || inferredBase;

export default defineConfig({
  ...(site ? { site } : {}),
  base,
  output: "static",
  integrations: [mdx()],
});
