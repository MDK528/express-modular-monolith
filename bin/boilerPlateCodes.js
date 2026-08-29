export const mongodbConBoilerplateCode = `import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "todo";

export const connectionDB = async () => {
    try{
        await mongoose.connect("MONGODB_URI/DB_NAME")
    }catch (error) { 
        console.error("MongoDB connection failed", error) 
        process.exit(1)
    }
}`
