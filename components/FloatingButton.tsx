'use client';

import { motion } from 'framer-motion';
import { floatingButtonVariants } from '@/lib/animation';
import { MessageCircle } from 'lucide-react';

interface FloatingButtonProps {
  href?: string;
  label?: string;
}

export function FloatingButton({ 
  href = 'https://wa.me/1234567890',
  label = 'Chat with us'
}: FloatingButtonProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
      initial="initial"
      animate={['animate', 'pulse']}
      variants={floatingButtonVariants}
    >
      <div className="relative">
        <motion.div
          className="absolute inset-0 bg-green-500 rounded-full blur-lg"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="relative bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer flex items-center justify-center">
          <MessageCircle size={24} />
        </div>
      </div>
    </motion.a>
  );
}
