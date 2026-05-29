'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';

interface Props {
  isVisible: boolean;
}

export const PageTransition = ({ isVisible }: Props) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0" style={{ background: '#0F1219' }} />
        <div className="absolute inset-0">
          <Image
            src="/transition-bg.svg"
            alt=""
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>
        <motion.div
          className="relative z-10 flex flex-col items-center gap-5"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.1, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div
            className="rounded-3xl p-3 shadow-[0_0_40px_rgba(168,85,247,0.4)]"
            style={{ background: 'linear-gradient(135deg, #171e2e 0%, #0F1219 100%)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={80} height={80}>
              <circle cx="16" cy="6" r="3" fill="#f97316" />
              <circle cx="15" cy="5" r="1" fill="#fdba74" opacity="0.6" />
              <circle cx="10" cy="13" r="1.5" fill="#a855f7" />
              <circle cx="16" cy="13" r="1.5" fill="#a855f7" />
              <circle cx="22" cy="13" r="1.5" fill="#a855f7" />
              <circle cx="7" cy="19" r="1.5" fill="#7c3aed" />
              <circle cx="13" cy="19" r="1.5" fill="#7c3aed" />
              <circle cx="19" cy="19" r="1.5" fill="#7c3aed" />
              <circle cx="25" cy="19" r="1.5" fill="#7c3aed" />
              <rect x="3" y="26" width="4" height="3" rx="1" fill="#22c55e" />
              <rect x="9" y="26" width="4" height="3" rx="1" fill="#eab308" />
              <rect x="15" y="26" width="4" height="3" rx="1" fill="#ef4444" />
              <rect x="21" y="26" width="4" height="3" rx="1" fill="#eab308" />
              <rect x="27" y="26" width="4" height="3" rx="1" fill="#22c55e" />
            </svg>
          </div>

          <span
            className="text-2xl font-bold tracking-[0.3em] uppercase"
            style={{
              background: 'linear-gradient(90deg, #a855f7, #f97316)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Plinko
          </span>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
