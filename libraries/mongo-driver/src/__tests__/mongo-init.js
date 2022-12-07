// eslint-disable-next-line
db.createUser(
  {
    user: 'user',
    pwd: 'userpassword',
    roles: [
      {
        role: 'readWrite',
        db: 'converge-exercise-test'
      }
    ]
  }
)
