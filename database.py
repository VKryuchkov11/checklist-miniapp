import aiosqlite

DB_NAME = "checklist.db"


async def init_db():
    async with aiosqlite.connect(DB_NAME) as db:

        await db.execute("""
        CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            telegram_id INTEGER UNIQUE
        )
        """)

        await db.execute("""
        CREATE TABLE IF NOT EXISTS categories(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            name TEXT
        )
        """)

        await db.execute("""
        CREATE TABLE IF NOT EXISTS tasks(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            category_id INTEGER,
            text TEXT,
            done INTEGER DEFAULT 0,
            reminder_time TEXT
        )
        """)

        await db.commit()