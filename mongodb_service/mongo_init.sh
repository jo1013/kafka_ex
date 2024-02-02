#!/bin/bash
cat <<EOF > /docker-entrypoint-initdb.d/mongo_init.js
db.createUser({
    user: '$MONGODB_ROOT_USERNAME',
    pwd: '$MONGODB_ROOT_PASSWORD',
    roles: [{
        role: 'readWrite',
        db: '$MONGODB_DATABASE'
    }]
});
db.createCollection('$MONGODB_COLLECTION');
EOF
