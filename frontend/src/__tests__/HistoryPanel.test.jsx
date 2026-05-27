import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HistoryPanel } from '../components/HistoryPanel.jsx';

const historyEntries = [
  { expression: '2+2', result: 4, timestamp: 100 },
  { expression: 'cos(0)', result: 1, timestamp: 200 },
];

describe('HistoryPanel component', () => {
  const onReuse = vi.fn();
  const onClear = vi.fn();
  const onDelete = vi.fn();
  const onCopy = vi.fn();

  beforeEach(() => {
    onReuse.mockClear();
    onClear.mockClear();
    onDelete.mockClear();
    onCopy.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a message when no history is available', () => {
    render(<HistoryPanel history={[]} onReuse={onReuse} onClear={onClear} onDelete={onDelete} onCopy={onCopy} />);

    expect(screen.getByText('Your recent calculations appear here after evaluation.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('shows history items and actions when history exists', () => {
    render(<HistoryPanel history={historyEntries} onReuse={onReuse} onClear={onClear} onDelete={onDelete} onCopy={onCopy} />);

    expect(screen.getByText('2+2')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('cos(0)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });

  it('filters history entries by search input', () => {
    render(<HistoryPanel history={historyEntries} onReuse={onReuse} onClear={onClear} onDelete={onDelete} onCopy={onCopy} />);

    fireEvent.change(screen.getByLabelText('Filter calculation history'), { target: { value: 'cos' } });

    expect(screen.getByText('cos(0)')).toBeInTheDocument();
    expect(screen.queryByText('2+2')).not.toBeInTheDocument();
  });

  it('calls reuse, copy, delete, and clear handlers', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<HistoryPanel history={historyEntries} onReuse={onReuse} onClear={onClear} onDelete={onDelete} onCopy={onCopy} />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Reuse' })[0]);
    expect(onReuse).toHaveBeenCalledWith('2+2');

    fireEvent.click(screen.getAllByRole('button', { name: 'Copy' })[0]);
    expect(onCopy).toHaveBeenCalledWith(historyEntries[0]);

    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    expect(onDelete).toHaveBeenCalledWith(100);

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onClear).toHaveBeenCalled();
  });

  it('supports keyboard navigation and reuse via Enter key', () => {
    const { container } = render(<HistoryPanel history={historyEntries} onReuse={onReuse} onClear={onClear} onDelete={onDelete} onCopy={onCopy} />);

    fireEvent.keyDown(container.firstChild, { key: 'ArrowDown' });
    fireEvent.keyDown(container.firstChild, { key: 'Enter' });

    expect(onReuse).toHaveBeenCalledWith('2+2');
  });
});
