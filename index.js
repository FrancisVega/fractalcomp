#! /usr/bin/env node

// Import modules
const path = require('path')
const exec = require('child_process').exec
const fs = require('fs-extra')
const os = require('os')
const colors = require('colors')
const camelCase = require('camelcase')
const util = require('./util.js')

/**
 * Get a template file replacing @@name with name
 * @parms ftype {string} File type
 * @parms name {string} Content of @@name
 * @return {string}
 */
const getTemplate = (ctype, ftype, name) => {
  const FTYPES = {
    "nunjucks": "component.nun",
    "handlebars": "component.hbs",
    "css": "component.css",
    "scss": "component.scss",
    "readme": "README.md",
    "config_yaml": "component.config.yaml",
    "config_json": "component.config.json",
    "config_js": "component.config.js"
  }
  return fs.readFileSync(
    `${__dirname}/comp-templates/${ctype}/${FTYPES[ftype]}`, 'utf8')
    .replace(/@@name/g, name)
}

const app = require('commander')
app
  .version('1.0')
  .option('-a, --all', 'make component with all files (Default formats)')
  .option('-t --type <type>', 'Component Engine', /^(nunjucks|handlebars)$/i, 'nunjucks')
  .option('-s --styles <type>', 'Styles format', /^(css|scss)$/i, 'scss')
  .option('-T, --template <name>', 'File base template')
  .option('-r, --readme', 'readme.md file')
  .option('-y, --yaml', 'yaml file')
  .option('-j, --json', 'json file')
  .option('-J, --javascript', 'javascript file')
  .option('-d, --directory', 'Create a directory for the components files')
  .option('-v, --verbose', 'Verbose mode')
  .parse(process.argv)

let comp = {
  "template": "base",
  "type": "nunjucks",
  "path": "",
  "name": "newcomponent",
  "fullPath": "",
  "config": false,
  "readme": false,
  "styles": "scss"
}

// If there is no name use the current folder instead.
if(!app.args[0]) {
  comp.name = path.basename(process.cwd())
    .split(/\d+[-_ ]+/)
    .join("")
  comp.dir = "."
  comp.fullPath = `${comp.dir}/${comp.name}`
} else {
  // if -d create a directory with the component name
  comp.name = path.basename(app.args[0])
  comp.fullPath = app.args[0]
  if (app.directory) {
    comp.dir = path.dirname(app.args[0]) + "/" + comp.name
  } else {
    comp.dir = path.dirname(app.args[0])
  }
}

// camelcase the comp name
//comp.name = camelCase(comp.name)

// --all
if (app.all) {
  comp.type = "nunjucks"
  comp.config = "javascript"
  comp.readme = true
  comp.styles = "css"
} else {
  // Engine
  comp.type = app.type

  // Styles
  if (app.styles) comp.styles = app.styles

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
try { fs.mkdirsSync(comp.dir) } catch (e) {}

// comp
switch (comp.type) {
  case 'nunjucks':
    util.writeFile(`${comp.dir}/${comp.name}.nun`, getTemplate(comp.template, "nunjucks", comp.name))
    break
  case 'handlebars':
    util.writeFile(`${comp.dir}/${comp.name}.hbs`, getTemplate(comp.template, "handlebars", comp.name))
    break
}

// config
switch (comp.config) {
  case 'javascript':
    util.writeFile(`${comp.dir}/${comp.name}.config.js`, getTemplate(comp.template, "config_js", comp.name))
    break
  case 'json':
    util.writeFile(`${comp.dir}/${comp.name}.config.json`, getTemplate(comp.template, "config_json", comp.name))
    break
  case 'yaml':
    util.writeFile(`${comp.dir}/${comp.name}.config.yaml`, getTemplate(comp.template, "config_yaml", comp.name))
    break
}

// styles
switch (comp.styles) {
  case 'scss':
    util.writeFile(`${comp.dir}/_${comp.name}.scss`, getTemplate(comp.template, "scss", camelCase(comp.name)))
    break
  case 'css':
    util.writeFile(`${comp.dir}/${comp.name}.css`, getTemplate(comp.template, "css", camelCase(comp.name)))
    break
}

// readme
if (comp.readme)
  util.writeFile(`${comp.dir}/README.md`, getTemplate(comp.template, "readme", comp.name))

if(app.verbose) {
  console.log("")
  console.log("  New Fractal Component".yellow)
  console.log("")
  console.log('  Template:  '.gray + comp.template)
  console.log('  Name:      '.gray + comp.name)
  console.log('  Type:      '.gray + comp.type)
  console.log('  Config:    '.gray + comp.config)
  console.log('  Styles:    '.gray + comp.styles)
  console.log('  README.md: '.gray + comp.readme)
  console.log("")
}

process.exit(0)
