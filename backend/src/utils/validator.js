function isSafeExpression(expr){
  // allow digits, whitespace, basic operators, parentheses, dot, letters for function names
  return /^[0-9+\-*/().%^ eE a-zA-Z,]+$/.test(expr)
}

module.exports = { isSafeExpression }
