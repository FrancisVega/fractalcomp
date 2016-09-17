# Fractal Comp

Create boilerplates fractal components

![vimnewcomp](https://raw.githubusercontent.com/FrancisVega/fractalcomp/master/assets/newcomp-anim.gif)

### Options

```bash
$newcomp --help

Usage: newcomp [options]

Options:

  -a, --all             make component with all files (Default formats)
  -t, --type <type>     Component Engine (nunjucks|handlebars)
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

### Examples of use

```bash
# Create a button component with the nunjucks file
newcomp button --type nunjucks --styles css --json
```

```bash
# Create a myCard component with all the defaults files and the card template
newcomp myCard --template card --all
```
