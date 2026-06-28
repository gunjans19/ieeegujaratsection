import { motion } from 'framer-motion';
import { Linkedin, Instagram, Youtube, MessageCircle } from 'lucide-react';

const socials = [
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/ieee-gujarat-section/posts/?feedView=all',
    color: 'hover:text-sky-400 hover:bg-sky-500/10 hover:border-sky-500/40',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    href: 'https://www.instagram.com/ieeegujaratsection/',
    color: 'hover:text-pink-400 hover:bg-pink-500/10 hover:border-pink-500/40',
  },
  {
    icon: Youtube,
    label: 'YouTube',
    href: 'https://youtube.com/@ieee-gujarat',
    color: 'hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/40',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    href: 'https://chat.whatsapp.com/Dob77w7XweTKEaQVkqFL2F',
    color: 'hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/40',
  },
];

export default function SocialStrip() {
  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap"
    >
      {socials.map(({ icon: Icon, label, href, color }, i) => (
        <motion.a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0.5, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.4, type: 'spring' }}
          whileHover={{ scale: 1.12, y: -3 }}
          whileTap={{ scale: 0.92 }}
          title={label}
          className={`
            flex flex-col items-center gap-2 p-4 rounded-2xl min-w-[88px]
            glass border border-white/[0.06] text-slate-400
            transition-all duration-300 ${color}
          `}
        >
          <Icon size={24} strokeWidth={1.8} />
          <span className="text-[10px] font-mono tracking-wide uppercase">{label}</span>
        </motion.a>
      ))}
    </motion.div>
  );
}
