// Framer Motion animation variants for consistent animations across the app
import type { Variants } from "framer-motion"

export const pageTransitionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const pageTransitionTransition = {
  duration: 0.4,
  ease: "easeInOut" as const,
};

export const staggerContainerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: { opacity: 0 },
};

export const staggerItemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
  exit: { opacity: 0, y: -20 },
};

export const cardHoverVariants = {
  initial: { scale: 1, y: 0 },
  hover: { scale: 1.05, y: -8, transition: { duration: 0.3 } },
};

export const heroBannerVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
} satisfies Variants

export const floatingButtonVariants = {
  initial: { scale: 0 },
  animate: {
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
  pulse: {
    scale: [1, 1.1, 1],
    transition: { duration: 2, repeat: Infinity },
  },
} satisfies Variants

export const fadeInUpVariants = {
  initial: { opacity: 0, y: 30 },
  animate: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: "easeOut" },
  }),
} satisfies Variants

export const slideInLeftVariants = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const slideInRightVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
