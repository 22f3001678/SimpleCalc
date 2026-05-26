// Lightweight expression evaluator using shunting-yard + RPN evaluation
// Supports numbers, + - * / ^ parentheses, functions: sin,cos,tan,sqrt,log,ln,exp
// Avoids using eval for safety

const FUNCTIONS = {
  sin: v => Math.sin(v),
  cos: v => Math.cos(v),
  tan: v => Math.tan(v),
  sqrt: v => Math.sqrt(v),
  log: v => Math.log10 ? Math.log10(v) : Math.log(v)/Math.LN10,
  ln: v => Math.log(v),
  exp: v => Math.exp(v)
}

function isNumeric(ch){ return /[0-9.]/.test(ch) }
function isAlpha(ch){ return /[a-zA-Z]/.test(ch) }

function tokenize(s){
  const tokens = []
  let i=0
  while(i<s.length){
    const ch = s[i]
    if(ch === ' ') { i++; continue }
    if(isNumeric(ch)){
      let num = ch; i++
      while(i<s.length && /[0-9.]/.test(s[i])){ num += s[i++]} 
      tokens.push({type:'number', value: parseFloat(num)})
      continue
    }
    if(isAlpha(ch)){
      let id = ch; i++
      while(i<s.length && isAlpha(s[i])) id += s[i++]
      tokens.push({type:'ident', value: id})
      continue
    }
    if(['+','-','*','/','^','(',')','%'].includes(ch)){
      tokens.push({type:'op', value: ch}); i++; continue
    }
    throw new Error('Unexpected char '+ch)
  }
  return tokens
}

const PREC = { '+':1, '-':1, '*':2, '/':2, '%':2, '^':3 }
const RIGHT_ASSOC = {'^': true}

function toRPN(tokens){
  const out = []
  const ops = []
  for(let t of tokens){
    if(t.type === 'number') out.push(t)
    else if(t.type === 'ident') ops.push(t)
    else if(t.type === 'op'){
      const v = t.value
      if(v === '(') { ops.push(t) }
      else if(v === ')'){
        while(ops.length && ops[ops.length-1].value !== '(') out.push(ops.pop())
        ops.pop()
        // if function on top
        if(ops.length && ops[ops.length-1].type === 'ident') out.push(ops.pop())
      } else {
        while(ops.length){
          const top = ops[ops.length-1]
          if(top.type === 'op' && top.value !== '('){
            const p1 = PREC[top.value] || 0
            const p2 = PREC[v] || 0
            if(p1 > p2 || (p1===p2 && !RIGHT_ASSOC[v])){
              out.push(ops.pop()); continue
            }
          }
          break
        }
        ops.push(t)
      }
    }
  }
  while(ops.length) out.push(ops.pop())
  return out
}

function evalRPN(rpn){
  const st = []
  for(const t of rpn){
    if(t.type === 'number') st.push(t.value)
    else if(t.type === 'ident'){
      const name = t.value.toLowerCase()
      if(name === 'pi') st.push(Math.PI)
      else if(name === 'e') st.push(Math.E)
      else if(FUNCTIONS[name]){
        const a = st.pop()
        st.push(FUNCTIONS[name](a))
      } else {
        throw new Error('Unknown identifier '+name)
      }
    } else if(t.type === 'op'){
      const op = t.value
      if(op === '%'){
        const a = st.pop(); st.push(a/100); continue
      }
      const b = st.pop(); const a = st.pop()
      switch(op){
        case '+': st.push(a+b); break
        case '-': st.push(a-b); break
        case '*': st.push(a*b); break
        case '/': st.push(a/b); break
        case '^': st.push(Math.pow(a,b)); break
        default: throw new Error('Unsupported op '+op)
      }
    }
  }
  if(st.length !==1) throw new Error('Invalid expression')
  return st[0]
}

export default function evaluate(expr){
  const tokens = tokenize(expr)
  const rpn = toRPN(tokens)
  return evalRPN(rpn)
}
