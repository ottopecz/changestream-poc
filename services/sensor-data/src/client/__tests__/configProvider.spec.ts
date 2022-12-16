import { configProvider } from '../config'

describe('THE configProvider', () => {
  describe('WHEN nodeEnv is not a string', () => {
    it('SHOULD throw', () => {
      expect(() => configProvider({
        nodeEnv: false,
        logging: { level: 'debug' },
        mongo: {
          hosts: 'localhost',
          database: 'foo',
          collection: 'bar',
          isSRVConnection: 'False',
          username: 'user',
          password: 'userpassword',
          options: '{"foo": "bar"}'
        },
        sensorData: {
          from: '5.1',
          to: '6.1',
          alertUrl: 'http://foo.com/bar'
        }
      })).toThrow(new TypeError('The type of nodeEnv has to be a string'))
    })
  })

  describe('WHEN logging.level is not a string', () => {
    it('SHOULD throw', () => {
      expect(() => configProvider({
        nodeEnv: 'development',
        logging: { level: false },
        mongo: {
          hosts: 'localhost',
          database: 'foo',
          collection: 'bar',
          isSRVConnection: 'False',
          username: 'user',
          password: 'userpassword',
          options: '{"foo": "bar"}'
        },
        sensorData: {
          from: '5.1',
          to: '6.1',
          alertUrl: 'http://foo.com/bar'
        }
      })).toThrow(new TypeError('The type of logging.level has to be a string'))
    })
  })

  describe('WHEN mongo.hosts is not a string', () => {
    it('SHOULD throw', () => {
      expect(() => configProvider({
        nodeEnv: 'development',
        logging: { level: 'debug' },
        mongo: {
          hosts: false,
          database: 'foo',
          collection: 'bar',
          isSRVConnection: 'False',
          username: 'user',
          password: 'userpassword',
          options: '{"foo": "bar"}'
        },
        sensorData: {
          from: '5.1',
          to: '6.1',
          alertUrl: 'http://foo.com/bar'
        }
      })).toThrow(new TypeError('The type of mongo.hosts has to be a string'))
    })
  })

  describe('WHEN mongo.database is not a string', () => {
    it('SHOULD throw', () => {
      expect(() => configProvider({
        nodeEnv: 'development',
        logging: { level: 'debug' },
        mongo: {
          hosts: 'localhost',
          database: false,
          collection: 'bar',
          isSRVConnection: 'False',
          username: 'user',
          password: 'userpassword',
          options: '{"foo": "bar"}'
        },
        sensorData: {
          from: '5.1',
          to: '6.1',
          alertUrl: 'http://foo.com/bar'
        }
      })).toThrow(new TypeError('The type of mongo.database has to be a string'))
    })
  })

  describe('WHEN mongo.collection is not a string', () => {
    it('SHOULD throw', () => {
      expect(() => configProvider({
        nodeEnv: 'development',
        logging: { level: 'debug' },
        mongo: {
          hosts: 'localhost',
          database: 'foo',
          collection: false,
          isSRVConnection: 'False',
          username: 'user',
          password: 'userpassword',
          options: '{"foo": "bar"}'
        },
        sensorData: {
          from: '5.1',
          to: '6.1',
          alertUrl: 'http://foo.com/bar'
        }
      })).toThrow(new TypeError('The type of mongo.collection has to be a string'))
    })
  })

  describe('WHEN mongo.isSRVConnection is not a string', () => {
    it('SHOULD throw', () => {
      expect(() => configProvider({
        nodeEnv: 'development',
        logging: { level: 'debug' },
        mongo: {
          hosts: 'localhost',
          database: 'foo',
          collection: 'bar',
          isSRVConnection: false,
          username: 'user',
          password: 'userpassword',
          options: '{"foo": "bar"}'
        },
        sensorData: {
          from: '5.1',
          to: '6.1',
          alertUrl: 'http://foo.com/bar'
        }
      })).toThrow(new TypeError('The type of mongo.isSRVConnection has to be a string'))
    })
  })

  describe('WHEN mongo.isSRVConnection undefined', () => {
    it('SHOULD return a validated and parsed config', () => {
      expect(configProvider({
        nodeEnv: 'development',
        logging: { level: 'debug' },
        mongo: {
          hosts: 'localhost',
          database: 'foo',
          collection: 'bar',
          username: 'user',
          password: 'userpassword',
          options: '{"foo": "bar"}'
        },
        sensorData: {
          from: '5.1',
          to: '6.1',
          alertUrl: 'http://foo.com/bar'
        }
      })).toStrictEqual({
        logging: {
          level: 'debug'
        },
        mongo: {
          collection: 'bar',
          database: 'foo',
          hosts: 'localhost',
          options: {
            foo: 'bar'
          },
          password: 'userpassword',
          username: 'user'
        },
        nodeEnv: 'development',
        sensorData: {
          from: 5.1,
          to: 6.1,
          alertUrl: 'http://foo.com/bar'
        }
      })
    })
  })

  describe('WHEN mongo.username is not a string', () => {
    it('SHOULD throw', () => {
      expect(() => configProvider({
        nodeEnv: 'development',
        logging: { level: 'debug' },
        mongo: {
          hosts: 'localhost',
          database: 'foo',
          collection: 'bar',
          isSRVConnection: 'True',
          username: false,
          password: 'userpassword',
          options: '{"foo": "bar"}'
        },
        sensorData: {
          from: '5.1',
          to: '6.1',
          alertUrl: 'http://foo.com/bar'
        }
      })).toThrow(new TypeError('The type of mongo.username has to be a string'))
    })
  })

  describe('WHEN mongo.username is undefined', () => {
    it('SHOULD return a validated and parsed config', () => {
      expect(configProvider({
        nodeEnv: 'development',
        logging: { level: 'debug' },
        mongo: {
          hosts: 'localhost',
          database: 'foo',
          collection: 'bar',
          isSRVConnection: 'True',
          password: 'userpassword',
          options: '{"foo": "bar"}'
        },
        sensorData: {
          from: '5.1',
          to: '6.1',
          alertUrl: 'http://foo.com/bar'
        }
      })).toStrictEqual({
        logging: {
          level: 'debug'
        },
        mongo: {
          collection: 'bar',
          database: 'foo',
          hosts: 'localhost',
          isSRVConnection: true,
          options: {
            foo: 'bar'
          },
          password: 'userpassword'
        },
        nodeEnv: 'development',
        sensorData: {
          from: 5.1,
          to: 6.1,
          alertUrl: 'http://foo.com/bar'
        }
      })
    })
  })

  describe('WHEN mongo.password is not a string', () => {
    it('SHOULD throw', () => {
      expect(() => configProvider({
        nodeEnv: 'development',
        logging: { level: 'debug' },
        mongo: {
          hosts: 'localhost',
          database: 'foo',
          collection: 'bar',
          isSRVConnection: 'True',
          username: 'user',
          password: false,
          options: '{"foo": "bar"}'
        },
        sensorData: {
          from: '5.1',
          to: '6.1',
          alertUrl: 'http://foo.com/bar'
        }
      })).toThrow(new TypeError('The type of mongo.password has to be a string'))
    })
  })

  describe('WHEN mongo.password is undefined', () => {
    it('SHOULD return a validated and parsed config', () => {
      expect(configProvider({
        nodeEnv: 'development',
        logging: { level: 'debug' },
        mongo: {
          hosts: 'localhost',
          database: 'foo',
          collection: 'bar',
          isSRVConnection: 'True',
          username: 'user',
          options: '{"foo": "bar"}'
        },
        sensorData: {
          from: '5.1',
          to: '6.1',
          alertUrl: 'http://foo.com/bar'
        }
      })).toStrictEqual({
        logging: {
          level: 'debug'
        },
        mongo: {
          collection: 'bar',
          database: 'foo',
          hosts: 'localhost',
          isSRVConnection: true,
          options: {
            foo: 'bar'
          },
          username: 'user'
        },
        nodeEnv: 'development',
        sensorData: {
          from: 5.1,
          to: 6.1,
          alertUrl: 'http://foo.com/bar'
        }
      })
    })
  })

  describe('WHEN sensorData.from is not a string', () => {
    it('SHOULD throw', () => {
      expect(() => configProvider({
        nodeEnv: 'development',
        logging: { level: 'debug' },
        mongo: {
          hosts: 'localhost',
          database: 'foo',
          collection: 'bar',
          isSRVConnection: 'True',
          username: 'user',
          password: 'userpassword',
          options: '{"foo": "bar"}'
        },
        sensorData: {
          from: false,
          to: '6.1',
          alertUrl: 'http://foo.com/bar'
        }
      })).toThrow(new TypeError('The type of sensorData.from has to be a string'))
    })
  })

  describe('WHEN sensorData.to is not a string', () => {
    it('SHOULD throw', () => {
      expect(() => configProvider({
        nodeEnv: 'development',
        logging: { level: 'debug' },
        mongo: {
          hosts: 'localhost',
          database: 'foo',
          collection: 'bar',
          isSRVConnection: 'True',
          username: 'user',
          password: 'userpassword',
          options: '{"foo": "bar"}'
        },
        sensorData: {
          from: '5.1',
          to: false,
          alertUrl: 'http://foo.com/bar'
        }
      })).toThrow(new TypeError('The type of sensorData.to has to be a string'))
    })
  })

  describe('WHEN sensorData.alertUrl is not a string', () => {
    it('SHOULD throw', () => {
      expect(() => configProvider({
        nodeEnv: 'development',
        logging: { level: 'debug' },
        mongo: {
          hosts: 'localhost',
          database: 'foo',
          collection: 'bar',
          isSRVConnection: 'True',
          username: 'user',
          password: 'userpassword',
          options: '{"foo": "bar"}'
        },
        sensorData: {
          from: '5.1',
          to: '6.1',
          alertUrl: false
        }
      })).toThrow(new TypeError('The type of sensorData.alertUrl has to be a string'))
    })
  })

  describe('WHEN all the parameter is specified right', () => {
    it('SHOULD return the validated and parsed config', () => {
      expect(configProvider({
        nodeEnv: 'development',
        logging: { level: 'debug' },
        mongo: {
          hosts: 'localhost',
          database: 'foo',
          collection: 'bar',
          isSRVConnection: 'True',
          username: 'user',
          password: 'userpassword',
          options: '{"foo": "bar"}'
        },
        sensorData: {
          from: '5.1',
          to: '6.1',
          alertUrl: 'http://foo.com/bar'
        }
      })).toStrictEqual({
        logging: {
          level: 'debug'
        },
        mongo: {
          collection: 'bar',
          database: 'foo',
          hosts: 'localhost',
          isSRVConnection: true,
          options: {
            foo: 'bar'
          },
          password: 'userpassword',
          username: 'user'
        },
        nodeEnv: 'development',
        sensorData: {
          from: 5.1,
          to: 6.1,
          alertUrl: 'http://foo.com/bar'
        }
      })
    })
  })
})
