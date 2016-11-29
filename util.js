const fs = require('fs-extra')

module.exports = {

  /**
   * Check if file exists
   */
  isFile: function(f) {
    try {
      return fs.statSync(f).isFile()
    } catch(e) {
      return false
    }
  },

  /**
   * Write data into file
   * @parms f {string} File path
   * @parms content {string} File conent
   */
  writeFile: function (f, content) {
    if(this.isFile(f) === false){
      fs.writeFileSync(f, content)
    } else {
      console.log(`The file ${f} already exists. Better call Saul.`.red);
    }
  },

  readJSON: function(f) {
    return JSON.parse(fs.readFileSync(f, 'utf8'));
  },

  writeJSON: function(f, cnt) {
    fs.writeFileSync(f, JSON.stringify(cnt, null, 4))
  }

}

