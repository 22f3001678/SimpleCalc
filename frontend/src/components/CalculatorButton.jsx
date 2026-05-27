import { motion } from 'framer-motion';

export function CalculatorButton({ label, variant = 'primary', onClick }) {
  const baseStyles =
    'rounded-3xl border px-4 py-4 text-base font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-400/60';
  const variants = {
    primary: 'border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700',
    accent: 'border-cyan-400 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20',
    danger: 'border-rose-500 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20',
    action: 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800',
  };

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15 }}
      className={`${baseStyles} ${variants[variant] || variants.primary}`}
      onClick={onClick}
    >
      {label}
    </motion.button>
  );
}
