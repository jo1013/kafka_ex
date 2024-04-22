# from fastapi import FastAPI, HTTPException
# from fastapi.encoders import jsonable_encoder
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel, Field, HttpUrl, EmailStr
# from typing import List, Optional
# from datetime import datetime
# from pymongo import MongoClient, DESCENDING
# from pymongo.errors import ServerSelectionTimeoutError
# from bson import ObjectId, errors
# import os
# import bcrypt
# import secrets
# import string
# from database import db

# # from fastapi import FastAPI
# # from users import router as user_router

# # app = FastAPI()

# # app.include_router(user_router, prefix="/user", tags=["users"])


# # Database connection
# MONGODB_URI = os.getenv('MONGODB_URI')
# MONGODB_DATABASE = os.getenv('MONGODB_DATABASE')
# MONGODB_COLLECTION = os.getenv('MONGODB_COLLECTION')

# MONGODB_USER_URI = os.getenv('MONGODB_USER_URI')
# MONGODB_USER_DATABASE = os.getenv('MONGODB_USER_DATABASE')
# MONGODB_USER_INFO_COLLECTION = os.getenv('MONGODB_USER_INFO_COLLECTION')


# client = MongoClient(MONGODB_URI)
# db = client[MONGODB_DATABASE]
# collection = db[MONGODB_COLLECTION]


# user_client = MongoClient(MONGODB_USER_URI)
# user_db = client[MONGODB_USER_DATABASE]
# user_collection = db[MONGODB_USER_INFO_COLLECTION]

# app = FastAPI()




# # app.include_router(user_router)
# # app.include_router(news_router)
# # app.include_router(subscription_router)



# class User(BaseModel):
#     email: EmailStr
#     password: str
#     user_id: Optional[str] = None
#     created_at: datetime
#     updated_at: datetime
#     subscriptions: List[str]

# # 회원가입 모델
# class UserSignUp(BaseModel):
#     email: EmailStr
#     password: str
#     created_at: datetime = Field(default_factory=datetime.utcnow)
#     updated_at: datetime = Field(default_factory=datetime.utcnow)
#     # 구독 정보를 저장하는 필드, 예를 들어 구독한 태그 목록
#     subscriptions: List[str] = []

    
# # 비밀번호 찾기 모델
# class UserPasswordReset(BaseModel):
#     email: str


# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # This allows all origins for testing purposes. Adjust in production.
#     allow_credentials=True,
#     allow_methods=["*"],  # This allows all methods.
#     allow_headers=["*"],  # This allows all headers.
# )


# client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
# db = client[MONGODB_DATABASE]
# collection = db.get_collection(MONGODB_COLLECTION)



# # 사용자 정보를 위한 기본 모델
# class User(BaseModel):
#     email: str
#     password: str
#     user_id: Optional[str] = None


# # Pydantic 모델에서 ObjectId를 처리하기 위한 클래스
# class PyObjectId(ObjectId):
#     @classmethod
#     def __get_validators__(cls):
#         yield cls.validate

#     @classmethod
#     def validate(cls, value, values, **kwargs):
#         if not ObjectId.is_valid(value):
#             raise ValueError(f"Not a valid ObjectId: {value}")
#         return ObjectId(value)

# class UserActivity(BaseModel):
#     user_id: PyObjectId = Field(alias="user_id")
#     news_id: PyObjectId = Field(alias="news_id")
#     activity_type: str  # 예를 들어 'click'
#     timestamp: datetime = Field(default_factory=datetime.utcnow)




# # MongoDB 문서를 나타내는 Pydantic 모델
# class NewsData(BaseModel):
#     id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
#     author: Optional[str] = None
#     title: str
#     description: Optional[str] = None
#     url: HttpUrl
#     source: str
#     image: Optional[HttpUrl] = None
#     category: Optional[str] = None  # 선택적으로 변경
#     language: Optional[str] = None  # 선택적으로 변경
#     country: Optional[str] = None  # 선택적으로 변경
#     published_at: Optional[datetime] = None  # 선택적으로 변경

 
#     class Config:
#         orm_mode = True
#         json_encoders = {ObjectId: str}

# # 새로운 응답 모델 정의
# class NewsResponse(BaseModel):
#     newsList: List[NewsData]
#     totalItems: int



# @app.get("/news", response_model=NewsResponse)
# async def get_news(page: int = 1, page_size: int = 10):
#     skip = (page - 1) * page_size
#     # .sort([("_id", DESCENDING)])를 추가하여 최신 뉴스부터 정렬
#     news_cursor = collection.find().sort([("published_at", DESCENDING)]).skip(skip).limit(page_size)
#     news_list = [NewsData(**jsonable_encoder(news, custom_encoder={ObjectId: str})) for news in news_cursor]
#     total_items = collection.count_documents({})
#     return NewsResponse(newsList=news_list, totalItems=total_items)


