use user_db

db.users.insert({


})

db.publishers.insert({
  "publisher_name": "Example News",
  "description": "Detailed description of the publisher."
})


db.tags.insert({
  "tag_name": "Technology"
})


db.subscriptions.insert({
  "user_id": ObjectId("507f1f77bcf86cd799439011"), // 예시 ID
  "target_id": ObjectId("507f1f77bcf86cd799439012"), // 예시 ID
  "type": "publisher" // 또는 "tag"
})

