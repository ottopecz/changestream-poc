// eslint-disable-next-line
db.createUser(
  {
    user: 'user',
    pwd: 'userpassword',
    roles: [
      {
        role: 'readWrite',
        db: 'changestream-poc_mongo-test-db'
      }
    ]
  }
)
