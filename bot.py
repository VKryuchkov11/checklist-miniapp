import asyncio
import os
from dotenv import load_dotenv

from aiogram import Bot, Dispatcher
from aiogram.types import Message, ReplyKeyboardMarkup, KeyboardButton, WebAppInfo
from aiogram.filters import Command
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode

from database import init_db
from reminders import reminder_loop

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")

bot = Bot(
    token=BOT_TOKEN,
    default=DefaultBotProperties(parse_mode=ParseMode.HTML)
)

dp = Dispatcher()


@dp.message(Command("start"))
async def start(message: Message):

    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [
                KeyboardButton(
                    text="🚀 Открыть чек-лист",
                    web_app=WebAppInfo(
                        url="https://vkryuchkov11.github.io/checklist-miniapp/"
                    )
                )
            ]
        ],
        resize_keyboard=True
    )

    await message.answer(
        "✨ <b>Checklist Mini App</b>\n\n"
        "Нажми кнопку ниже 👇",
        reply_markup=keyboard
    )


async def main():

    await init_db()

    asyncio.create_task(reminder_loop(bot))

    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())