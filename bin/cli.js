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
import ora from 'ora';


const exec = promisify(execCallback);

const spinnerDiscardingStdin = ora({
	text: 'Loading unicorns',
	spinner: process.argv[2],
    color: 'red'
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

spinnerDiscardingStdin.start("Installing all the Packages, wait for a while");

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
);

if (templatePath.includes("javascript")) {
  const appJsPath = path.join(projectPath, "/src/app.js")
  
  const targetLine = 8
  const insertedData = `app.get("/", (req, res)=> {
    res.json("Server is up and running")
  })`

  const data = await fs.readFile(appJsPath, "utf-8")

  const lines = data.split(/\r?\n/);
  
  lines.splice(targetLine - 1, 0, insertedData);
  
  const updatedContent = lines.join('\n');
  
  fs.writeFile(appJsPath, updatedContent, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
  });
  
}


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

spinnerDiscardingStdin.succeed("Packages successfully installed");
