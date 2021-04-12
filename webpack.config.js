
const fs = require('fs')

class RemoveLogs {
  constructor(ops) {
    this.ops = ops
  }

  apply (compiler) {
    console.log('Hello from the custom plugin')

    compiler.hooks.done.tap("RemoveLogs", stats => {
      console.log('start remove logs!')
      this.removeAllLogs(stats)
    })

    compiler.hooks.compilation.tap('GetFileNamePlugin', compilation => {
      compilation.hooks.chunkIds.tap('GetFileNamePlugin', (c) => {
        this.filename = Array.from(c)[0].name
      })
    })

  }

  removeAllLogs (stats) {
    const { path, filename } = stats.compilation.options.output
    const filePath = (path + "/" + filename).replace(/\[name\]/g, this.filename)
    console.log('filePath', filePath)

    try {
      fs.readFile(filePath, "utf8", (err, data) => {
        const rgx = /console.log\((.*?)\)\,*/g
        const newData = data.replace(rgx, "")
        if (err) console.log(err);
        fs.writeFile(filePath, newData, function (err) {
          if (err) {
            console.log(err)
          }
          console.log("all logs Removed")
        })
      })
    } catch (e) {
      console.error(e)
    }
  }
}




module.exports = {
  entry: './index.js',
  plugins: [new RemoveLogs()]
}