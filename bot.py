import asyncio
from aiogram import Bot, Dispatcher
from aiogram.types import Message, ReplyKeyboardMarkup, KeyboardButton, WebAppInfo
from aiogram.filters import Command
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode

BOT_TOKEN = "8699617462:AAFjbNF7w2p7jFhDbaVF9IAS8gwrNpqRUjU"

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
                    web_app=WebAppInfo(url="https://vkryuchkov11.github.io/checklist-miniapp/")
                )
            ]
        ],
        resize_keyboard=True
    )

    await message.answer(
        "✨ <b>Мини-приложение Чек-лист</b>\n\n"
        "Нажми кнопку ниже 👇",
        reply_markup=keyboard
    )


async def main():
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())