import { input, select } from "@inquirer/prompts";
import chalk from "chalk"

export let projectName;

try {
  projectName = await input({
    message: "Project name:"
  });
} catch (error) {
  console.error(chalk.red(error?.message || "User force closed the prompt with SIGINT"))
  process.exit(1)
} 

export let language;

try {
  language = await select({
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
} catch (error) {
  console.error(chalk.red(error?.message || "User force closed the prompt with SIGINT"))
  process.exit(1)
}

export let DB;

try {
  DB = await select({
    message: "Choose a database:",
    choices: [
      {
        name: "PostgreSQL",
        value: "postgresql"
      },
      {
        name: "MySQL",
        value: "mysql"
      },
      {
        name: "MongoDB",
        value: "mongodb"
      },
      {
        name: "None",
        value: "none"
      }
    ]
  });
} catch (error) {
  console.error(chalk.red(error?.message || "User force closed the prompt with SIGINT"))
  process.exit(1)
}

let modelTool;

export async function selectToolByDB (){
  if(DB === "none") return;

  try {
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
  } catch (error) {
    console.error(chalk.red(error?.message || "User force closed the prompt with SIGINT"))
    process.exit(1)
  }

  return modelTool;
}





