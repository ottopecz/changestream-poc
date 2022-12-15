db.createUser( // eslint-disable-line no-undef
  {
    user: 'user',
    pwd: 'userpassword',
    roles: [
      {
        role: 'readWrite',
        db: 'ce-notification-test-db'
      }
    ]
  }
)
