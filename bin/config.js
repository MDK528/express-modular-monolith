import path from "node:path";
import fs from "node:fs/promises";
import ora from "ora";
import { mongodbConBoilerplateCode } from "./boilerPlateCodes.js";


const spinnerDiscardingStdin = ora({
    text: "Loading Packages",
    spinner: process.argv[2],
    color: "cyan"
});


export const boilerPlateCodeSetUpForJS = async (projectPath) => {
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
        const envVar = "DATABASE_URL=write your DB_URL"

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

export const boilerCodeSetUpBasedOnDB = async (projectPath, DB) => {
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
}