# Fractal Comp

Create boilerplates fractal components

![vimnewcomp](https://raw.githubusercontent.com/FrancisVega/fractalcomp/master/assets/newcomp-anim.gif)

### Options

```bash
$newcomp --help

Usage: newcomp [options]

Options:

  -a, --all             make component with all files (Default formats)
  -t, --type <type>     Component Engine (nunjucks|handlebars|twig)
  -T, --styles <type>   Styles format
  -T, --template <name> File base template
  -r, --readme          readme.md file
  -y, --yaml            yaml file
  -j, --json            json file
  -J, --javascript      javascript file
  -d, --directory       Create a directory for the component files
  -v, --verbose         Verbose mode
  -h, --help            output usage information
  -V, --version         output the version number
```

### Install

```bash
npm -g install newfractalcomp
```

### Config defaults

The scripts creates a configuration file (.newfrctl) and a directory (comps-templates) with template(s) at project root folder (same as package.json) called .newfrctl to set defaults values. If you want to create new templates you have to put inside ~/fractalcomp/comp-templates. Notice how the base template is created at ~/fractalcomp/comp-templates/base


### Examples of use

```bash
# Create a button component with the nunjucks file
newcomp button --type nunjucks --styles css --json
```

```bash
# Create a myCard component with all the defaults files and the card template
newcomp myCard --template card --all
```
