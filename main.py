from fastapi import FastAPI
from database import SessionLocal
from models import User

app = FastAPI()

@app.get("/")
async def root():
    return {"status": "server working"}


@app.post("/auth")
async def auth(data: dict):

    telegram_id = data["id"]
    name = data["first_name"]

    db = SessionLocal()

    try:

        user = db.query(User).filter(User.telegram_id == telegram_id).first()

        if not user:
            user = User(
                telegram_id=telegram_id,
                name=name
            )

            db.add(user)
            db.commit()

        return {"status": "ok"}

    finally:
        db.close()