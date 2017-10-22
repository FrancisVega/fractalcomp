const fs = require('fs-extra')
const os = require('os')

module.exports = {

  /**
   * Check if dir exists
   */
  isDir: (f) => {
    try {
      return fs.statSync(f).isDirectory();
    } catch (e) {
      return false;
    }
  },

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
  setConfig: function(baseDir, configFile, data) {
    const fractalConfigDir = baseDir + "fractalComps";
    const fractalConfigFile = baseDir + "/" + configFile;
    try { fs.mkdirsSync(fractalConfigDir) } catch (e) {}
    if (this.isFile(baseDir + "/" + configFile) === false) {
      this.writeJSON(baseDir + "/" + configFile, data)
    }
  },

  /**
   * Read config file
   * @return {string} content of config file in JSON format
   */
  readConfig: function (baseDir, configFile) {
    const fractalConfigDir = baseDir + "fractalComps";
    const fractalConfigFile = baseDir + "/" + configFile;
    return this.readJSON(fractalConfigFile)
  },


  /**
   * Get a template file replacing @@name with name
   * @parms fileType {string} File type
   * @parms name {string} Content of @@name
   * @return {string}
   */
  getTemplate: function(rootFolderTemplate, componentType, fileType, componentName) {
    if (this.isFile(`${rootFolderTemplate}/${componentType}/${fileType}`)) {
      const fileContent = fs.readFileSync ( `${rootFolderTemplate}/${componentType}/${fileType}`, 'utf8' );
      return fileContent.replace( /@@name/g, componentName );
    } else {
      console.log(`${componentType}/${fileType} doesn't exists. Better call Saul.`.red);
      process.exit(0);
    }
  }

}

