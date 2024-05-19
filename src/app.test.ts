import { __test, app } from "./app"
import * as SeedDb from "./seedDb"
import { sql } from "./db"
import request from "supertest"

beforeAll(async () => {
    await SeedDb.run()
})

describe("Duties API", () => {
    afterAll(async () => {
        await sql`truncate duties restart identity`
        await SeedDb.run()
    })
    test("GET /duties", async () => {
        const res = await request(app).get("/duties")
        expect(res.status).toEqual(200)
    })

    test("POST /duties with correct data", async () => {
        const res = await request(app).post("/duties").send({ name: "api test" })
        expect(res.status).toEqual(200)
    })

    test("POST /duties without data", async () => {
        const res = await request(app).post("/duties").send()
        expect(res.status).toEqual(400)
    })

    test("PATCH /duties/:id when id exist", async () => {
        const res = await request(app).patch("/duties/1")
        expect(res.status).toEqual(200)
    })

    test("PATCH /duties/:id when id does not exist", async () => {
        const res = await request(app).patch("/duties/10")
        expect(res.status).toEqual(404)
    })

    test("DELETE /duties/:id when id exist", async () => {
        const res = await request(app).delete("/duties/2")
        expect(res.status).toEqual(200)
    })

    test("DELETE /duties/:id when id does not exist", async () => {
        const res = await request(app).delete("/duties/10")
        expect(res.status).toEqual(404)
    })
})

describe("Duties queries", () => {
    test("getAllDuties", async () => {
        const duties = await __test.getDutiesByPage(1)
        expect(duties.length).toEqual(Math.min(SeedDb.duties.length, __test.itemsPerPage))
    })

    test("createDuty", async () => {
        const duty = { name: "test" }
        await __test.createDuty(duty)
        const result = await sql`select * from duties where name = ${duty.name}`
        expect(result.length).toBeGreaterThan(0)
    })

    test("completeDutyById", async () => {
        await __test.completeDutyById("1")
        const result = await sql`select is_completed from duties where id = 1`
        expect(result[0].isCompleted).toBeTruthy()
    })

    test("deleteDutyById", async () => {
        await __test.deleteDutyById("1")
        const result = await sql`select * from duties where id = 1`
        expect(result.length).toEqual(0)
    })
})
