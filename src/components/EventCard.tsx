import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  category: string;
  status: 'upcoming' | 'ongoing' | 'past';
  href?: string;
  delay?: number;
  imageUrl?: string;
}

const statusStyles = {
  upcoming: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  ongoing: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  past: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

const categoryColors: Record<string, string> = {
  Conference: 'text-cyan-400',
  Workshop: 'text-violet-400',
  Hackathon: 'text-yellow-400',
  Webinar: 'text-blue-400',
  Symposium: 'text-rose-400',
  Competition: 'text-orange-400',
};

export default function EventCard({ title, date, location, category, status, href = '#', delay = 0 }: EventCardProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ y: 24, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative glass border border-white/[0.06] hover:border-blue-500/30 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 block"
    >
      {/* Top color accent */}
      <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-transparent" />

      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className={`text-xs font-mono font-medium ${categoryColors[category] ?? 'text-blue-400'}`}>
            {category}
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${statusStyles[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>

        <h3 className="font-display font-semibold text-white text-sm sm:text-base leading-snug mb-4 group-hover:text-blue-200 transition-colors duration-200 line-clamp-2">
          {title}
        </h3>

        {/* Meta */}
        <div className="flex flex-col gap-1.5 mb-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Calendar size={12} className="text-blue-500 flex-shrink-0" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <MapPin size={12} className="text-blue-500 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-end">
          <span className="flex items-center gap-1.5 text-blue-400 text-xs font-medium group-hover:gap-2.5 transition-all duration-200">
            View Details <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </motion.a>
  );
}
