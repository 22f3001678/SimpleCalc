import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryPanel } from '../components/MemoryPanel.jsx';

describe('MemoryPanel component', () => {
  const onMemoryAdd = vi.fn();
  const onMemorySubtract = vi.fn();
  const onMemoryRecall = vi.fn();
  const onMemoryClear = vi.fn();

  beforeEach(() => {
    onMemoryAdd.mockClear();
    onMemorySubtract.mockClear();
    onMemoryRecall.mockClear();
    onMemoryClear.mockClear();
  });

  it('renders the stored memory value', () => {
    render(
      <MemoryPanel
        memory={42}
        onMemoryAdd={onMemoryAdd}
        onMemorySubtract={onMemorySubtract}
        onMemoryRecall={onMemoryRecall}
        onMemoryClear={onMemoryClear}
      />,
    );

    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('triggers the correct memory callbacks', () => {
    render(
      <MemoryPanel
        memory={7}
        onMemoryAdd={onMemoryAdd}
        onMemorySubtract={onMemorySubtract}
        onMemoryRecall={onMemoryRecall}
        onMemoryClear={onMemoryClear}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'M+' }));
    fireEvent.click(screen.getByRole('button', { name: 'M-' }));
    fireEvent.click(screen.getByRole('button', { name: 'MR' }));
    fireEvent.click(screen.getByRole('button', { name: 'MC' }));

    expect(onMemoryAdd).toHaveBeenCalledTimes(1);
    expect(onMemorySubtract).toHaveBeenCalledTimes(1);
    expect(onMemoryRecall).toHaveBeenCalledTimes(1);
    expect(onMemoryClear).toHaveBeenCalledTimes(1);
  });
});
