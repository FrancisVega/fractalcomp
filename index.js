#! /usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const colors = require('colors');
const util = require('./util.js');
const findRoot = require('find-root');
const app = require('commander');
const ROOT = findRoot(process.cwd());

// Commander APP
// ----------------------------------------------------------------------------
app
  .version('3.0.0')
  .option('-T, --template <name>', 'File base template', 'base')
  .command('create <name>', 'Create config file and base templates', {isDefault: true}).alias('p')

app
  .command('init', 'Create config file and base templates').alias('i')

app.parse(process.argv);

// Create a directory with the component name
// ----------------------------------------------------------------------------
if (!app.args[1]) {
  process.exit(0);
} else {
  if (!util.isFile(ROOT + "/.newfrcl")) {
    const i = require('./index-init.js');
    process.exit(0);
  }
}

// Custom comp-templates folder
const compRootFolder = ROOT + "/comp-templates";

// Read config file
// ----------------------------------------------------------------------------
const config = util.readConfig(ROOT, '.newfrcl');
const comp = config;


const fullPath = app.args[1];
const componentName = path.basename(fullPath);
const componentDir = `${path.dirname(fullPath)}/${componentName}`;

// Template from user
if(app.template) {
  comp.template = app.template;
}

// Creamos el directorio del componente si este no existe
try { fs.mkdirsSync(componentDir); } catch (e) { /* */ }

// Leemos y escribimos los archivos de los componentes
config.files.map(extension => {
  const src_templatePath = `${compRootFolder}/${comp.template}`;
  const src_templateFiles = util.getFileFromExtension(`${src_templatePath}`, extension);
  src_templateFiles.map(src_templateFile => {
    if (src_templateFile) {
      const src_fileContent = fs.readFileSync ( src_templatePath + "/" + src_templateFile , 'utf8' );
      const dst_fileContent = src_fileContent.replace( /@@name/g, componentName );
      const dst_templatePath = componentDir;
      const dst_templateFile = src_templateFile.replace(config.baseName, componentName);
      util.writeFile( dst_templatePath + "/" + dst_templateFile, dst_fileContent );
    } else {
      console.log(`The component file for the extension ${extension} doesn't exists. Better call Saul`.blue);
    }
  })
})

process.exit(0);
