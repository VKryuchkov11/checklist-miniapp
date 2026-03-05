from fastapi import FastAPI
from database import SessionLocal
from models import Task

app = FastAPI()

@app.get("/tasks/{user_id}")
def get_tasks(user_id: int):

    db = SessionLocal()

    tasks = db.query(Task).filter(Task.user_id == user_id).all()

    result = []

    for task in tasks:
        result.append({
            "id": task.id,
            "text": task.text,
            "done": task.done,
            "category": task.category
        })

    return result


@app.post("/tasks")
def add_task(task: dict):

    db = SessionLocal()

    new_task = Task(
        user_id=task["user_id"],
        text=task["text"],
        done=False,
        category=task["category"]
    )

    db.add(new_task)
    db.commit()

    return {"status": "ok"}


@app.post("/toggle/{task_id}")
def toggle_task(task_id: int):

    db = SessionLocal()

    task = db.query(Task).filter(Task.id == task_id).first()

    task.done = not task.done

    db.commit()

    return {"status": "ok"}


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):

    db = SessionLocal()

    task = db.query(Task).filter(Task.id == task_id).first()

    db.delete(task)
    db.commit()

    return {"status": "deleted"}