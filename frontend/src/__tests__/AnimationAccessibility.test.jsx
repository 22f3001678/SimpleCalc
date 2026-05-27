import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CalculatorButton } from '../components/CalculatorButton.jsx';
import { CalculatorDisplay } from '../components/CalculatorDisplay.jsx';
import App from '../App.jsx';

const buttonProps = [];
const divProps = [];
const pProps = [];

const stripMotionProps = (props) => {
  const { initial, animate, transition, whileTap, whileHover, ...domProps } = props;
  return domProps;
};

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  const handler = {
    get(target, tag) {
      if (!target[tag]) {
        target[tag] = vi.fn((props) => {
          if (tag === 'button') buttonProps.push(props);
          if (tag === 'div') divProps.push(props);
          if (tag === 'p') pProps.push(props);
          return React.createElement(tag, stripMotionProps(props));
        });
      }
      return target[tag];
    },
  };

  return {
    ...actual,
    motion: new Proxy({}, handler),
  };
});

describe('Animation performance and accessibility', () => {
  beforeEach(() => {
    buttonProps.length = 0;
    divProps.length = 0;
    pProps.length = 0;

    window.matchMedia = vi.fn((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  it('skips motion props for calculator buttons when reduced motion is enabled', () => {
    render(<CalculatorButton label="5" onClick={() => {}} reduceMotion />);

    expect(buttonProps.length).toBeGreaterThan(0);
    expect(buttonProps[0].whileTap).toBeUndefined();
    expect(buttonProps[0].whileHover).toBeUndefined();
    expect(buttonProps[0].transition).toBeUndefined();
  });

  it('disables error bounce and entrance animation when reduced motion is enabled', () => {
    render(<CalculatorDisplay expression="1+1" result="2" error="Invalid" loading={false} reduceMotion />);

    const statusProps = pProps.find((props) => props.className?.includes('text-rose-300'));
    expect(statusProps).toBeDefined();
    expect(statusProps.animate).toEqual({ x: 0, scale: 1 });
    expect(statusProps.transition).toEqual({ duration: 0 });
  });

  it('remains keyboard operable with reduced motion enabled', () => {
    render(<App />);

    fireEvent.keyDown(window, { key: '2' });
    fireEvent.keyDown(window, { key: '+' });
    fireEvent.keyDown(window, { key: '2' });

    const expressionInput = screen.getByLabelText(/Expression/i);
    expect(expressionInput).toHaveValue('2+2');
  });
});
