#! /usr/bin/env node

// Import modules
// ----------------------------------------------------------------------------
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

  util.setConfig(ROOT, ".newfrcl", {
    compBaseName: 'component',
    compConfigBaseName: '.config',
    extensions: {
      handlebars: '.hbs',
      nunjucks: '.nun',
      twig: '.twig',
      javascript: '.js',
      json: '.json',
      yaml: '.yaml',
      css: '.css',
      scss: '.scss',
      markdown: '.md',
    },
    comp: {
      template: 'base',
      type: 'twig',
      path: '',
      fullPath: '',
      config: 'javascript',
      readme: false,
      styles: 'css',
    },
  });
  process.exit(0);
}

// Read config file
// ----------------------------------------------------------------------------
const config = util.readConfig(ROOT, '.newfrcl');
const compBaseName = config.compBaseName;
const compTemplateName = config.comp.template;
const compConfigBaseName = config.compConfigBaseName;
const extensions = config.extensions;
const comp = config.comp;

// Create a directory with the component name
// ----------------------------------------------------------------------------
comp.fullPath = app.args[0];
comp.name = path.basename(comp.fullPath);
comp.dir = `${path.dirname(comp.fullPath)}/${comp.name}`;

// Custom comp-templates folder
const compTemplates = ROOT + "/comp-templates";

// Copy base templates if doesnt exists
if (util.isDir(compTemplates) === false) {
  fs.mkdirsSync(compTemplates);
  fs.copySync(path.join(__dirname, 'comp-templates'), compTemplates);
}

// Template from user
if(app.template) {
  comp.template = app.template;
}

// Create Main Component File.
// ----------------------------------------------------------------------------
if(util.isFile(`${compTemplates}/${comp.template}/${compBaseName}${extensions[comp.type]}`)){
  try { fs.mkdirsSync(comp.dir); } catch (e) { /* */ }
  util.writeFile(
    `${comp.dir}/${comp.name}${extensions[comp.type]}`,
    util.getTemplate(
      compTemplates,
      comp.template,
      `${compBaseName}${extensions[comp.type]}`,
      comp.name
    )
  );
} else {
  console.log(`The template file ${compTemplates}/${comp.template}/${compBaseName}${extensions[comp.type]} doesn't exists`.red);
  process.exit(0);
}

// Create Component Config File.
// ----------------------------------------------------------------------------
if (comp.config) {
  const configFile = `${comp.dir}/${comp.name}${compConfigBaseName}${extensions[comp.config]}`;
  const configData = util.getTemplate(
      compTemplates,
      comp.template,
      `${compBaseName}${compConfigBaseName}${extensions[comp.config]}`,
      comp.name
    )
  util.writeFile(configFile, configData);
}

// Create Component Style File.
// ----------------------------------------------------------------------------
const prefix = comp.styles === 'scss' ? '_' : '';
const styleFile = `${comp.dir}/${comp.name}${extensions[comp.styles]}`;
const styleData = util.getTemplate(
    compTemplates,
    comp.template,
   `${compBaseName}${extensions[comp.styles]}`,
    comp.name
  );
util.writeFile(styleFile, styleData);

// Create Readme File.
// ----------------------------------------------------------------------------
if (comp.readme) {
  const readmeFile = `${comp.dir}/README.md`;
  const readmeData = util.getTemplate(
      compTemplates,
      comp.template,
      `README${extensions.markdown}`,
      comp.name
    );
  util.writeFile(readmeFile, readmeData);
}

// Bye.
// ----------------------------------------------------------------------------
process.exit(0);
