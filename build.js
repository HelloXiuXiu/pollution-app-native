//
// This is an example build script for Socket Runtime
// When you run 'ssc build', this script (node build.js) will be run
//
import path from 'node:path'
import fs from 'node:fs/promises'

import esbuild from 'esbuild'

const cp = async (a, b) => fs.cp(
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
    minify: false,
    sourcemap: true,
    external: ['socket:*', 'node:*'],
    keepNames: true,
    loader: { '.jpg': 'file' }
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

  //
  // Not writing a package json to your project could be a security risk
  //
  if (!target) {
    console.log('Did not receive the build target path as an argument!')
    process.exit(1)
  }

  await copy(target)
}

main(process.argv.slice(2))
