import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function FooterSection() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative z-10 mt-16 pb-10 px-4"
    >
      {/* Divider */}
      <div className="max-w-lg mx-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Bottom */}
        <div className="text-center">
          <p className="text-slate-600 text-xs font-mono">
            &copy; {new Date().getFullYear()} IEEE Gujarat Section. All rights reserved.
          </p>
          <p className="text-slate-700 text-[11px] mt-1.5 flex items-center justify-center gap-1">
            Made with <Heart size={10} className="text-rose-500 fill-rose-500" /> for the engineering community
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
