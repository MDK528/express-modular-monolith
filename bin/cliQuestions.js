import { input, select } from "@inquirer/prompts";


export const projectName = await input({
  message: "Project name:"
});

export const language = await select({
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

export const DB = await select({
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
    }
  ]
});
