# Button

## Usos del componente (nunjucks)
Este es el componente button y puede usarse de tres formas:

Incluirlo tal cual
```
{% raw %}
{% include '@button' %}
{% endraw %}
```

Incluirlo con el contexto que exista en la variable 'button'. Esta variable es un 'key' dentro del archivo de configuración del componente desde donde se está incluyendo el botón.
```
{% raw %}
{% render '@button', button %}
{% endraw %}
```

Incluirlo con el contexto que exista en la variable 'button' pero a su vez arrastrando el contexto del propio botón. Es decir si el botón tiene dos variables, pongamos "title" para el texto que aparece en el botón y "link" para el enlace, si solo indicamos en la variable button el title, solo sobreescribirá el title y el link se lo "traerá" del contexto del botón.

```
{% raw %}
{% render '@button', button, true %}
{% endraw %}
```

