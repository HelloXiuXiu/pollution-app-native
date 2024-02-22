//
// This is an example build script for Socket Runtime
// When you run 'ssc build', this script (node build.js) will be run
//
import path from 'node:path'
import fs from 'node:fs/promises' // import fs from 'node:fs'

import esbuild from 'esbuild'

const cp = async (a, b) => fs.cp( //const cp = async (a, b) => fs.promises.cp(
  path.resolve(a),
  path.join(b, path.basename(a)),
  { recursive: true, force: true }
)

async function copy (target) {
  //
  // Copy the rest of the files that we care about.
  //
  await cp('src/index.html', target)
  await cp('src/icon.png', target)
}

async function main () {
  const prod = process.argv.find(s => s.includes('--prod'))

  const params = {
    entryPoints: ['src/index.jsx'],
    format: 'esm',
    bundle: true,
    minify: false, // minify: !!prod, 
    sourcemap: true, // sourcemap: !prod, 
    external: ['socket:*', 'node:*'], // external: ['socket:*']
    keepNames: true, // - 
    loader: { '.jpg': 'file' } // - 
  }

  const watch = process.argv.find(s => s.includes('--watch='))

  //
  // The second argument to this program will be the target-OS specifc
  // directory for where to copy your build artifacts
  //
  const target = path.resolve(process.env.PREFIX)

  //
  // If the watch command is specified, let esbuild start its server
  //
  if (watch) {
    esbuild.serve({ servedir: path.resolve(watch.split('=')[1]) }, params)
  }

  //
  //
  //

  if (!watch) {
    const opts = {
      ...params,
      outdir: target,
      minifyWhitespace: false,
      minifyIdentifiers: true,
      minifySyntax: true
    }
    await esbuild.build(opts)
  }

  // if (process.argv.find(s => s.includes('--test'))) {
  //   await esbuild.build({
  //     ...params,
  //     entryPoints: ['test/index.js'],
  //     outdir: path.join(target, 'test')
  //   })
  // }

  //
  // Not writing a package json to your project could be a security risk
  //
  // await fs.promises.writeFile(path.join(target, 'package.json'), '{ "type": "module", "private": true }')

  if (!target) {
    console.log('Did not receive the build target path as an argument!')
    process.exit(1)
  }

//   //
//   // Copy some files into the new project
//   //
//   await Promise.all([
//     cp('src/index.html', target),
//     cp('src/index.css', target),
//     cp('src/icon.png', target)
//   ])
// }
  await copy(target)
}

main(process.argv.slice(2)) // main()
