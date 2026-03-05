from tasksdb import engine, Base
from models import User, Task, Category

Base.metadata.create_all(bind=engine)

print("База данных создана")