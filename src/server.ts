import { app } from "./app"

app.listen(4000, () => {
    console.log("Server running at PORT: ", 4000)
}).on("error", (error) => {
    throw new Error(error.message)
})
