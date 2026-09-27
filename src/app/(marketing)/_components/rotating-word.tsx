'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const WORDS = ['simples', 'rápida', 'organizada', 'completa'];

export function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % WORDS.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-grid text-left align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          animate={{ y: 0, opacity: 1 }}
          className="col-start-1 row-start-1 text-primary"
          exit={{ y: -14, opacity: 0 }}
          initial={{ y: 14, opacity: 0 }}
          key={WORDS[index]}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {WORDS[index]}
        </motion.span>
      </AnimatePresence>
      <span aria-hidden className="invisible col-start-1 row-start-1">
        organizada
      </span>
    </span>
  );
}
