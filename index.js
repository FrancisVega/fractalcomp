#! /usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const colors = require('colors');
const util = require('./util.js');
const findRoot = require('find-root');
const app = require('commander');
const ROOT = findRoot(process.cwd());

// - functions
const initConfigFile = () => {
  // Create cofig file if doesn't exists
  if (!util.isFile(ROOT + "/.newfrcl")) {
    console.log("");
    console.log("  Config file [.newfrcl] (hidden) and base template [comp-templates] created.");
    console.log("  Edit .newfrcl and comp-template files to customize.");
    console.log("");

    fs.writeFileSync(ROOT + "/.newfrcl", JSON.stringify(
      {
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
      }
      , null, 4))

    process.exit(0);
  }
}

// Create component folder and template files if doesn't exists
const initComponentFolder = () => {
  if (!util.isDir(ROOT_COMP_FOLDER)) {
    fs.mkdirsSync(ROOT_COMP_FOLDER);
    fs.copySync(path.join(__dirname, 'comp-templates'), ROOT_COMP_FOLDER);
  }
}

// Read config file
const readConfigFile = () => {
  return config = util.readConfig(ROOT, '.newfrcl');
}


// Custom comp-templates folder
const ROOT_COMP_FOLDER = ROOT + "/comp-templates";

// Commander APP
// ----------------------------------------------------------------------------
app
  .version('3.0.0')
  .option('-T, --template <name>', 'File base template', 'base')
  .command('create <name>', {isDefault:true})
  .action(function(env){
    initConfigFile();
    initComponentFolder();

    // Read cofig file
    const comp = readConfigFile();

    // Template from user
    if(app.template)
      comp.template = app.template;

    // Full path
    const fullPath = app.args[0]
    // name & dir
    const componentName = path.basename(fullPath);
    const componentDir = `${path.dirname(fullPath)}/${componentName}`;

    // Creamos el directorio del componente si este no existe
    try { fs.mkdirsSync(componentDir); } catch (e) { /* */ }

    // Leemos y escribimos los archivos de los componentes
    config.files.map(extension => {
      const src_templatePath = `${ROOT_COMP_FOLDER}/${comp.template}`;
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

    console.log('Creating "%s"', env);
  });

app
  .command('init')
  .action(function(env){
    console.log();
    console.log('.newfrcl config file created.');
    console.log();
    initConfigFile();
    initComponentFolder();
  });

app.parse(process.argv);
process.exit(0);
