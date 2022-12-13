import supertest from 'supertest'
import server from '../../server'

describe('THE /uptime endpoint', () => {
  describe('WHEN a GET request is made ', () => {
    it('SHOULD respond with 200 ' +
      'AND the length of time the app has been up', async () => {
      const { body } = await supertest(server)
        .get('/uptime')
        .expect(200)

      expect(body).toHaveProperty('uptime', expect.any(Number))
    })
  })
})
