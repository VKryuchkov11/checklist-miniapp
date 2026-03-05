from fastapi import FastAPI
import aiosqlite

DB_NAME = "checklist.db"

app = FastAPI()


@app.get("/")
async def root():
    return {"status": "server working"}


@app.post("/auth")
async def auth(data: dict):

    telegram_id = data["id"]
    name = data["first_name"]

    async with aiosqlite.connect(DB_NAME) as db:

        cursor = await db.execute(
            "SELECT id FROM users WHERE telegram_id=?",
            (telegram_id,)
        )

        user = await cursor.fetchone()

        if not user:
            await db.execute(
                "INSERT INTO users (telegram_id, name) VALUES (?, ?)",
                (telegram_id, name)
            )

            await db.commit()

    return {"status": "ok"}