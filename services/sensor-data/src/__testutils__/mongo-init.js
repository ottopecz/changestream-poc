db.createUser( // eslint-disable-line no-undef
  {
    user: 'user',
    pwd: 'userpassword',
    roles: [
      {
        role: 'readWrite',
        db: 'changestream-poc_test-db'
      }
    ]
  }
)
db['sensor-data'].createIndex( // eslint-disable-line no-undef
  { sensorId: 1, time: 1 },
  { unique: true }
)
