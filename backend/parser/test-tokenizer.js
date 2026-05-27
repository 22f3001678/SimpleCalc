/**
 * Quick tokenizer verification
 */
import { tokenize } from './tokenizer.js';

const testExpr = '5 + 3 * 2';
console.log('Testing: ' + testExpr);
console.log('');

try {
  const tokens = tokenize(testExpr);
  const result = [];
  while (!tokens.isAtEnd()) {
    result.push(tokens.next());
  }
  
  console.log('✓ Tokenization successful!');
  console.log('Tokens:');
  result.forEach(t => {
    console.log(`  ${t.type}: ${t.value}`);
  });
} catch (e) {
  console.log('✗ Error: ' + e.message);
  if (e.position !== undefined) {
    console.log('  Position: ' + e.position);
  }
}
