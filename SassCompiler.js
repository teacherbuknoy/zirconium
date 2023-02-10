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
      minifiedCss: [outputPath, 'zirconium.min.css'].join('/'),
      expandedCss: [outputPath, 'zirconium.css'].join('/')
    }
  }

  compile(filepath) {
    this.#compileMinified(filepath)
    this.#compileExpanded(filepath)
  }

  #compileMinified(filepath) {
    const minified = sass.compile(path.resolve(process.cwd(), filepath), {
      style: "compressed",
      sourceMap: true,
      alertColor: true
    })

    const { css, sourceMap } = minified
    const cssString = `${css}/*# sourceMappingURL=${this.paths.sourcemap} */`

    // Write CSS to file
    fs.writeFile(this.paths.minifiedCss, cssString, (err) => {
      if (err) {
        console.error("[ERROR] Error writing CSS file", err)
      } else {
        console.log("[SUCCESS] CSS file written to " + this.paths.minifiedCss)
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

  #compileExpanded(filepath) {
    const minified = sass.compile(path.resolve(process.cwd(), filepath), {
      style: "expanded",
      sourceMap: true,
      alertColor: true
    })

    const { css, sourceMap } = minified
    const cssString = `${css}/*# sourceMappingURL=${this.paths.sourcemap} */`

    // Write CSS to file
    fs.writeFile(this.paths.expandedCss, cssString, (err) => {
      if (err) {
        console.error("[ERROR] Error writing CSS file", err)
      } else {
        console.log("[SUCCESS] CSS file written to " + this.paths.expandedCss)
      }
    })
  }
}

module.exports = { SassCompiler }