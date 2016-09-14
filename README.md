# Fractal Comp

Create boilerplates fractal components

### Options

```bash
Usage: newcomp [options]

Options:

  -h, --help        output usage information
  -V, --version     output the version number
  -a, --all         make component with all files (Default formats)
  -n, --nunjucks    nunjucks engine
  -b, --handlebars  handlerbars engine
  -r, --readme      readme.md file
  -c, --css         css file
  -y, --yaml        yaml file
  -j, --json        json file
  -J, --javascript  javascript file
  -v, --verbose     Verbose mode
`````

### Examples of use

This command creates the three base components files using templates in comp-templates folder
  
    # Create a button component
    newcomp button --nunjucks --css --json

**button.njk**
```html
{# button #}
<div class="button{% for modifier in modifiers %}button--{{ modifier }}{% endfor %}">
    <span class="button__text">{{ text }}</span>
</div>
```
    
**button.css**
```css
/* button */

/* Config */
$button__linkColor: #ff00aa;
$button__tinyFont: 1rem;

/* Styles */
.button { }
.button__text {
  display: block;
  @element '.button' and (min-width: 300px) {
    font-size: $button__tinyFont;
  }
}
```

```json
**button.json**

{
  "name": "button",
  "context": {
    "modifiers": ["mod01", "mod02"]
  }
}
````

### TODO:

Passing a template as argument to create the component

    newcomp card --all --template simplecard
