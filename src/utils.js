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

/**
 * 是否为数字
 * @param {*} number 
 * @returns 
 */
function isNumberType(number) {
  return typeof number == 'number';
}

// 是否为数组
function isArrayType(array) {
 return typeof array == 'array';
}

export {
  isFunctionType,
  isStringType,
  isArrayType,
  isNumberType
}