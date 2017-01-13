/**
 * button.js
 */
const isLargerThanOne = x => x > 1;
const sum = (a, b) => a + b;
const multiline = `
${isLargerThanOne(100)} is true
sure?
yes ;)`;

const zeta = function () { return 1; }; // R.map(x => x, [1, 2, 3]);
sum(zeta, multiline);
