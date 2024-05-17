import { sql } from "./db"

export const duties = [{ name: "A" }, { name: "B" }, { name: "C" }, { name: "D" }, { name: "E" }, { name: "F" }]

export const run = async () => {
    console.log(`Populating DB ${process.env.PGDATABASE} with seed data...`)

    await sql`insert into duties ${sql(duties, "name")}`

    console.log("Populated DB with seed data")
}

if (process.env.NODE_ENV != "test") {
    run().then(() => {
        process.exit(0)
    })
}
