import path from "node:path";
import fs from "node:fs/promises";
import ora from "ora";
import { drizzleConfigBoilerPlate, drizzlePostgresBoilerPlate, mongodbConnectionCode } from "./boilerPlateCodes.js";


export const spinnerDiscardingStdin = ora({
	text: "Loading Packages",
	spinner: "dots14",
    color: "cyan"
});

export const configurePackageByDB  = async (dbPackages, DB, modelTool, packageJson, packageJsonPath, ORMscripts) => {

    if(DB === "none") return;

    const selectedPackages = dbPackages[DB][modelTool];

    if(DB !== "mongodb" && modelTool !== "mongoose"){
        const selectedScripts = ORMscripts[modelTool];

        packageJson.scripts = {
            ...packageJson.scripts,
            ...selectedScripts.scripts
        }
    }

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

export const jsBoilerPlateCodeSetUp = async (projectPath) => {
    const appJsPath = path.join(projectPath, "/src/app.js")

    const targetLine = 8
    const insertedData = `app.get("/", (req, res)=> {
  res.json("Server is up and running");
});`

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

export const tsBoilerPlateCodeSetUp = async (projectPath) => {
    const appTsPath = path.join(projectPath, "/src/app.ts")
      
    const targetLine = [2, 8]

    const insertedData = [
    `import type { Express, Request, Response } from "express";`,
    `app.get("/", (req:Request, res:Response)=> {
    res.json("Server is up and running");
});`
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
    let envVar;

    const readAndWriteEnv = async () => {
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

    if (DB === "mongodb") {
        envVar = "MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database_name>?retryWrites=true&w=majority"
        await readAndWriteEnv()
    }

    if (DB === "postgresql") {
        envVar = "DATABASE_URL=postgresql://user:password@localhost:5432/mydatabase"
        await readAndWriteEnv()
    }

    if (DB === "mysql") {
        envVar = "DATABASE_URL=mysql://user:password@localhost:3306/mydatabase"
        await readAndWriteEnv()
    }
}

export const dbSetUp = async (projectPath, DB, modelTool, language) => {

    const configureMongoDbCode = async (dbPath, serverPath) => {
        const dbFullPath = path.join(projectPath, dbPath)

        if(language === "typescript"){
            const mongodbCode = mongodbConnectionCode.split(/\r?\n/)
            mongodbCode.splice(4, 1, '        await mongoose.connect(process.env.MONGODB_URI!);')

            const updatedmongodbCode = mongodbCode.join("\n")

            fs.writeFile(dbFullPath, updatedmongodbCode, "utf-8", (err)=>{
                if (err) {
                    spinnerDiscardingStdin.fail(err?.message)
                    spinnerDiscardingStdin.start()
                    return;
                }
            })

        }else{
            fs.writeFile(dbFullPath, mongodbConnectionCode, "utf-8", (err)=>{
                if (err) {
                    spinnerDiscardingStdin.fail(err?.message)
                    spinnerDiscardingStdin.start()
                    return;
                }
            })
        }

        const serverFullPath = path.join(projectPath, serverPath)
        const serverContent = await fs.readFile(serverFullPath, "utf-8");

        const targetLine = [3, 9]
        const insertedData = [`import { connectionDB } from "./common/config/db.js";`,
            `        await connectionDB();`];
        
        const lines = serverContent.split(/\r?\n/);
        lines.splice(targetLine[0] - 1, 0, insertedData[0])
        lines.splice(targetLine[1], 1)
        lines.splice(targetLine[1], 0, insertedData[1])

        const updatedContent = lines.join("\n");

        fs.writeFile(serverFullPath, updatedContent, "utf-8", (err)=>{
            if (err) {
                spinnerDiscardingStdin.fail(err?.message)
                spinnerDiscardingStdin.start()
                return;
            }
        })
    }

    if (language === "javascript") {
        if (DB === "mongodb") {
            await configureMongoDbCode("/src/common/config/db.js", "/src/server.js")
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
import { sql } from "drizzle-orm"`,
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

                await configureDrizzleConfigFile(language, projectPath)
        }
    }

    if (language === "typescript") {
        if (DB === "mongodb") {
            await configureMongoDbCode("/src/common/config/db.ts", "/src/server.ts")
        }

        if (DB === "postgresql" && modelTool === "drizzle") {
            const dbTsPath = path.join(projectPath, "/src/common/config/db.ts")

            fs.writeFile(dbTsPath, drizzlePostgresBoilerPlate, "utf-8", (err)=>{
                if (err) {
                    spinnerDiscardingStdin.fail(err?.message)
                    spinnerDiscardingStdin.start()
                    return;
                }
            })

            const serverTsPath = path.join(projectPath, "/src/server.ts");
            const serverTsData = await fs.readFile(serverTsPath, "utf-8");

            const targetLine = [3, 9]
            const insertedData = [`import { db } from "./common/config/db.js";
import { sql } from "drizzle-orm"`,
                '        await db.execute(sql`select 1`)'];

            const lines = serverTsData.split(/\r?\n/);
            lines.splice(targetLine[0] - 1, 0, insertedData[0])
            lines.splice(targetLine[1], 1)
            lines.splice(targetLine[1], 0, insertedData[1])



            const updatedContent = lines.join("\n");

            fs.writeFile(serverTsPath, updatedContent, "utf-8", (err)=>{
                if (err) {
                    spinnerDiscardingStdin.fail(err?.message)
                    spinnerDiscardingStdin.start()
                    return;
                }
            })

            await configureDrizzleConfigFile(language, projectPath)
        }
    }
}

export const configureDrizzleConfigFile = async (language, projectPath) => {
    if (language === "javascript") {
        const line = drizzleConfigBoilerPlate.split("\n")
        line.splice(8, 1, '     url: process.env.DATABASE_URL,')

        await fs.writeFile(path.join(projectPath, "drizzle.config.js"), line.join("\n"), "utf-8", (err) => {
            if (err) {
                spinnerDiscardingStdin.fail(err?.message)
                spinnerDiscardingStdin.start()
                return;
            }
        })
    }

    if (language === "typescript") {
        await fs.writeFile(path.join(projectPath, "drizzle.config.ts"), drizzleConfigBoilerPlate, "utf-8", (err) => {
            if (err) {
                spinnerDiscardingStdin.fail(err?.message)
                spinnerDiscardingStdin.start()
                return;
            }
        })
    }
}