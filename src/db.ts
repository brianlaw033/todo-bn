import postgres from "postgres"

export const connectionParams = {
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    connect_timeout: 60,
}

export const sql = postgres({ ...connectionParams, transform: postgres.camel })
