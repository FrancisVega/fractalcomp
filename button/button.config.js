const cname = 'button';

module.exports = {

  // Base info
  title: 'Button',
  tags: ['foo', 'bar', 'taz'],
  collated: true,

  // Preview Layout
  preview: '@dark',
  name: cname,

  // Context
  context: {
    text: 'Default Button',
    url: 'www.secuoyas.com',
    link: true,
    data: {
      lol: 'jandler',
      pep: 'zumber',
    },
    classes: {
      block: cname,
      mods: [],
      others: [],
    },
  },

  // Button variants
  variants: [
    {
      name: 'outlined',
      context: {
        link: false,
        text: 'Outlined Button',
        classes: {
          block: cname,
          mods: ['outlined'],
        },
      },
    },
    {
      name: 'error',
      context: {
        text: 'Error Button',
        classes: {
          block: cname,
          mods: ['error'],
        },
      },
    },
  ],

};
