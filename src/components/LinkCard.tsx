import { motion } from 'framer-motion';
import { LucideIcon, ExternalLink, ArrowRight } from 'lucide-react';

interface LinkCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  href: string;
  accent?: 'blue' | 'gold' | 'cyan' | 'green' | 'red';
  featured?: boolean;
  delay?: number;
  badge?: string;
}

const accentMap = {
  blue: {
    icon: 'text-blue-400',
    border: 'hover:border-blue-500/50',
    glow: 'hover:shadow-blue-500/10',
    bg: 'group-hover:bg-blue-500/10',
    badge: 'bg-blue-500/20 text-blue-300',
    arrow: 'text-blue-400',
  },
  gold: {
    icon: 'text-yellow-400',
    border: 'hover:border-yellow-500/50',
    glow: 'hover:shadow-yellow-500/10',
    bg: 'group-hover:bg-yellow-500/10',
    badge: 'bg-yellow-500/20 text-yellow-300',
    arrow: 'text-yellow-400',
  },
  cyan: {
    icon: 'text-cyan-400',
    border: 'hover:border-cyan-500/50',
    glow: 'hover:shadow-cyan-500/10',
    bg: 'group-hover:bg-cyan-500/10',
    badge: 'bg-cyan-500/20 text-cyan-300',
    arrow: 'text-cyan-400',
  },
  green: {
    icon: 'text-emerald-400',
    border: 'hover:border-emerald-500/50',
    glow: 'hover:shadow-emerald-500/10',
    bg: 'group-hover:bg-emerald-500/10',
    badge: 'bg-emerald-500/20 text-emerald-300',
    arrow: 'text-emerald-400',
  },
  red: {
    icon: 'text-rose-400',
    border: 'hover:border-rose-500/50',
    glow: 'hover:shadow-rose-500/10',
    bg: 'group-hover:bg-rose-500/10',
    badge: 'bg-rose-500/20 text-rose-300',
    arrow: 'text-rose-400',
  },
};

export default function LinkCard({
  icon: Icon,
  title,
  subtitle,
  href,
  accent = 'blue',
  featured = false,
  delay = 0,
  badge,
}: LinkCardProps) {
  const colors = accentMap[accent];

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      className={`
        group relative flex items-center gap-4 p-5 sm:p-6 md:p-7 rounded-2xl
        glass glass-hover link-card-shine
        border transition-all duration-300
        ${colors.border} hover:shadow-2xl ${colors.glow}
        ${featured ? 'border-blue-500/30 shadow-lg shadow-blue-500/5' : 'border-white/[0.06]'}
      `}
    >
      {/* Icon container */}
      <div className={`
        relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center
        bg-white/5 ${colors.bg} transition-colors duration-300
      `}>
        <Icon size={28} className={colors.icon} strokeWidth={1.8} />
        {featured && (
          <div className="absolute inset-0 rounded-xl border border-blue-500/30" />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-display font-semibold text-white text-sm sm:text-base md:text-lg leading-tight">
            {title}
          </span>
          {badge && (
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${colors.badge}`}>
              {badge}
            </span>
          )}
        </div>
        <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-snug line-clamp-2">{subtitle}</p>
      </div>

      {/* Arrow */}
      <motion.div
        className={`flex-shrink-0 ${colors.arrow} opacity-0 group-hover:opacity-100 transition-all duration-300`}
        initial={{ x: -8, opacity: 0 }}
        whileHover={{ x: 2 }}
        group-hover={{ opacity: 1 }}
      >
        <ArrowRight size={18} strokeWidth={2.5} />
      </motion.div>

      {/* Subtle external icon always visible */}
      <ExternalLink size={13} className="absolute top-3 right-3 text-white/20 group-hover:text-white/40 transition-colors duration-200" />
    </motion.a>
  );
}
