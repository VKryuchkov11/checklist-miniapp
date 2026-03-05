import asyncio
import aiosqlite
from aiogram import Bot

DB_NAME = "checklist.db"


async def reminder_loop(bot: Bot):

    while True:

        async with aiosqlite.connect(DB_NAME) as db:

            async with db.execute("""
            SELECT user_id, text
            FROM tasks
            WHERE reminder_time <= datetime('now')
            AND done = 0
            """) as cursor:

                rows = await cursor.fetchall()

                for user_id, text in rows:
                    await bot.send_message(
                        user_id,
                        f"⏰ Напоминание:\n{text}"
                    )

        await asyncio.sleep(60)