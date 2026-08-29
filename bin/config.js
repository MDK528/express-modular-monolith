import path from "node:path";
import fs from "node:fs/promises";
import ora from "ora";
import { drizzlePostgresBoilerPlate, mongodbConBoilerplateCode } from "./boilerPlateCodes.js";


const spinnerDiscardingStdin = ora({
    text: "Loading Packages",
    spinner: process.argv[2],
    color: "cyan"
});


export const JSboilerPlateCodeSetUp = async (projectPath) => {
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

export const TSboilerPlateCodeSetUp = async (projectPath) => {
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

export const addEnvBasedOnDBs = async (projectPath, DB) => {
    const targetLine = 2

    if (DB === "mongodb") {
        const envVar = "MONGODB_URI=write your mongodb uri"

        const dotEnvPath = path.join(projectPath, ".env")

        const envData = await fs.readFile(dotEnvPath, "utf-8")

        const lines = envData.split(/\r?\n/);
        lines.splice(targetLine - 1, 0, envVar);

        const updatedContent = lines.join("\n");

        fs.writeFile(dotEnvPath, updatedContent, "utf-8", (err) => {
            if (err) {
                spinnerDiscardingStdin.fail(err?.message)
                spinnerDiscardingStdin.start()
                return;
            }
        });
    }

    if (DB === "postgresql" || DB === "mysql") {
        const envVar = "DATABASE_URL=write_your_DB_URL"

        const dotEnvPath = path.join(projectPath, ".env")

        const envData = await fs.readFile(dotEnvPath, "utf-8")

        const lines = envData.split(/\r?\n/);
        lines.splice(targetLine - 1, 0, envVar);

        const updatedContent = lines.join("\n");

        fs.writeFile(dotEnvPath, updatedContent, "utf-8", (err) => {
            if (err) {
                spinnerDiscardingStdin.fail(err?.message)
                spinnerDiscardingStdin.start()
                return;
            }
        });
    }
}

export const DBboilerCodeSetUp = async (projectPath, DB, modelTool) => {
    if (DB === "mongodb") {
        const dbJsPath = path.join(projectPath, "/src/common/config/db.js")

        fs.writeFile(dbJsPath, mongodbConBoilerplateCode, "utf-8", (err)=>{
            if (err) {
                spinnerDiscardingStdin.fail(err?.message)
                spinnerDiscardingStdin.start()
                return;
            }
        })

        const serverJsPath = path.join(projectPath, "/src/server.js")
        const serverJsData = await fs.readFile(serverJsPath, "utf-8");
        
        const targetLine = [3, 9]
        const insertedData = [`import { connectionDB } from "../src/common/config/db.js"`,
            `        await connectionDB()`];
        
        const lines = serverJsData.split(/\r?\n/);
        lines.splice(targetLine[0] - 1, 0, insertedData[0])
        lines.splice(targetLine[1], 1)
        lines.splice(targetLine[1], 0, insertedData[1])



        const updatedContent = lines.join("\n");

        fs.writeFile(serverJsPath, updatedContent, "utf-8", (err)=>{
            if (err) {
                spinnerDiscardingStdin.fail(err?.message)
                spinnerDiscardingStdin.start()
                return;
            }
        })

    }

    if (DB === "postgresql" && modelTool === "drizzle") {
        const dbJsPath = path.join(projectPath, "/src/common/config/db.js")

        fs.writeFile(dbJsPath, drizzlePostgresBoilerPlate, "utf-8", (err)=>{
            if (err) {
                spinnerDiscardingStdin.fail(err?.message)
                spinnerDiscardingStdin.start()
                return;
            }
        })

        const serverJsPath = path.join(projectPath, "/src/server.js");
        const serverJsData = await fs.readFile(serverJsPath, "utf-8");

        const targetLine = [3, 9]
        const insertedData = [`import { db } from "./common/config/db.js";
import { sql } from 'drizzle-orm'`,
            '        await db.execute(sql`select 1`)'];

        const lines = serverJsData.split(/\r?\n/);
        lines.splice(targetLine[0] - 1, 0, insertedData[0])
        lines.splice(targetLine[1], 1)
        lines.splice(targetLine[1], 0, insertedData[1])



        const updatedContent = lines.join("\n");

        fs.writeFile(serverJsPath, updatedContent, "utf-8", (err)=>{
            if (err) {
                spinnerDiscardingStdin.fail(err?.message)
                spinnerDiscardingStdin.start()
                return;
            }
        })

    }
}