import fs from 'fs';
import path from 'path';
import set from 'lodash/set';
import toSource from 'tosource';


function isFile(p) {
  const stat = fs.lstatSync(p);
  return stat.isFile();
}

function isDirectory(p) {
  const stat = fs.lstatSync(p);
  return stat.isDirectory();
}

function isValidFilename(filename) {
  if (!filename) return false;

  const split = filename.split('.');
  return split.length > 1
    && split[0]
    && ['json', 'js', 'yaml'].includes(split[split.length - 1]);
}

function fileContents(files, root, dir = '') {
  return files
    .filter((file) => isFile(path.join(root, dir, file)))
    .filter((file) => isValidFilename(file))
    .map((file) => ({
      path: dir ? `${dir}/${file}` : file,
      contents: fs.readFileSync(path.join(root, dir, file), 'utf-8'),
    }));
}

function getFile(p) {
  const rootFiles = fs.readdirSync(p);
  const sketchFeatures = fs.existsSync(path.join(p, 'sketch-features'))
    ? fs.readdirSync(path.join(p, 'sketch-features'))
    : [];

  const f = [
    ...fileContents(rootFiles, p),
    ...fileContents(sketchFeatures, p, 'sketch-features'),
  ];

  const files = f.reduce((obj, file) => {
    const filePath = file.path.split('/');
    set(obj, filePath, file.contents);
    return obj;
  }, {});

  const xrefs = {};

  try {
    const index = JSON.parse(files['index.json']);
    if (index.xrefs) {
      for (const [name, rel_path] of Object.entries(index.xrefs)) {
        const xref_path = path.join(p, rel_path);
        xrefs[name] = getFile(xref_path);
      }
    }
  } catch (e) {
    console.error(e);
  }

  files._xrefs = xrefs;

  return files;
}

export default function plugin() {
  const ext = /\.draft(\/index\.json)?$/;

  return {
    name: '@crhio/rollup-plugin-jsdraft',
    enforce: 'pre',

    async resolveId(source, importer) {
      if (!ext.test(source)) return null;

      const p = path.resolve(path.dirname(importer || '.'), source);
      return p;
    },

    load(id) {
      if (!ext.test(id)) return null;

      const cwd = process.cwd();
      let p = id.startsWith(cwd)
        ? id
        : path.join(cwd, id);

      p = isDirectory(p) ? p : path.dirname(p);
      const files = getFile(p);

      return JSON.stringify(files);
    },

    transform(content, id) {
      if (!ext.test(id)) return null;

      const files = JSON.parse(content);

      const code = `
        import { Draft } from '@crhio/jsdraft';

        const files = ${toSource(files)};

        const draft = Draft.load(files);

        export default draft;
      `;

      return {
        code,
        map: { mappings: '' },
      };
    },
  };
}
