const { SassCompiler } = require('./SassCompiler');
const watch = require('watch')

const compiler = new SassCompiler()
watch.watchTree("src/", (modifiedFile, currentStat, previousStat) => {
  console.log("File changed:", modifiedFile)
  console.log("Recompiling...")
  compiler.compile('src/zirconium.scss')
  console.log("Done.")
})