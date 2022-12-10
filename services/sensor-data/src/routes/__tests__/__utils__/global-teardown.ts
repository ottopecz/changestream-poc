import path from 'path'
import dockerCompose from 'docker-compose'

export default async function globalTeardown (): Promise<void> {
  console.time('global-teardown')

  await dockerCompose.down({
    cwd: path.join(__dirname),
    log: true
  })

  console.time('global-teardown')
}
