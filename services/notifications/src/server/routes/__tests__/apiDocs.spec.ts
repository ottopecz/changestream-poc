import supertest from 'supertest'
import { server } from '../../index'

describe('THE /api-docs endpoints', () => {
  describe('THE /api-docs/json endpoint', () => {
    describe('WHEN a GET request is made', () => {
      it('SHOULD respond with 200 ' +
        'AND a JSON document describing the API using the OpenAPI specification', async () => {
        const { body } = await supertest(server)
          .get('/api-docs/json')
          .expect(200)

        expect(body).toHaveProperty('openapi')
      })
    })
  })

  describe('THE /api-docs/html endpoint', () => {
    describe('WHEN a GET request is made', () => {
      describe('AND the request is successful ', () => {
        it('SHOULD respond with 200 ' +
          'AND an HTML document', async () => {
          const { text } = await supertest(server)
            .get('/api-docs/html')
            .expect(200)

          expect(text).toEqual(expect.stringContaining('<!DOCTYPE html>'))
        })
      })
    })
  })
})
