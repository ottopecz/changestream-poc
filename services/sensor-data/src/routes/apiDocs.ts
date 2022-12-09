import fs from 'node:fs'
import path from 'node:path'
import { promisify } from 'node:util'
import { Router } from 'express'
import openApiDocument from '../apiSpec'

const readFile = promisify(fs.readFile)
const router = Router()

router.get('/json', async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.status(200).send(openApiDocument)
})

router.get('/html', async (req, res) => {
  let html
  try {
    html = await readFile(path.resolve(__dirname, '..', 'apiSpec', 'index.html'))
  } catch (error) {
    res.status(503).send()
    return
  }
  res.setHeader('Content-Type', 'text/html')
  res.status(200).send(html)
})

export default router
