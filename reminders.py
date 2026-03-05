import asyncio
import aiosqlite
from datetime import datetime
from database import DB_NAME


async def reminder_loop(bot):

    while True:

        async with aiosqlite.connect(DB_NAME) as db:

            async with db.execute("""
            SELECT user_id, text
            FROM tasks
            WHERE reminder_time <= ?
            AND done = 0
            """, (datetime.now().isoformat(),)) as cursor:

                rows = await cursor.fetchall()

                for user_id, text in rows:
                    try:
                        await bot.send_message(
                            user_id,
                            f"⏰ Напоминание:\n{text}"
                        )
                    except:
                        pass

        await asyncio.sleep(60)