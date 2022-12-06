import path from 'path';
import dockerCompose from 'docker-compose';

export default async function globalSetup() {
  console.time('global-setup');

  await dockerCompose.upAll({
    cwd: path.join(__dirname),
    log: true
  });

  console.timeEnd('global-setup');
};
