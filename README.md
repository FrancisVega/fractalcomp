# Fractal Comp

Create boilerplates fractal components

### Examples of use

This command creates three base component files using templates in comp-templates folder
  
    newcomp button --nunjucks --css --json

**button.njk**

    {# button #}
    <div class="button{% for modifier in modifiers %}button--{{ modifier }}{% endfor %}">
        <span class="button__text">{{ text }}</span>
    </div>
    
**button.css**

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

**button.json**

    {
      "name": "button",
      "context": {
        "modifiers": ["mod01", "mod02"]
      }
    }

### TODO:

Passing a template as argument to create the component

    newcomp card --all --template simplecard
