#! /usr/bin/env node

// Import modules
var path = require('path')
var exec = require('child_process').exec
var fs = require('fs-extra')
var os = require('os')
var colors = require('colors')
var R = require('ramda')

/**
 * Escribe datos (string) en un archivo y si existe da un error
 * @parms f {string} El path del archivo a escribir
 * @parms content {string} El contenido que queremos escribir
 */
const writeFile = (f, content) => {
  if(!isFile(f)){
    fs.writeFileSync(f, content)
  } else {
    console.log(`El archivo ${f} ya existe. Better call Saul.`.red);
  }
}

/**
 * Comprueba si existe el archivo f
 */
const isFile = f => {
  try {
    return fs.statSync(f).isFile()
  } catch(e) {
    return false
  }
}

/**
 * Obtiene el contenido de un template reemplazando @@name por name
 * @parms ftype {string} El tipo de fichero que quieres obtener
 * @parms name {string} El texto que quieres reemplazar por @@name
 * @return {string}
 */
const contentOfFile = (ftype, name) => {
  const FTYPES = {
    "nunjucks": "component.njk",
    "handlebars": "component.hbs",
    "css": "component.css",
    "readme": "README.md",
    "config_yaml": "component.config.yaml",
    "config_json": "component.config.json",
    "config_js": "component.config.js"
  }
  return fs.readFileSync(`${__dirname}/comp-templates/${FTYPES[ftype]}`, 'utf8')
    .replace(/@@name/g, name)
}

/*
 * Objeto base con el contenido del CLI
 */
let comp = {
  "type": "nunjucks",
  "name": "newcomponent",
  "config": false,
  "readme": false,
  "css": false
}

// Commander Parser
let app = require('commander')
app
  .version('1.0')
  .option('-a, --all', 'make component with all files (Default formats)')
  .option('-n, --nunjucks', 'nunjucks engine')
  .option('-b, --handlebars', 'handlerbars engine')
  .option('-r, --readme', 'readme.md file')
  .option('-c, --css', 'css file')
  .option('-y, --yaml', 'yaml file')
  .option('-j, --json', 'json file')
  .option('-J, --javascript', 'javascript file')
  .option('-v, --verbose', 'Verbose mode')
  .parse(process.argv)

// Si no especificamos un nombre, lo tomamos de la carpeta actual
if(!app.args[0]) {
  comp.name = path.basename(process.cwd())
    .split(/\d+[-_ ]+/)
    .join("")
} else {
  comp.name = app.args[0]
}

// Parseamos el nombre humanizándolo
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

  if (app.all) {
    comp.type = "nunjucks"
    comp.config = "javascript"
    comp.css = true
    comp.readme = true
  } else {
    // Component Type (Engine)
    if (app.handlebars) comp.type = 'handlebars'
    if (app.nunjucks) comp.type = 'nunjucks'

    // CSS
    if (app.css) comp.css = true

    // Config File And Format
    if (app.yaml) comp.config = 'yaml'
    if (app.javascript) comp.config = 'javascript'
    if (app.json) comp.config = 'json'

    // README.md
    if (app.readme) comp.readme = true
  }

  if(app.verbose) {
    console.log("")
    console.log("  New Fractal Component".yellow)
    console.log("")
    console.log('  Name:      '.gray + comp.name)
    console.log('  Type:      '.gray + comp.type)
    console.log('  Config:    '.gray + comp.config)
    console.log('  CSS:       '.gray + comp.css)
    console.log('  README.md: '.gray + comp.readme)
    console.log("")
  }

  const cwd = process.cwd()

  // comp
  if (comp.type === "nunjucks") {
    let f = `${cwd}/${comp.name}.njk`
    writeFile(f, contentOfFile("nunjucks", comp.name))
  }

  // config
  if (comp.config === "javascript")
    writeFile(`${cwd}/${comp.name}.config.js`, contentOfFile("config_js", comp.name))
  if (comp.config === "json")
    writeFile(`${cwd}/${comp.name}.config.json`, contentOfFile("config_json", comp.name))
  if (comp.config === "yaml")
    writeFile(`${cwd}/${comp.name}.config.yaml`, contentOfFile("config_yaml", comp.name))

  // css
  if (comp.css)
    writeFile(`${cwd}/${comp.name}.css`, contentOfFile("css", comp.name))

  // readme
  if (comp.readme)
    writeFile(`${cwd}/README.md`, contentOfFile("readme", comp.name))

  process.exit(0)
