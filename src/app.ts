import express from "express"
import cors from "cors"
import { sql } from "./db"

export const app = express()

app.use(express.json())
app.use(cors())

const isDutyExist = async (id: string) => {
    const result = await sql`select * from duties where id = ${id}`
    return result.length > 0
}
const itemsPerPage = 10
const getDutiesByPage = (page: number) => sql`select * from duties limit ${itemsPerPage} offset ${(page - 1) * itemsPerPage}`
const createDuty = (duty: { name: string }) => sql`insert into duties ${sql(duty, "name")}`
const completeDutyById = (id: string) => sql`update duties set is_completed = true where id = ${id}`
const deleteDutyById = (id: string) => sql`delete from duties where id = ${id}`
const getDutiesCount = () => sql`select count(*) as count from duties`

app.get("/duties", async (req, res) => {
    try {
        const page = Number(req.query.page) ?? 1
        const result = await getDutiesByPage(page)
        const total = await getDutiesCount()
        res.set({
            "Access-Control-Expose-Headers": "Content-Range",
            "Content-Range": `duties ${(page - 1) * itemsPerPage}-${Math.min(page * itemsPerPage, result.length)}/${total[0].count}`,
        }).json(result)
    } catch (err) {
        console.error(err)
        res.status(500).json(err)
    }
})

app.post("/duties", async (req, res) => {
    if (req.body?.name) {
        try {
            const result = await createDuty(req.body)
            res.json(result)
        } catch (err) {
            console.error(err)

            res.status(500).json(err)
        }
    } else {
        res.status(400).json({ message: "Name is required" })
    }
})

app.patch("/duties/:id", async (req, res) => {
    if (await isDutyExist(req.params.id)) {
        try {
            const result = await completeDutyById(req.params.id)
            res.json(result)
        } catch (err) {
            console.error(err)
            res.status(500).json(err)
        }
    } else {
        res.status(404).json({ message: "Duty not found" })
    }
})

app.delete("/duties/:id", async (req, res) => {
    if (await isDutyExist(req.params.id)) {
        try {
            const result = await deleteDutyById(req.params.id)
            res.json(result)
        } catch (err) {
            console.error(err)
            res.status(500).json(err)
        }
    } else {
        res.status(404).json({ message: "Duty not found" })
    }
})
export const __test = {
    isDutyExist,
    getDutiesByPage,
    createDuty,
    completeDutyById,
    deleteDutyById,
    itemsPerPage,
}
