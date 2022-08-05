var jsx = require('jsx-transform');
export default function transformJsx2h() {
  return {
    name: 'transform-jsx-h',
    transform(code, id) {
      
      if (code.indexOf('\/>') > 0 || code.indexOf('<\/') > 0) {

        const result = jsx.fromString(code, {
          factory: 'h'
        });

        console.log('输出结果\n', result);

        return result;
      }
      return code;
    }
  };  
}