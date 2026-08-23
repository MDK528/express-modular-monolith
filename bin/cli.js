#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";
import { exec as execCallback } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import { input, select } from "@inquirer/prompts";

const exec = promisify(execCallback);

const projectName = await input({
  message: "Project name:"
});

const language = await select({
  message: "Choose a language:",
  choices: [
    {
      name: "JavaScript",
      value: "javascript"
    },
    {
      name: "TypeScript",
      value: "typescript"
    }
  ]
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatePath = path.join(__dirname, "..", "templates", language);

const projectPath = projectName === "." ? process.cwd() : path.join(process.cwd(), projectName);
await fs.cp( templatePath, projectPath, { recursive: true });

const packageJsonPath = path.join(projectPath, "package.json");

const packageJson = JSON.parse(
  await fs.readFile(packageJsonPath, "utf-8")
);

if (projectName === ".") {
  packageJson.name = path.basename(process.cwd());
}else{
  packageJson.name = projectName;
}

await fs.writeFile(
  packageJsonPath,
  JSON.stringify(packageJson, null, 2)
);

await exec("npx gitignore node", {
  cwd: projectPath
})

await fs.writeFile(".env", "PORT=8000\n")

await exec("npm install", {
  cwd: projectPath
})

await exec("git init", {
  cwd: projectPath
})

await exec("git add .", {
  cwd: projectPath
})

await exec(`git commit -m "Initial commit"`, {
  cwd: projectPath
})