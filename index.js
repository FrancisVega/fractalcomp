#! /usr/bin/env node

// Import modules
var path = require('path')
var exec = require('child_process').exec
var fs = require('fs-extra')
var os = require('os')
var colors = require('colors')
var R = require('ramda')

/**
 * Write data into file
 * @parms f {string} File path
 * @parms content {string} File conent
 */
const writeFile = (f, content) => {
  if(!isFile(f)){
    fs.writeFileSync(f, content)
  } else {
    console.log(`The file ${f} already exists. Better call Saul.`.red);
  }
}

/**
 * Check if file exists
 */
const isFile = f => {
  try {
    return fs.statSync(f).isFile()
  } catch(e) {
    return false
  }
}

/**
 * Get a template file replacing @@name with name
 * @parms ftype {string} File type
 * @parms name {string} Content of @@name
 * @return {string}
 */
const getTemplate = (ctype, ftype, name) => {
  const FTYPES = {
    "nunjucks": "component.njk",
    "handlebars": "component.hbs",
    "css": "component.css",
    "readme": "README.md",
    "config_yaml": "component.config.yaml",
    "config_json": "component.config.json",
    "config_js": "component.config.js"
  }
  return fs.readFileSync(
    `${__dirname}/comp-templates/${ctype}/${FTYPES[ftype]}`, 'utf8')
    .replace(/@@name/g, name)
}

let comp = {
  "template": "base",
  "type": "nunjucks",
  "path": "",
  "name": "newcomponent",
  "fullPath": "",
  "config": false,
  "readme": false,
  "css": false
}

let app = require('commander')
app
  .version('1.0')
  .option('-a, --all', 'make component with all files (Default formats)')
  .option('-t --type <type>', 'Component Engine', /^(nunjucks|handlebars)$/i,
          'nunjucks')
  .option('-T, --template <name>', 'File base template')
  .option('-r, --readme', 'readme.md file')
  .option('-c, --css', 'css file')
  .option('-y, --yaml', 'yaml file')
  .option('-j, --json', 'json file')
  .option('-J, --javascript', 'javascript file')
  .option('-v, --verbose', 'Verbose mode')
  .parse(process.argv)

// If there is no name use the current folder instead.
if(!app.args[0]) {
  comp.name = path.basename(process.cwd())
    .split(/\d+[-_ ]+/)
    .join("")
} else {
  comp.dir = path.dirname(app.args[0])
  comp.name = path.basename(app.args[0])
  comp.fullPath = app.args[0]
}

// Template
//comp.template = app.template

// A simple humanize.
// TODO: Refactor with ramda please :P
comp.name =
  comp.name.toLowerCase()
  .split(/[-_ ]/g)
  .map((s, x) => {
    if (x>0) {
      return `${s.charAt(0).toUpperCase()}${s.slice(1)}`
    } else {
      return s.toLowerCase();
    }
  })
  .join("")

// --all
if (app.all) {
  comp.type = "nunjucks"
  comp.config = "javascript"
  comp.css = true
  comp.readme = true
} else {
  // Engine
  comp.type = app.type

  // CSS
  if (app.css) comp.css = true

  // Config File And Format
  if (app.yaml) comp.config = 'yaml'
  if (app.javascript) comp.config = 'javascript'
  if (app.json) comp.config = 'json'

  // README.md
  if (app.readme) comp.readme = true
}

if (app.template)
  comp.template = app.template

// Make component dir if needed
try {
  console.log(comp.dir);
  fs.mkdirsSync(comp.dir)
} catch (e) {
  console.log("No se pudo hacer el directyorio");
}

//try {

// comp
switch (comp.type) {
  case 'nunjucks':
    writeFile(`${comp.fullPath}.njk`, getTemplate(comp.template, "nunjucks", comp.name))
    break;
  case 'handlebars':
    writeFile(`${comp.fullPath}.hbs`, getTemplate(comp.template, "handlebars", comp.name))
    break;
}

// config
switch (comp.config) {
  case 'javascript':
    writeFile(`${comp.fullPath}.config.js`, getTemplate(comp.template, "config_js", comp.name))
    break;
  case 'json':
    writeFile(`${comp.fullPath}.config.json`, getTemplate(comp.template, "config_json", comp.name))
    break;
  case 'yaml':
    writeFile(`${comp.fullPath}.config.yaml`, getTemplate(comp.template, "config_yaml", comp.name))
    break;
}

// css
if (comp.css)
  writeFile(`${comp.fullPath}.css`, getTemplate(comp.template, "css", comp.name))

// readme
if (comp.readme)
  writeFile(`${comp.dir}/README.md`, getTemplate(comp.template, "readme", comp.name))

if(app.verbose) {
  console.log("")
  console.log("  New Fractal Component".yellow)
  console.log("")
  console.log('  Template:  '.gray + comp.template)
  console.log('  Name:      '.gray + comp.name)
  console.log('  Type:      '.gray + comp.type)
  console.log('  Config:    '.gray + comp.config)
  console.log('  CSS:       '.gray + comp.css)
  console.log('  README.md: '.gray + comp.readme)
  console.log("")
}

//} catch(e){ process.exit(1) }

process.exit(0)
