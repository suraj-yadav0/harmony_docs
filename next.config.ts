import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === "true";

// If GITHUB_REPOSITORY is present (e.g. "suraj-yadav0/harmony_docs"), determine basePath
let basePath = "";
if (process.env.NEXT_PUBLIC_BASE_PATH !== undefined) {
  basePath = process.env.NEXT_PUBLIC_BASE_PATH;
} else if (isGithubActions && process.env.GITHUB_REPOSITORY) {
  const repoName = process.env.GITHUB_REPOSITORY.split("/")[1];
  // If repository name is <username>.github.io, basePath is root, else /<repo-name>
  basePath = repoName && !repoName.endsWith(".github.io") ? `/${repoName}` : "";
}

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
