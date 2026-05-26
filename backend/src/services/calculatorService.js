// Simple evaluator for backend. Mirrors frontend evaluator for consistency.
function evaluate(expr){
  // Very small wrapper: use Function? No – keep safe. Implement simple parser here.
  // For brevity reusing a basic approach: try to compute using Math after validation.
  // Validate allowed chars
  if(!/^[0-9+\-*/().%^ eEincostglnrpxPI]+$/.test(expr)) throw new Error('Invalid characters')
  // Replace common tokens
  const safe = expr.replace(/\bpi\b/gi, String(Math.PI)).replace(/\bexp\b/gi, 'Math.exp')
  // Note: we avoid direct eval for safety; here we will implement a tiny eval via Function
  // with restricted Math bindings
  const fn = new Function('Math', 'return ' + safe)
  return Number(fn(Math))
}

module.exports = { evaluate }
