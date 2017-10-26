const fs = require('fs-extra');
const util = require('./util.js');
const findRoot = require('find-root');
const ROOT = findRoot(process.cwd());

// Create cofig file if doesn't exists
if (!util.isFile(ROOT + "/.newfrcl")) {
  console.log("");
  console.log("  Config file [.newfrcl] (hidden) and base template [comp-templates] created.");
  console.log("  Edit .newfrcl and comp-template files to customize.");
  console.log("");

  fs.writeFileSync(ROOT + "/.newfrcl", JSON.stringify(
    {
      baseName: 'component',
      template: 'base',
      files: [
        '.html',
        '.js',
        '.json',
        '.yaml',
        '.md',
        '.css',
        '.scss',
      ],
    }
    , null, 4))

  process.exit(0);
} else {
  console.log("");
  console.log("Everything is all right.");
}

// Custom comp-templates folder
const compRootFolder = ROOT + "/comp-templates";

// Create component dire and template files if doesn't exists
if (!util.isDir(compRootFolder)) {
  fs.mkdirsSync(compRootFolder);
  fs.copySync(path.join(__dirname, 'comp-templates'), compRootFolder);
}

