#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";
import { exec as execCallback } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import process from "node:process";
import { select } from "@inquirer/prompts";
import { projectName, language, DB } from "./cliQuestions.js";
import { dbPackages } from "./packages.js";
import ora from "ora";


const exec = promisify(execCallback);

const spinnerDiscardingStdin = ora({
	text: "Loading Packages",
	spinner: process.argv[2],
    color: "cyan"
});


let modelTool;

if (DB === "mongodb") {
  modelTool = await select({
    message: "Choose ODM:",
    choices: [
      {
        name: "Mongoose",
        value: "mongoose"
      }
    ]
  });
} else {
  modelTool = await select({
    message: "Choose ORM:",
    choices: [
      {
        name: "Drizzle",
        value: "drizzle"
      },
      {
        name: "Prisma",
        value: "prisma"
      }
    ]
  });
}

spinnerDiscardingStdin.start("Installing required packages, wait for a while");

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

const selectedPackages = dbPackages[DB][modelTool];

packageJson.dependencies = {
  ...packageJson.dependencies,
  ...selectedPackages.dependencies
};

packageJson.devDependencies = {
  ...packageJson.devDependencies,
  ...selectedPackages.devDependencies
};

await fs.writeFile(
  packageJsonPath,
  JSON.stringify(packageJson, null, 2)
).catch((err)=>{
  spinnerDiscardingStdin.fail(err)
  spinnerDiscardingStdin.start()
});

if (templatePath.includes("javascript")) {
  const appJsPath = path.join(projectPath, "/src/app.js")
  
  const targetLine = 8
  const insertedData = `app.get("/", (req, res)=> {
  res.json("Server is up and running")
})`

  const data = await fs.readFile(appJsPath, "utf-8")

  const lines = data.split(/\r?\n/);
  
  lines.splice(targetLine - 1, 0, insertedData);
  
  const updatedContent = lines.join("\n");
  
  fs.writeFile(appJsPath, updatedContent, "utf-8", (err) => {
    if (err) {
      spinnerDiscardingStdin.fail(err?.message)
      spinnerDiscardingStdin.start()
      return;
    }
  });
  
}

if (templatePath.includes("typescript")) {
  const appTsPath = path.join(projectPath, "/src/app.ts")
  
  const targetLine = [2, 8]

  const insertedData = [
    `import type { Express, Request, Response } from "express"`,
    `app.get("/", (req:Request, res:Response)=> {
  res.json("Server is up and running")
})`
  ]

  const data = await fs.readFile(appTsPath, "utf-8")

  const lines = data.split(/\r?\n/);
  
  lines.splice(targetLine[0] , 0, insertedData[0]);
  lines.splice(1, 1)
  lines.splice(targetLine[1] , 0, insertedData[1]);

  const updatedContent = lines.join("\n");
  
  fs.writeFile(appTsPath, updatedContent, "utf-8", (err) => {
    if (err) {
      spinnerDiscardingStdin.fail(err?.message)
      spinnerDiscardingStdin.start()
      return;
    }
  });
}


await exec("npx gitignore node", {
  cwd: projectPath
}).catch((err)=>{
  spinnerDiscardingStdin.fail("Failed to load .gitignore, run 'npx gitignore node in project root directory to load .gitignore")
  spinnerDiscardingStdin.start()
});

await fs.writeFile(".env", "PORT=8000\n").catch((err)=>{
  spinnerDiscardingStdin.fail("Failed to create .env file")
  spinnerDiscardingStdin.start()
});

await exec("npm install", {
  cwd: projectPath
}).catch((err)=>{
  spinnerDiscardingStdin.fail("Failed to load required packeages, run 'npm install' to load packages")
  spinnerDiscardingStdin.start()
});

await exec("git init", {
  cwd: projectPath
}).catch((err)=>{
  spinnerDiscardingStdin.fail("Failed to initialize the repo, run 'git init' to initialize the repo")
  spinnerDiscardingStdin.start()
});

await exec("git add .", {
  cwd: projectPath
}).catch((err)=>{
  spinnerDiscardingStdin.fail("Failed to get staged the files, run 'git add .' to get staged")
  spinnerDiscardingStdin.start()
});

await exec(`git commit -m "Initial commit"`, {
  cwd: projectPath
}).catch((err)=>{
  spinnerDiscardingStdin.fail(`Failed to commit, run 'git commit -m "Inital commit"`)
  spinnerDiscardingStdin.start()
});

spinnerDiscardingStdin.succeed("Packages successfully installed");
