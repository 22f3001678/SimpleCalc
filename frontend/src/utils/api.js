const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export async function calculateExpression(expression, angleMode = 'radians') {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${API_BASE_URL}/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expression, angleMode }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.error || 'Calculation API returned an error');
    }

    return response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Calculation request timed out');
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}
