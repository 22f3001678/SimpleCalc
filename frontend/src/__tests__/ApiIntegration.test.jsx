import { describe, it, expect, beforeEach, vi } from 'vitest';
import { calculateExpression } from '../utils/api.js';

describe('API integration utility', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    vi.stubGlobal('setTimeout', window.setTimeout);
    vi.stubGlobal('clearTimeout', window.clearTimeout);
  });

  it('sends a POST request with the expression and angle mode', async () => {
    const json = vi.fn().mockResolvedValue({ result: 8 });
    fetch.mockResolvedValue({ ok: true, json });

    const result = await calculateExpression('4+4', 'degrees');

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/calculate'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expression: '4+4', angleMode: 'degrees' }),
      signal: expect.any(Object),
    });
    expect(result).toEqual({ result: 8 });
  });

  it('throws a timeout error when the request is aborted', async () => {
    const abortError = new Error('Aborted');
    abortError.name = 'AbortError';
    fetch.mockRejectedValue(abortError);

    await expect(calculateExpression('1+1')).rejects.toThrow('Calculation request timed out');
  });
});
