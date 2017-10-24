#! /usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const colors = require('colors');
const util = require('./util.js');
const findRoot = require('find-root');
const ROOT = findRoot(process.cwd());

// Commander APP
// ----------------------------------------------------------------------------
const app = require('commander');
app
  .version('3.0.0')
  .option('-T, --template <name>', 'File base template')
  .parse(process.argv);

// Si el archivo de configuración no existe lo creamos.
// ----------------------------------------------------------------------------
if (!util.isFile(ROOT + "/.newfrcl")) {

  console.log("\n  There is no config file .newfrcl");
  console.log("  One has been created at root foder. Edit .newfrcl file to change preferences.\n");

  const configFileData = {
    baseName: 'component',
    template: 'base',
    files: [
      '.html',
      '.js',
      '.json',
      '.yaml',
      '.md',
      '.css',
      '.scss',
    ],
  };

  fs.writeFileSync(ROOT + "/.newfrcl", JSON.stringify(configFileData, null, 4))
  process.exit(0);
}

// Custom comp-templates folder
const compRootFolder = ROOT + "/comp-templates";

// Si el directorio con los componentes base no existe lo creamos y copiamos los
// componentes base por defecto.
if (!util.isDir(compRootFolder)) {
  fs.mkdirsSync(compRootFolder);
  fs.copySync(path.join(__dirname, 'comp-templates'), compRootFolder);
}

// Read config file
// ----------------------------------------------------------------------------
const config = util.readConfig(ROOT, '.newfrcl');
const comp = config;

// Create a directory with the component name
// ----------------------------------------------------------------------------
const fullPath = app.args[0];
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
