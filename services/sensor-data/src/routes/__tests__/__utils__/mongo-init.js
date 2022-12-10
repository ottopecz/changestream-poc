db.createUser( // eslint-disable-line no-undef
  {
    user: 'user',
    pwd: 'userpassword',
    roles: [
      {
        role: 'readWrite',
        db: 'converge-exercise_test-db'
      }
    ]
  }
)
