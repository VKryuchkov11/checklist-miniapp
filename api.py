from fastapi import FastAPI
from backend.database import SessionLocal
from backend.models import User, Task

app = FastAPI()


@app.post("/auth")
async def auth(data: dict):

    telegram_id = data["id"]
    name = data["first_name"]

    db = SessionLocal()

    user = db.query(User).filter(User.telegram_id == telegram_id).first()

    if not user:
        user = User(
            telegram_id=telegram_id,
            name=name
        )

        db.add(user)
        db.commit()

    return {"status": "ok"}


@app.get("/tasks/{telegram_id}")
async def get_tasks(telegram_id: int):

    db = SessionLocal()

    user = db.query(User).filter(User.telegram_id == telegram_id).first()

    if not user:
        return []

    tasks = db.query(Task).filter(Task.user_id == user.id).all()

    result = []

    for task in tasks:
        result.append({
            "id": task.id,
            "text": task.text,
            "done": task.done,
            "category_id": task.category_id
        })

    return result


@app.post("/tasks")
async def add_task(data: dict):

    telegram_id = data["telegram_id"]
    text = data["text"]

    db = SessionLocal()

    user = db.query(User).filter(User.telegram_id == telegram_id).first()

    task = Task(
        user_id=user.id,
        text=text,
        done=False
    )

    db.add(task)
    db.commit()

    return {"status": "ok"}