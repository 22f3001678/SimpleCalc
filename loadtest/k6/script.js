import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const payload = JSON.stringify({ expression: '1+1' });
  const params = { headers: { 'Content-Type': 'application/json' } };
  http.post('http://localhost:3001/api/calculate', payload, params);
  sleep(1);
}
