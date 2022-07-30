/**
 * 是否为函数
 * @param {*} func 
 * @returns 
 */
function isFunctionType(func) {
  return typeof func == 'function';
}

/**
 * 是否为字符串
 * @param {*} string 
 * @returns 
 */
function isStringType(string) {
  return typeof string == 'string';
}

export {
  isFunctionType,
  isStringType
}