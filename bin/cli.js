#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";
import { exec as execCallback } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import process from "node:process";
import { projectName, language, DB, selectToolByDB } from "./cliQuestions.js";
import { dbPackages } from "./packages.js";
import chalk from "chalk"
import { addEnvBasedOnDBs, JSboilerPlateCodeSetUp, DBboilerCodeSetUp, TSboilerPlateCodeSetUp, spinnerDiscardingStdin } from "./config.js";


const exec = promisify(execCallback);

const modelTool = await selectToolByDB()

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
  packageJson.name = path.basename(projectPath).toLocaleLowerCase();
} else{
  packageJson.name = projectName.toLocaleLowerCase();
}

const loadDependenciesByDB = async () => {

  if(DB === "none") return;

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

}

await loadDependenciesByDB()


let lang;

if (templatePath.includes("javascript")) {
  await JSboilerPlateCodeSetUp(projectPath)
  await DBboilerCodeSetUp(projectPath, DB, modelTool, lang = "javascript")
}

if (templatePath.includes("typescript")) {
  await TSboilerPlateCodeSetUp(projectPath)
  await DBboilerCodeSetUp(projectPath, DB, modelTool, lang = "typescript")
  if(modelTool === "mongoose"){
    await exec("npm install @types/mongoose -D", {
      cwd: projectPath
    })
  }
}

await fs.rename(
  path.join(projectPath, "_gitignore"),
  path.join(projectPath, ".gitignore")
).catch((err) => {
  spinnerDiscardingStdin.fail("Failed to load .gitignore, run 'npx gitignore node in project root directory to load .gitignore")
  spinnerDiscardingStdin.start()
})

await fs.writeFile(path.join(projectPath ,".env"), "PORT=8000\n").catch((err)=>{
  spinnerDiscardingStdin.fail("Failed to create .env file")
  spinnerDiscardingStdin.start()
}).then(async ()=>{
  await addEnvBasedOnDBs(projectPath, DB)
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

spinnerDiscardingStdin.succeed(chalk.green("Packages successfully installed"));

if(DB !== "none") { 
  spinnerDiscardingStdin.info(chalk.yellow("Before starting your dev server set your correct DATABASE_URL in .env"))
}
