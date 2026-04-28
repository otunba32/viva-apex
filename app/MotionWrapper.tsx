'use client'
import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  children: React.ReactNode
  pathname: string
}

export default function MotionWrapper({ children, pathname }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}