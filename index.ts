import { basename } from 'path'
import { readFile, writeFile } from 'fs/promises'
import { pipe, map, take, each, toArray, concurrent, toAsync } from '@fxts/core'
import { transform } from '@svgr/core'

import SVG_FILE_PATH_LIST from './SVG_FILE_PATH_LIST.json'

async function run() {
  // TODO: Extract as ENV Variable
  const WORKING_DIR = '/Users/mk-mac-135/kurly/kurlymall-nx'
  await pipe(
    SVG_FILE_PATH_LIST,
    map(path => `${WORKING_DIR}${path}`),
    toAsync,
    each( async path => {
      const baseName = basename(path)
      const componentName = baseName
        .replace(new RegExp('-', 'g'), '_')
        .replace('.svg', '')
      const buffer = await readFile(path, { encoding: 'utf-8' })
      const jsCode = await transform(
        buffer.toString(),
        { jsxRuntime: 'automatic', icon: false, typescript: true },
        { componentName }
      )
      await writeFile(`./result/${baseName.replace('svg', 'tsx')}`, jsCode, {
        encoding: 'utf-8'
      })
    }),
  )
}

run();
