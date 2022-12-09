import path from 'node:path'
import YAML from 'yamljs'

const openApiDef = path.join(__dirname, './openapi.yaml')
export default YAML.load(openApiDef)
