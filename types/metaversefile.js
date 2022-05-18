const path = require('path');
// const fs = require('fs');
const url = require('url');
// const fetch = require('node-fetch');
const {cwd, fetchFileFromId, createRelativeFromAbsolutePath} = require('../util.js');

const _jsonParse2 = s => {
  try {
    const result = JSON.parse(s);
    return {result};
  } catch(error) {
    return {error};
  }
};

/* const cwd = process.cwd();
const isSubpath = (parent, dir) => {
  const relative = path.relative(parent, dir);
  const isSubdir = !!relative && !relative.startsWith('..') && !path.isAbsolute(relative);
  return isSubdir;
}; */

module.exports = {
  async resolveId(id, importer) {
    const s = await fetchFileFromId(id, importer, 'utf8');
    // console.log('metaversefile fetch', {id, importer, s});
    if (s !== null) {
      const {result, error} = _jsonParse2(s);
      if (!error) {
        // console.log('load metaversefile', {s, result});
        const {name, description, start_url, components} = result;
        if (start_url) {
          const _makeHash = () => {
            // return '#components=' + encodeURIComponent(JSON.stringify(components));

            const searchParams = new URLSearchParams();
            searchParams.set('contentId', start_url);
            if (name) {
              searchParams.set('name', name);
            }
            if (description) {
              searchParams.set('description', description);
            }
            if (Array.isArray(components)) {
              searchParams.set('components', JSON.stringify(components));
            }
            const s = searchParams.toString();
            return s ? ('#' + s) : '';
          };

          if (/^https?:\/\//.test(start_url)) {
            // const o = url.parse(start_url, true);
            // console.log('new metaversefile id 1', {id, importer, start_url, o}, [path.dirname(o.pathname), start_url]);
            // o.pathname = path.join(path.dirname(o.pathname), start_url);
            /* if (Array.isArray(components)) {
              o.query.components = encodeURIComponent(JSON.stringify(components));
            } */
            const o = url.parse(start_url, true);
            // o.pathname = '/@proxy/' + o.pathname;
            o.hash = _makeHash();
            let s = url.format(o);
            // console.log('new metaversefile id 1', {id, importer, result, start_url, s});
            return s;
          } else if (/^https?:\/\//.test(id)) {
            const o = url.parse(id, true);
            // console.log('new metaversefile id 1', {id, importer, start_url, o}, [path.dirname(o.pathname), start_url]);
            o.pathname = path.join(path.dirname(o.pathname), start_url);
            o.hash = _makeHash();
            /* if (Array.isArray(components)) {
              o.query.components = encodeURIComponent(JSON.stringify(components));
            } */
            let s = url.format(o);
            // console.log('new metaversefile id 2', {id, importer, result, start_url, s});
            return s;
          } else if (/^\//.test(id)) {

            id = createRelativeFromAbsolutePath(id);
            
            const o = url.parse(id, true);
            // console.log('new metaversefile id 3', {id, importer, start_url, o}, [path.dirname(o.pathname), start_url]);
            o.pathname = path.join(path.dirname(o.pathname), start_url);
            /* if (Array.isArray(components)) {
              o.query.components = encodeURIComponent(JSON.stringify(components));
            } */
            let s = url.format(o);
            if (/^\//.test(s)) {
              s = cwd + s;
            }
            s += _makeHash();
            // console.log('new metaversefile id   4', {id, importer, start_url, o, s}, [path.dirname(o.pathname), start_url]);
            return s;
          } else {
            console.warn('.metaversefile scheme unknown');
            return null;
          }
        } else {
          console.warn('.metaversefile has no "start_url": string', {j, id, s});
          return null;
        }
      } else {
        console.warn('.metaversefile could not be parsed: ' + error.stack);
        return null;
      }
    } else {
      console.warn('.metaversefile could not be loaded');
      return null;
    }
  }
};