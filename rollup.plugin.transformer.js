var jsx = require('jsx-transform');
const fs = require('fs-extra');

export default function transformJsx2h() {
  return {
    name: 'transform-jsx-h',
    load(id) {
      return readFile(id);
    }
  };  
}

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const code = data.toString();
        if (code.indexOf('\/>') > 0 || code.indexOf('<\/') > 0) {

          const result = jsx.fromString(code, {
            factory: 'Tiny.h',
            unknownTagPattern: 'Tiny.c({tag})'
          });
          resolve(result);
        } else {
          resolve(code);
        }
      }
    });
  });
}