import ajv from 'ajv'
import * as shareDoc from './shareDoc.json'
import * as contentRectangle from './contentRectangle.json'
import * as nativeAction from './nativeAction.json'

const buildAjv = () => {
  const validator = ajv({
    verbose: true,
    useDefaults: true,
    allErrors: true,
    jsonPointers: true,
  })
  validator.addSchema([shareDoc, contentRectangle, nativeAction])
  validator.addFormat('parametrized-text', /.*/)
  return validator
}

export const validateBeforeCall = (schemaId, spec, v, fn) => {
  if (v.validate(schemaId, spec)) {
    fn()
  } else {
    const schema = v.getSchema(schemaId)
    parseErrors(schema, spec, v.errors)
  }
}

const parseErrors = (schema, spec, errors) => {
  console.error(errors)
}

export const schemaIds = {
  shareDoc: shareDoc.$id,
  contentRectangle: contentRectangle.$id,
  nativeAction: nativeAction.$id,
}

export default buildAjv
