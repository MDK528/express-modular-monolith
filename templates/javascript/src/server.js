import "dotenv/config"
import app from "./app.js"


const PORT = process.env.PORT || 8000

;(async function start () {
    try {
        // execute database connection function here
        app.listen(PORT, ()=>{
            console.log(`Server is running at port ${PORT}`)
        })
    } catch (error) {
        console.error("Failed to start server", error)
        process.exit(1)
    }
})()