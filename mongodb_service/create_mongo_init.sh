#!/bin/bash
set -o allexport
source ../.env
set +o allexport

cat <<EOF > mongo-init.js
db.createUser({
  user: '$MONGODB_ROOT_USERNAME',
  pwd: '$MONGODB_ROOT_PASSWORD',
  roles: [
    {
      role: 'readWrite',
      db: '$MONGO_DATABASE'
    }
  ]
});

db = db.getSiblingDB('$MONGODB_DATABASE');
db.createCollection('$MONGODB_COLLECTION');
EOF
