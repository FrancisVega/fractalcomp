const fs = require('fs-extra')
const os = require('os')

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
  },

  /**
   * Create ~/.fractalcomp/config.json if doesn't exists.
   */
  setConfig: function(data) {
    const fractalConfigDir = `${os.homedir()}/fractalcomp`
    const fractalConfigFile = `${fractalConfigDir}/config.json`
    try { fs.mkdirsSync(fractalConfigDir) } catch (e) {}
    if (this.isFile(fractalConfigFile) === false) {
      this.writeJSON(fractalConfigFile, data)
    }
  },

  /**
   * Read config file
   * @return {string} content of config file in JSON format
   */
  readConfig: function () {
    const fractalConfigDir = `${os.homedir()}/fractalcomp`
    const fractalConfigFile = `${fractalConfigDir}/config.json`
    return this.readJSON(fractalConfigFile)
  },


  /**
   * Get a template file replacing @@name with name
   * @parms ftype {string} File type
   * @parms name {string} Content of @@name
   * @return {string}
   */
  getTemplate: function(baseCompTemplatesDir, ctype, ftype, name) {
    return fs.readFileSync ( `${baseCompTemplatesDir}/${ctype}/${ftype}` , 'utf8' )
      .replace( /@@name/g, name )
  }

}

