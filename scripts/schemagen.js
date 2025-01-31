#!/usr/bin/env node
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import Ajv from 'ajv'
import standaloneCode from 'ajv/dist/standalone/index.js'

const partition = (k, arr) => {
  let result = []
  for (let i = 0; i < arr.length; i += 2) {
    result[i / 2] = [arr[i], arr[i + 1]]
  }
  return result
}

const loadSchema = async f => {
  const json = JSON.parse(await readFile(f))

  return [json.$id, json]
}

const loadSchemas = async schemas =>
  Promise.all(
    schemas.map(async ([name, f]) => {
      const [id, schema] = await loadSchema(f)

      return [name, id, schema]
    }),
  )

// main code
//

// eslint-disable-next-line no-undef
const output = process.argv[2]
// eslint-disable-next-line no-undef
const schemas = await loadSchemas(partition(2, process.argv.slice(3)))

const ajv = new Ajv({
  schemas: schemas.map(([, , s]) => s),
  code: { source: true, esm: true },
})
// eslint-disable-next-line compat/compat
const generated = standaloneCode(ajv, Object.fromEntries(schemas))

await mkdir(dirname(output), { recursive: true })
await writeFile(output, generated)
