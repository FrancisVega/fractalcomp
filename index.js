#! /usr/bin/env node

// Import modules
const path = require('path')
const exec = require('child_process').exec
const fs = require('fs-extra')
const os = require('os')
const colors = require('colors')
const util = require('./util.js')

/**
 * Crea el archivo ~/.fractalcomp/config.json si no existe.
 * Este archivo sirve para configurar nombres y extensiones por defecto.
 */
const setConfig = data => {
  const fractalConfigDir = `${os.homedir()}/.fractalcomp`
  const fractalConfigFile = `${fractalConfigDir}/config.json`

  try { fs.mkdirsSync(fractalConfigDir) } catch (e) {}
  if ( util.isFile(fractalConfigFile) === false ) {
    util.writeJSON(fractalConfigFile, data)
  }
}

/** Read config file */
const readConfig = data => {
  const fractalConfigDir = `${os.homedir()}/.fractalcomp`
  const fractalConfigFile = `${fractalConfigDir}/config.json`
  return util.readJSON(fractalConfigFile)
}

/**
 * Get a template file replacing @@name with name
 * @parms ftype {string} File type
 * @parms name {string} Content of @@name
 * @return {string}
 */
const getTemplate = (ctype, ftype, name) =>
  fs.readFileSync ( `${__dirname}/comp-templates/${ctype}/${ftype}` , 'utf8' )
    .replace( /@@name/g, name )

const app = require('commander')
app
  .version('1.0.24')
  .option('-a, --all', 'make component with all files (Default formats)')
  .option('-t --type <type>', 'Component Engine', /^(nunjucks|handlebars)$/i, 'nunjucks')
  .option('-s --styles <type>', 'Styles format', /^(css|scss)$/i, 'css')
  .option('-T, --template <name>', 'File base template')
  .option('-r, --readme', 'readme.md file')
  .option('-y, --yaml', 'yaml file')
  .option('-j, --json', 'json file')
  .option('-J, --javascript', 'javascript file')
  .option('-d, --directory', 'Create a directory for the components files')
  .option('-v, --verbose', 'Verbose mode')
  .option('-N, --nc', 'Doest create generic comments')
  .parse(process.argv)


// Esto crea el archivo de configuración en caso de no existir
setConfig (
  { "compBaseName": 'component'
  , "compConfigBaseName": '.config'
  , "extensions":
    { "handlebars": '.hbs'
    , "nunjucks": '.nun'
    , "javascript": '.js'
    , "json": '.json'
    , "yaml": '.yaml'
    , "css": '.css'
    , "scss": '.scss'
    , "markdown": '.md' }
  , "comp":
    { 'template': 'base'
    , 'type': 'nunjucks'
    , 'path': ''
    , 'fullPath': ''
    , 'config': false
    , 'readme': false
    , 'styles': 'css' }
  }
)

// Lee el archivo de configuración
const config = readConfig()
const compBaseName = config.compBaseName
const compConfigBaseName = config.compConfigBaseName
const extensions = config.extensions
const comp = config.comp

// If there is no name use the current folder instead.
if(!app.args[0]) {
  comp.name = path.basename(process.cwd())
    .split(/\d+[-_ ]+/)
    .join('')
  comp.dir = '.'
  comp.fullPath = `${comp.dir}/${comp.name}`
} else {
  // if -d create a directory with the component name
  comp.name = path.basename(app.args[0])
  comp.fullPath = app.args[0]
  if (app.directory) {
    comp.dir = path.dirname(app.args[0]) + '/' + comp.name
  } else {
    comp.dir = path.dirname(app.args[0])
  }
}

// not all
if (app.all === false) {
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
util.writeFile
  ( `${comp.dir}/${comp.name}${extensions[comp.type]}`
  , getTemplate
    ( comp.template
    , `${compBaseName}${extensions[comp.type]}`
    , comp.name
    )
  )

// config
if(comp.config)
  util.writeFile
    ( `${comp.dir}/${comp.name}${compConfigBaseName}${extensions[comp.config]}`
    , getTemplate
      ( comp.template
      , `${compBaseName}${compConfigBaseName}${extensions[comp.config]}`
      , comp.name
      )
    )

// styles
if (comp.styles == "scss") { var prefix = "_" } else { var prefix = '' }

util.writeFile
  ( `${comp.dir}/${prefix}${comp.name}${extensions[comp.styles]}`
  , getTemplate
    ( comp.template
    , `${compBaseName}${extensions[comp.styles]}`
    , comp.name
    )
  )

// readme
if (comp.readme)
  util.writeFile
    ( `${comp.dir}/README.md`
    , getTemplate
      ( comp.template
      , `README${extensions.markdown}`
      , comp.name
      )
    )

if(app.verbose) {
  console.log('')
  console.log('  New Fractal Component'.yellow)
  console.log('')
  console.log('  Template:  '.gray + comp.template)
  console.log('  Name:      '.gray + comp.name)
  console.log('  Type:      '.gray + comp.type)
  console.log('  Config:    '.gray + comp.config)
  console.log('  Styles:    '.gray + comp.styles)
  console.log('  README.md: '.gray + comp.readme)
  console.log('')
}

process.exit(0)
