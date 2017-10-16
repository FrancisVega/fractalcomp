const fs = require('fs');

const readFile = filePath => fs.readFileSync(filePath, 'utf8');

const replaceStrInFile = (filePath, str, newStr) => {
  try {
    const contentOfFile = readFile(filePath);
    fs.writeFileSync(filePath, contentOfFile.replace(str, newStr));
  } catch (e) {
    console.log(e);
  }
};

replaceStrInFile('./button/button.css', 'button', 'kuddos');
