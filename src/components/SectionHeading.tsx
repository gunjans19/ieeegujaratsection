import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SectionHeadingProps {
  icon: LucideIcon;
  label: string;
  title: string;
  accent?: 'blue' | 'gold';
}

export default function SectionHeading({ icon: Icon, label, title, accent = 'blue' }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-3 mb-6"
    >
      <div className={`
        flex items-center justify-center w-9 h-9 rounded-xl
        ${accent === 'blue' ? 'bg-blue-500/15 text-blue-400' : 'bg-yellow-500/15 text-yellow-400'}
      `}>
        <Icon size={18} strokeWidth={1.8} />
      </div>
      <div>
        <p className={`text-[10px] font-mono tracking-widest uppercase mb-0.5
          ${accent === 'blue' ? 'text-blue-500' : 'text-yellow-500'}`}>
          {label}
        </p>
        <h2 className="font-display font-bold text-lg sm:text-xl text-white leading-tight">{title}</h2>
      </div>
      <div className={`flex-1 h-px ml-2 ${accent === 'blue' ? 'bg-gradient-to-r from-blue-500/30 to-transparent' : 'bg-gradient-to-r from-yellow-500/30 to-transparent'}`} />
    </motion.div>
  );
}
