import { motion } from 'framer-motion';


export default function HeroSection() {
  return (
    <section className="relative z-10 flex flex-col items-center pt-16 pb-12 px-4 text-center">
      {/* Logo + badge ring */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 120 }}
        className="relative mb-6 sm:mb-8"
      >
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-2xl blur-2xl bg-blue-500/15 scale-150" />
        {/* Light blue border square */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl p-[2px] bg-blue-400/30 border border-blue-400/50">
          <div className="w-full h-full rounded-2xl bg-surface-800 flex items-center justify-center overflow-hidden relative">
            <img
              src="/files_10355171-2026-05-26T15-59-40-399Z-2_20260512_144200_0001.webp"
              alt="IEEE Gujarat Section Logo"
              className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
            />
          </div>
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="px-2"
      >
        <p className="text-xs font-mono tracking-[0.3em] text-blue-400 uppercase mb-2 sm:mb-3">
          IEEE Gujarat Section
        </p>
        <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-5xl leading-tight mb-3 sm:mb-4 text-white">
          Advancing Technology for Humanity
        </h1>
        <motion.p
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed"
        >
          Connecting engineers, researchers, and innovators across Gujarat to shape the future of technology.
        </motion.p>
      </motion.div>


      {/* Stats row */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.6 }}
        className="grid grid-cols-3 gap-4 sm:gap-8 mt-8 sm:mt-10 text-center px-2"
      >
        {[
          { value: '533,000+', label: 'Members' },
          { value: '224,000+', label: 'Student Members' },
          { value: '3,759+', label: 'Student Branches' },
        ].map(({ value, label }) => (
          <div key={label}>
            <div className="font-display font-bold text-lg sm:text-2xl md:text-3xl text-blue-300">{value}</div>
            <div className="text-slate-500 text-[10px] sm:text-xs mt-1">{label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

