const fs = require('fs');
const path = require('path');
const parse_filename = require('../utility/misc/parse-filename.js');


function isFile(p) {
  const stat = fs.lstatSync(p);
  return stat.isFile();
}

/*
The provided string, "d", can either be:

- The path to a single sketch function file.
- The path to a directory containing sketch feature functions.
- The path to a directory containing a subfolder named "sketch-features".
- The path to an "index.json" file within a .draft folder.
*/

function load_draft_file(d, Draft) {
  const draft = new Draft();

  d = path.join(process.cwd(), d);

  const p = path.basename(d) === 'index.json' ? path.dirname(d) : d;

  if (isFile(p)) {
    const extension = path.extname(p);
    const name = path.basename(d, extension);
    draft.add_feature(
      name,
      extension.split('.')[1],
      fs.readFileSync(p, 'utf-8'),
    );
    return draft;
  }

  const sketch_dir = fs.existsSync(path.join(p, 'sketch-features'))
    ? path.join(p, 'sketch-features')
    : p;

  const sketch_feature_files = fs.readdirSync(sketch_dir);

  const files = sketch_feature_files
    .filter((file) => isFile(path.join(sketch_dir, file)))
    .map((filename) => parse_filename(filename))
    .filter((file) => file)
    .map((file) => ({
      ...file,
      contents: fs.readFileSync(path.join(sketch_dir, file.filename), 'utf-8'),
    }));

  files.forEach((file) => {
    draft.add_feature(file.name, file.extension, file.contents);
  });

  return draft;
}

module.exports = load_draft_file;