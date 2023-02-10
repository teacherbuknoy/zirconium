const fs = require('fs')
const path = require('path')
const sass = require('sass')
const { parse } = require('yaml')

class SassCompiler {
  config;
  paths;
  constructor() {
    const configString = fs.readFileSync('config.yaml', 'utf8')
    this.config = parse(configString)

    const outputPath = this.config.output.path
    this.paths = {
      sourcemap: [outputPath, 'zirconium.min.css.map'].join('/'),
      css: [outputPath, 'zirconium.min.css'].join('/')
    }
  }

  compile(filepath) {
    const compiled = sass.compile(path.resolve(process.cwd(), filepath), {
      style: "compressed",
      sourceMap: true,
      alertColor: true
    })

    const { css, sourceMap } = compiled
    const cssString = `${css}/*# sourceMappingURL=${this.paths.sourcemap} */`

    // Write CSS to file
    fs.writeFile(this.paths.css, cssString, (err) => {
      if (err) {
        console.error("[ERROR] Error writing CSS file", err)
      } else {
        console.log("[SUCCESS] CSS file written to " + this.paths.css)
      }
    })

    // Write source map to file
    fs.writeFile(this.paths.sourcemap, JSON.stringify(sourceMap), (err) => {
      if (err) {
        console.error("[ERROR] Error writing sourcemap file", err)
      } else {
        console.log("[SUCCESS] Sourcemap file written to " + this.paths.sourcemap)
      }
    })
  }
}

module.exports = { SassCompiler }