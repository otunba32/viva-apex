'use client';

import { motion } from 'framer-motion';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animation';

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerContainer({ children, className = '' }: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      variants={staggerContainerVariants}
      initial="initial"
      whileInView="animate"
      exit="exit"
      viewport={{ once: true, amount: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
  return (
    <motion.div className={className} variants={staggerItemVariants}>
      {children}
    </motion.div>
  );
}
