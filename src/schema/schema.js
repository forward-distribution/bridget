import ajv from 'ajv'
import betterAjvErrors from '@sidvind/better-ajv-errors'
import * as shareArticle from './shareArticle.json'

const buildAjv = () => {
  const validator = ajv({ verbose: true, useDefaults: true, allErrors: true, jsonPointers: true })
  validator.addSchema([shareArticle])
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
  const output = betterAjvErrors(schema, spec, errors)
  console.error(output)
}

export const schemaIds = {
  shareArticle: shareArticle.$id
}

export default buildAjv
