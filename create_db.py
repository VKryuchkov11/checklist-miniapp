from tasksdb import engine, Base

Base.metadata.create_all(bind=engine)

print("База данных создана")