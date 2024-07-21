use news_data

 db.createUser({
...   user: "",
...   pwd: "",
...   roles: [
...     { role: "readWrite", db: "news_data" }
...   ]
... })