# @app.post("/news/click")
# async def record_news_click(activity: UserActivity):
#     # Pydantic 모델에서 MongoDB 형식으로 변환
#     activity_dict = jsonable_encoder(activity)
    
#     # user_act_history 컬렉션에 문서 추가
#     user_db.user_act_history.insert_one(activity_dict)
    
#     return {"message": "Activity recorded successfully"}



# @app.get("/news/details/{news_id}", response_model=NewsData)
# async def get_news_details(news_id: str):
#     try:
#         news_item = collection.find_one({"_id": ObjectId(news_id)})
#         if not news_item:
#             raise HTTPException(status_code=404, detail="News not found")
#         return news_item
#     except errors.InvalidId:
#         raise HTTPException(status_code=400, detail="Invalid news ID format")


# @app.get("/healthcheck")
# def mongodb_healthcheck():
#     try:
#         client.admin.command('ping')
#         return {"status": "MongoDB connection is successful"}
#     except ServerSelectionTimeoutError:
#         raise HTTPException(status_code=503, detail="MongoDB connection failed")



# @app.post("/user/update", response_model=User)
# async def update_user(user_id: str, updates: Dict[str, Any]):
#     # 사용자 정보 업데이트
#     updates['updated_at'] = datetime.utcnow()
#     if 'password' in updates:
#         hashed_password = bcrypt.hashpw(updates['password'].encode('utf-8'), bcrypt.gensalt())
#         updates['password'] = hashed_password
#     user_collection.update_one({"_id": ObjectId(user_id)}, {"$set": updates})
#     updated_user = user_collection.find_one({"_id": ObjectId(user_id)})
#     return jsonable_encoder(updated_user)

# @app.post("/user/signup", response_model=User)
# async def signup(user_data: UserSignUp):
#     user_data_dict = user_data.dict()
#     # 비밀번호 해싱
#     hashed_password = bcrypt.hashpw(user_data_dict['password'].encode('utf-8'), bcrypt.gensalt())
#     user_data_dict['password'] = hashed_password

#     # MongoDB에 저장
#     user_data_dict['created_at'] = user_data_dict['updated_at'] = datetime.utcnow()
#     result = user_collection.insert_one(user_data_dict)
#     user_data_dict['user_id'] = str(result.inserted_id)
#     return user_data_dict

# @app.post("/user/subscribe")
# async def subscribe_to_tag(user_id: str, tag: str):
#     # 사용자의 구독 목록에 태그 추가
#     result = user_collection.update_one(
#         {"_id": ObjectId(user_id)},
#         {"$addToSet": {"subscriptions": tag}, "$set": {"updated_at": datetime.utcnow()}}
#     )
#     if result.modified_count:
#         return {"message": "Subscribed successfully"}
#     return {"message": "Subscription failed"}


# @app.post("/user/login")
# async def login(user: User):
#     db_user = user_collection.find_one({"email": user.email})
#     if not db_user:
#         raise HTTPException(status_code=404, detail="User not found")

#     # 비밀번호 검증
#     if bcrypt.checkpw(user.password.encode('utf-8'), db_user['password']):
#         return {"message": "Login successful", "user_id": str(db_user["_id"])}
#     else:
#         raise HTTPException(status_code=401, detail="Incorrect password")

# @app.post("/user/find-password")
# async def find_password(user: UserPasswordReset):
#     db_user = user_collection.find_one({"email": user.email})
#     if not db_user:
#         raise HTTPException(status_code=404, detail="User not found")
    
#     # 랜덤 비밀번호 생성
#     alphabet = string.ascii_letters + string.digits
#     new_password = ''.join(secrets.choice(alphabet) for i in range(10))  # 10자리 랜덤 비밀번호
    
#     # 비밀번호 해싱
#     hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
    
#     # 비밀번호 데이터베이스에 업데이트
#     user_collection.update_one({"_id": db_user["_id"]}, {"$set": {"password": hashed_password}})
    
#     # 실제 애플리케이션에서는 사용자에게 새 비밀번호를 안전한 방법(예: 이메일)으로 전달해야 합니다.
#     # 여기서는 예시로 새 비밀번호를 직접 반환하고 있지만, 이는 보안상 권장되지 않습니다.
#     return {"message": "Password has been reset successfully", "new_password": new_password}


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 라우터 임포트
from users.routes import router as user_router
from news.routes import router as news_router
from subscriptions.routes import router as subscription_router

app = FastAPI()

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 배포에서는 출처를 제한하세요.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 각 모듈의 라우터 추가
app.include_router(user_router, prefix="/users", tags=["Users"])
app.include_router(news_router, prefix="/news", tags=["News"])
app.include_router(subscription_router, prefix="/subscriptions", tags=["Subscriptions"])

# 헬스 체크 엔드포인트
@app.get("/healthcheck")
def healthcheck():
    return {"status": "OK"}
