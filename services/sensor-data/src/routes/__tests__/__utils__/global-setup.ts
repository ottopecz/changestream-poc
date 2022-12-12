import path from 'path'
import dockerCompose from 'docker-compose'

export default async function globalSetup (): Promise<void> {
  console.time('global setup')

  await dockerCompose.upAll({
    cwd: path.join(__dirname),
    log: true
  })

  console.timeEnd('global setup')
};
