import fs from 'node:fs'
import path from 'node:path'
import { promisify } from 'node:util'
import { Router } from 'express'
import type { Request, Response } from 'express'
import openApiDocument from '../apiSpec'

const readFile = promisify(fs.readFile)
const router = Router()

router.get('/json', (req: Request, res: Response): void => {
  res
    .set('Content-Type', 'application/json')
    .status(200)
    .send(openApiDocument).end()
})

// O express types, express types - wherefore art thou...?
router.get('/html', async (req: Request, res: Response): Promise<void> => { // eslint-disable-line @typescript-eslint/no-misused-promises
  let html
  try {
    html = await readFile(path.resolve(__dirname, '..', 'apiSpec', 'index.html'))
  } catch (error) {
    res
      .status(503)
      .end()
    return
  }

  res
    .set('Content-Type', 'text/html')
    .status(200)
    .send(html)
})

export default router
