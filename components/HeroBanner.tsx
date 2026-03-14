'use client';

import { motion } from 'framer-motion';
import { heroBannerVariants, fadeInUpVariants } from '@/lib/animation';

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  onCTA?: () => void;
  backgroundImage?: string;
}

export function HeroBanner({
  title,
  subtitle,
  ctaText,
  onCTA,
  backgroundImage,
}: HeroBannerProps) {
  return (
    <motion.section
      className="relative w-full h-96 overflow-hidden rounded-2xl"
      style={
        backgroundImage
          ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : {}
      }
    >
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/40" />

      <div className="relative h-full flex flex-col items-center justify-center px-6">
        <motion.h1
          variants={fadeInUpVariants}
          initial="initial"
          animate="animate"
          custom={0}
          className="text-4xl md:text-5xl font-bold text-white text-center text-balance mb-4"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            variants={fadeInUpVariants}
            initial="initial"
            animate="animate"
            custom={0.1}
            className="text-lg md:text-xl text-slate-200 text-center text-balance mb-8 max-w-2xl"
          >
            {subtitle}
          </motion.p>
        )}

        {ctaText && (
          <motion.button
            variants={fadeInUpVariants}
            initial="initial"
            animate="animate"
            custom={0.2}
            onClick={onCTA}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            {ctaText}
          </motion.button>
        )}
      </div>
    </motion.section>
  );
}
