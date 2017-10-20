#! /usr/bin/env node

// Import modules
// -----------------------------------------------------------------------------------------------
const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const colors = require('colors');
const util = require('./util.js');
const findRoot = require('find-root');

const ROOT = findRoot(process.cwd());


// Commander APP
// -----------------------------------------------------------------------------------------------
const app = require('commander');
app
  .version('2.0.6')
  .option('-T, --template <name>', 'File base template')
  .option('-v, --verbose', 'Verbose mode')
  .parse(process.argv);


if (util.isFile(ROOT + "/.newfrcl")) {
} else {
  console.log("\n  There is no config file .newfrcl");
  console.log("  One has been created at root foder. Edit .newfrcl file to change preferences.\n");

  // Create config file
  // -----------------------------------------------------------------------------------------------
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
// -----------------------------------------------------------------------------------------------
const config = util.readConfig(ROOT, '.newfrcl');
const compBaseName = config.compBaseName;
const compTemplateName = config.comp.template;
const compConfigBaseName = config.compConfigBaseName;
const extensions = config.extensions;
const comp = config.comp;


// Create a directory with the component name
// -----------------------------------------------------------------------------------------------
comp.name = path.basename(app.args[0]);
comp.fullPath = app.args[0];
comp.dir = `${path.dirname(app.args[0])}/${comp.name}`;


// Settings app values
// -----------------------------------------------------------------------------------------------
if (app.all === false) {
  // Engine
  comp.type = app.type;

  // Styles
  if (app.styles) comp.styles = app.styles;

  // Config File And Format
  if (app.yaml) comp.config = 'yaml';
  if (app.javascript) comp.config = 'javascript';
  if (app.json) comp.config = 'json';

  // README.md
  if (app.readme) comp.readme = true;
} else {
  comp.type = config.comp.type;
  comp.styles = config.comp.styles;
  comp.config = config.comp.config;
  comp.readme = config.comp.readme;
}

// If the user pass a template, asign it to comp.template
// -----------------------------------------------------------------------------------------------
if (app.template) {
  comp.template = app.template;
}

// Custom comp-templates
const compTemplates = ROOT + "/comp-templates";

// Copy base templates if doesnt exists
if (util.isDir(compTemplates) === false) {
  fs.mkdirsSync(compTemplates);
  fs.copySync(path.join(__dirname, 'comp-templates'), compTemplates);
}

// Create Main Component File.
// -----------------------------------------------------------------------------------------------
if(util.isFile(`${compTemplates}/${comp.template}/${compBaseName}${extensions[comp.type]}`)){
  // Make component dir if needed.
  // -----------------------------------------------------------------------------------------------
  try { fs.mkdirsSync(comp.dir); } catch (e) { /* */ }
  util.writeFile(
    `${comp.dir}/${comp.name}${extensions[comp.type]}`,
    util.getTemplate(compTemplates, comp.template, `${compBaseName}${extensions[comp.type]}`, comp.name)
  );
} else {
  console.log(`The template file ${compTemplates}/${comp.template}/${compBaseName}${extensions[comp.type]} doesn't exists`.red);
  process.exit(0);
}


// Create Component Config File.
// -----------------------------------------------------------------------------------------------
if (comp.config) {
  util.writeFile(
    `${comp.dir}/${comp.name}${compConfigBaseName}${extensions[comp.config]}`,
    util.getTemplate(
      compTemplates,
      comp.template,
      `${compBaseName}${compConfigBaseName}${extensions[comp.config]}`,
      comp.name
    )
  );
}


// Create Component Style File.
// -----------------------------------------------------------------------------------------------
let prefix = '';
if (comp.styles === 'scss') { prefix = '_'; } else { prefix = ''; }

util.writeFile(
  `${comp.dir}/${prefix}${comp.name}${extensions[comp.styles]}`,
  util.getTemplate(
    compTemplates,
    comp.template,
    `${compBaseName}${extensions[comp.styles]}`,
    comp.name
  )
);

// Create Readme File.
// -----------------------------------------------------------------------------------------------
if (comp.readme) {
  util.writeFile(
    `${comp.dir}/README.md`,
    util.getTemplate(compTemplates, comp.template, `README${extensions.markdown}`, comp.name)
  );
}

// Verbose output
// -----------------------------------------------------------------------------------------------
if (app.verbose) {
  console.log('');
  console.log('  New Fractal Component'.yellow);
  console.log('');
  console.log('  Template:  '.gray + comp.template);
  console.log('  Name:      '.gray + comp.name);
  console.log('  Type:      '.gray + comp.type);
  console.log('  Config:    '.gray + comp.config);
  console.log('  Styles:    '.gray + comp.styles);
  console.log('  README.md: '.gray + comp.readme);
  console.log('');
}


// Bye.
// -----------------------------------------------------------------------------------------------
process.exit(0);
