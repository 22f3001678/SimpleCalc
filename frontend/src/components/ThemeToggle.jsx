import React from 'react';
import { motion } from 'framer-motion';

export function ThemeToggle({ theme, onToggle, reduceMotion = false }) {
  const motionProps = reduceMotion
    ? { animate: { rotate: theme === 'dark' ? 0 : 180 }, transition: { duration: 0 } }
    : { whileHover: { scale: 1.04 }, whileTap: { scale: 0.96 }, animate: { rotate: theme === 'dark' ? 0 : 180 }, transition: { duration: 0.35, ease: 'easeInOut' } };

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 px-4 py-2 text-sm font-semibold text-slate-100 transition duration-300 ease-in-out hover:border-cyan-400/40 hover:text-cyan-300"
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      {...motionProps}
    >
      {theme === 'dark' ? 'Light mode' : 'Dark mode'}
    </motion.button>
  );
}
