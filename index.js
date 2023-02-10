const fs = require('fs')
const sass = require('sass')
const { parse } = require('yaml')

const configString = fs.readFileSync('config.yaml', 'utf8')
const config = parse(configString)
console.log(config)

const compiled = sass.compile('src/zirconium.scss', {
  style: "compressed",
  sourceMap: true,
  alertColor: true
})

const outputPath = config.output.path
const mapOut = [outputPath, 'zirconium.min.css.map'].join('/');
const cssOut = [outputPath, 'zirconium.min.css'].join('/');

const { css, sourceMap } = compiled
const cssString = `${css}/*# sourceMappingURL=${mapOut} */`

console.log(cssString)

// Write CSS to file
fs.writeFile(cssOut, cssString, (err) => {
  if (err) {
    console.error("[ERROR] Error writing CSS file", err)
  } else {
    console.log("[SUCCESS] CSS file written to " + cssOut)
  }
})

// Write source map to file
fs.writeFile(mapOut, JSON.stringify(sourceMap), (err) => {
  if (err) {
    console.error("[ERROR] Error writing sourcemap file", err)
  } else {
    console.log("[SUCCESS] Sourcemap file written to " + mapOut)
  }
})