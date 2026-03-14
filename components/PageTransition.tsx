'use client';

import { motion } from 'framer-motion';
import { pageTransitionVariants, pageTransitionTransition } from '@/lib/animation';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransitionVariants}
      transition={pageTransitionTransition}
    >
      {children}
    </motion.div>
  );
}
