"use client";

import { motion } from "framer-motion";

export default function KeywordGroup({
  title,
  items,
  selected,
  toggle,
  delay = 0,
}: {
  title: string;
  items: string[];
  selected: number[];
  toggle: (idx: number) => void;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="space-y-3"
    >
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((k, idx) => (
          <motion.button
            key={k}
            onClick={() => toggle(idx)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: delay + idx * 0.05 }}
            className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all duration-300
              ${
                selected.includes(idx)
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30"
                  : "bg-card text-card-foreground border-border hover:border-primary/50 hover:bg-accent"
              }`}
          >
            {k}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
