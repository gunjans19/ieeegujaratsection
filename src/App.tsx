import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Linkedin, MessageCircle, Globe, Network, Calendar, ChevronUp, Instagram, Youtube, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from './lib/supabase';

const phrases = [
  'Connecting Technology, Innovation & Professionals',
  'Empowering Engineers Across Gujarat',
  'Building the Future of Technology'
];

export default function App() {
  const navigate = useNavigate();
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [logoType, setLogoType] = useState<'blue' | 'white'>('blue');
  const [links, setLinks] = useState<any[]>([
    { icon: Linkedin, label: 'LinkedIn', description: 'Connect with us professionally', href: 'https://www.linkedin.com/company/ieee-gujarat-section/', isExternal: true },
    { icon: MessageCircle, label: 'WhatsApp Community', description: 'Join our active discussion group', href: 'https://chat.whatsapp.com/', isExternal: true },
    { icon: Globe, label: 'Official Website', description: 'Explore IEEE Gujarat Section', href: 'https://ieeegujaratsection.org/', isExternal: true },
    { icon: Network, label: 'Membership Portal', description: 'Join or renew IEEE membership', href: 'https://www.ieee.org/', isExternal: true },
    { icon: Calendar, label: 'Upcoming Events', description: 'Conferences, workshops & more', href: '/events', isExternal: false },
  ]);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const localLinks = localStorage.getItem('admin_links');
        let data;
        if (localLinks) {
          data = JSON.parse(localLinks);
        } else {
          const { data: dbData, error } = await supabase
            .from('site_content')
            .select('*')
            .eq('section', 'links')
            .order('key');
          if (!error && dbData && dbData.length > 0) {
            data = dbData;
          }
        }

        if (data) {
          const iconMap: Record<string, any> = {
            Linkedin, MessageCircle, Globe, Network, Calendar
          };
          const mapped = data.map((item: any) => ({
            icon: iconMap[item.content.icon] || Globe,
            label: item.content.label,
            description: item.content.description,
            href: item.content.url,
            isExternal: !item.content.url.startsWith('/'),
          }));
          setLinks(mapped);
        }
      } catch (err) {
        console.error('Error fetching links:', err);
      }
    };

    fetchLinks();
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const logoTimer = setInterval(() => {
      setLogoType((prev) => (prev === 'blue' ? 'white' : 'blue'));
    }, 2000);
    return () => clearInterval(logoTimer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const current = phrases[currentPhrase];

      if (!isDeleting) {
        if (charIndex < current.length) {
          setDisplayedText(current.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        if (charIndex > 0) {
          setDisplayedText(current.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setCurrentPhrase((currentPhrase + 1) % phrases.length);
        }
      }
    }, isDeleting ? 30 : 60);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, currentPhrase]);

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: 'linear-gradient(-45deg, #001a2e, #003050, #001a2e, #002040)', backgroundSize: '400% 400%' }}>
      {/* 3D Background Grid with Perspective */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `
          radial-gradient(ellipse at top, rgba(0,150,255,0.1) 0%, transparent 50%),
          radial-gradient(ellipse at bottom, rgba(0,100,200,0.08) 0%, transparent 50%)
        `,
        transform: 'perspective(500px) rotateX(60deg) translateY(-50%)',
        transformOrigin: 'center top',
        opacity: 0.4,
      }}>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `
            linear-gradient(rgba(0,150,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,150,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }} />
      </div>

      {/* Floating 3D Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute w-96 h-96 rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(0,200,255,0.15) 0%, transparent 70%)',
            top: '10%',
            left: '-10%',
            animationDelay: '0s',
          }}
        />
        <div
          className="absolute w-80 h-80 rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(100,150,255,0.12) 0%, transparent 70%)',
            bottom: '10%',
            right: '-5%',
            animationDelay: '2s',
          }}
        />
        <div
          className="absolute w-64 h-64 rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(50,100,200,0.1) 0%, transparent 70%)',
            top: '50%',
            left: '60%',
            animationDelay: '4s',
          }}
        />
      </div>

      {/* Particles Canvas */}
      <ParticleCanvas />

      {/* Mouse Glow */}
      <MouseGlow />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="text-center px-4 pt-8 pb-12">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center justify-center mx-auto -mb-6 sm:-mb-10 md:-mb-16"
            style={{
              animation: 'float 4s ease-in-out infinite',
            }}
          >
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 aspect-square flex items-center justify-center">
              <motion.img
                src="/2_20260512_144200_0001.png"
                alt="IEEE Gujarat Section Blue"
                className="absolute inset-0 w-full h-full object-contain"
                animate={{ opacity: logoType === 'blue' ? 1 : 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{ filter: 'drop-shadow(0 0 16px rgba(0,180,255,0.45))' }}
              />
              <motion.img
                src="/ieee_logo_white.png"
                alt="IEEE Gujarat Section White"
                className="absolute inset-0 w-full h-full object-contain"
                animate={{ opacity: logoType === 'white' ? 1 : 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{ filter: 'drop-shadow(0 0 16px rgba(255,255,255,0.25))' }}
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl sm:text-5xl md:text-7xl font-extrabold mb-4"
          >
            IEEE Gujarat Section
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-2 sm:mb-3 text-[11px] min-[375px]:text-xs min-[410px]:text-sm sm:text-lg md:text-xl opacity-80 h-7 sm:h-8 px-2 whitespace-nowrap overflow-hidden text-ellipsis"
          >
            <span>{displayedText}</span>
            <span className="inline-block w-0.5 h-[1.1em] bg-cyan-400 ml-1 align-middle animate-pulse" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="italic text-cyan-200 opacity-80 text-sm sm:text-base mt-3 sm:mt-4 mb-4"
          >
            Advancing Technology for Humanity
          </motion.p>

          <SlideshowSection />

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 mt-10 sm:mt-12 max-w-3xl mx-auto px-2"
          >
            <div className="text-center">
              <div className="text-base min-[375px]:text-xl sm:text-2xl md:text-4xl font-bold text-cyan-300 leading-tight">533,000+</div>
              <p className="text-[10px] min-[375px]:text-xs sm:text-sm opacity-70 mt-1 sm:mt-2">Members</p>
            </div>
            <div className="text-center">
              <div className="text-base min-[375px]:text-xl sm:text-2xl md:text-4xl font-bold text-cyan-300 leading-tight">224,000+</div>
              <p className="text-[10px] min-[375px]:text-xs sm:text-sm opacity-70 mt-1 sm:mt-2">Student Members</p>
            </div>
            <div className="text-center">
              <div className="text-base min-[375px]:text-xl sm:text-2xl md:text-4xl font-bold text-cyan-300 leading-tight">3,759+</div>
              <p className="text-[10px] min-[375px]:text-xs sm:text-sm opacity-70 mt-1 sm:mt-2">Student Branches</p>
            </div>
          </motion.div>
        </header>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent max-w-3xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto mb-12" />

        {/* Main Links */}
        <main className="max-w-3xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {links.map((link, i) => {
              const Icon = link.icon;
              const isFullWidth = i === 0;
              const handleClick = (e: React.MouseEvent) => {
                if (!link.isExternal) {
                  e.preventDefault();
                  navigate(link.href);
                }
              };
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  {...(link.isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
                  onClick={handleClick}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
                  className={`glass-card flex items-center gap-4 px-5 py-4 sm:px-6 sm:py-5 rounded-2xl group hover:translate-y-[-4px] transition-all duration-300 cursor-pointer ${
                    isFullWidth ? 'sm:col-span-2' : ''
                  }`}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg text-white mb-0.5">{link.label}</h3>
                    <p className="text-slate-400 text-xs sm:text-sm">{link.description}</p>
                  </div>
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-cyan-400" />
                </motion.a>
              );
            })}
          </div>
        </main>

        {/* About Section */}
        <section className="max-w-3xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-3xl overflow-hidden flex flex-col md:flex-row items-stretch"
            style={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <img className="w-full md:w-2/5 h-56 md:h-auto object-cover" src="https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800" alt="IEEE Event" />
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">About IEEE Gujarat Section</h2>
              <p className="text-sm sm:text-base opacity-80 leading-relaxed text-slate-300">
                IEEE Gujarat Section is a vibrant community of engineers, researchers, innovators, and students dedicated to advancing technology across Gujarat. Through conferences, workshops, hackathons, networking events, and technical collaborations, we empower the next generation of leaders and innovators.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Events Section */}
        <section className="max-w-3xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-3xl overflow-hidden cursor-pointer hover:translate-y-[-4px] transition-all duration-300 flex flex-col md:flex-row-reverse items-stretch"
            onClick={() => navigate('/events')}
            style={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <img className="w-full md:w-2/5 h-56 md:h-auto object-cover" src="https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Conference" />
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">Upcoming Events</h2>
              <p className="text-sm sm:text-base opacity-80 leading-relaxed text-slate-300">
                Stay connected with our latest technical talks, global conferences, innovation challenges, leadership summits, and student activities designed to foster collaboration and professional growth.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Committee Section
        <section className="max-w-3xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-3xl overflow-hidden cursor-pointer hover:translate-y-[-4px] transition-all duration-300 flex flex-col md:flex-row items-stretch"
            onClick={() => navigate('/committee')}
            style={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <img className="w-full md:w-2/5 h-56 md:h-auto object-cover" src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Committee" />
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">Section Committee</h2>
              <p className="text-sm sm:text-base opacity-80 leading-relaxed text-slate-300">
                Meet the executive committee members, advisors, and volunteers leading the operations, planning, and strategic initiatives of the IEEE Gujarat Section.
              </p>
            </div>
          </motion.div>
        </section>
        */}

        {/* Announcement Section */}
        <AnnouncementSection />

        {/* Connect Section */}
        <ConnectSection />

        {/* Footer */}
        <footer className="text-center px-4 pb-12 pt-8 border-t border-white/10">
          <p className="text-sm opacity-70 mb-2">contact@ieeegujarat.org</p>
          <p className="text-xs opacity-50">© 2026 IEEE Gujarat Section. Developed by Gunjan Sharma. All rights reserved.</p>
        </footer>

        {/* Scroll to Top */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full flex items-center justify-center hover:text-cyan-300 transition-colors"
              style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <ChevronUp size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 20px rgba(0,150,255,0.2); }
          50% { box-shadow: 0 0 40px rgba(0,150,255,0.45); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        div[style*="linear-gradient(-45deg"] {
          animation: gradientShift 15s ease infinite;
          background-size: 400% 400%;
        }
      `}</style>
    </div>
  );
}

function AnnouncementSection() {
  const [current, setCurrent] = useState(0);
  const [announcements, setAnnouncements] = useState<{ text: string; link?: string }[]>([
    { text: 'IEEE Gujarat Section Annual General Meeting — June 30, 2025' },
    { text: 'Call for Papers: IEEE INDICON 2025 — Deadline August 31' },
    { text: 'Student Branch Excellence Awards Nominations Now Open' },
    { text: 'New Technical Chapter: IEEE Aerospace & Electronic Systems Society' },
  ]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      // Try local storage first
      const local = localStorage.getItem('admin_announcements');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (parsed.length > 0) {
            const items = parsed.map((item: any) => ({
              text: item.content.text,
              link: item.content.link,
            }));
            setAnnouncements(items);
            return;
          }
        } catch (e) {
          console.error('Error parsing local announcements:', e);
        }
      }

      // Supabase fallback
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('*')
          .eq('section', 'announcements')
          .order('updated_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const items = data.map((item: any) => ({
            text: item.content.text,
            link: item.content.link,
          }));
          setAnnouncements(items);
        }
      } catch (err) {
        console.error('Error fetching announcements:', err);
      }
    };

    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (announcements.length === 0) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % announcements.length), 4000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const activeAnn = announcements[current];

  return (
    <section className="max-w-3xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-card rounded-3xl p-6 md:p-8 border border-yellow-500/20"
        style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex items-center justify-center w-2 h-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400" />
          </div>
          <span className="text-xs font-mono tracking-widest text-yellow-400 uppercase">Announcements</span>
        </div>

        <div className="relative h-16 sm:h-12 overflow-hidden mb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center"
            >
              {activeAnn && activeAnn.link ? (
                <a
                  href={activeAnn.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-sm md:text-base font-medium leading-snug hover:text-yellow-400 transition-colors underline decoration-yellow-400/30 hover:decoration-yellow-400 underline-offset-4 decoration-dotted flex items-center gap-1.5 cursor-pointer group"
                >
                  <span>{activeAnn.text}</span>
                  <span className="inline-block transform group-hover:translate-x-1 transition-transform">→</span>
                </a>
              ) : (
                <p className="text-white text-sm md:text-base font-medium leading-snug">
                  {activeAnn ? activeAnn.text : ''}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex gap-1.5">
          {announcements.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === current ? 'w-5 bg-yellow-400' : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function ConnectSection() {
  const socialLinks = [
    { Icon: Linkedin, href: 'https://www.linkedin.com/company/ieee-gujarat-section/', label: 'LinkedIn' },
    { Icon: Instagram, href: 'https://www.instagram.com/ieeegujaratsection?igsh=YWVnYnkwMDhic3B3', label: 'Instagram' },
    { Icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <section className="max-w-3xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h3 className="text-2xl md:text-3xl font-bold mb-2 text-white">Connect & Follow Us</h3>
        <p className="text-slate-400 text-sm md:text-base mb-8">Join our community across social platforms</p>

        <div className="flex justify-center gap-4 md:gap-6">
          {socialLinks.map(({ Icon, href, label }, i) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full glass-card flex items-center justify-center hover:text-cyan-300 hover:scale-110 transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              title={label}
            >
              <Icon className="w-6 h-6 md:w-7 md:h-7" />
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function ParticleCanvas() {

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: { x: number, y: number, r: number, dx: number, dy: number }[] = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4
      });
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,200,255,0.25)';
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,180,255,${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return null;
}

function MouseGlow() {
  useEffect(() => {
    const glow = document.createElement('div');
    glow.id = 'mouse-glow';
    glow.style.position = 'fixed';
    glow.style.width = '500px';
    glow.style.height = '500px';
    glow.style.borderRadius = '50%';
    glow.style.background = 'radial-gradient(circle, rgba(0,180,255,0.08) 0%, transparent 70%)';
    glow.style.pointerEvents = 'none';
    glow.style.zIndex = '1';
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX - 250 + 'px';
      glow.style.top = e.clientY - 250 + 'px';
    });

    return () => {
      glow.remove();
    };
  }, []);

  return null;
}

function SlideshowSection() {
  const [slides, setSlides] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const local = localStorage.getItem('admin_gallery');
    if (local) {
      setSlides(JSON.parse(local));
    } else {
      const defaultSlides = [
        { id: 'slide-1', imageUrl: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'SAMPARK 2026' },
        { id: 'slide-2', imageUrl: 'https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'IEEE Gujarat Section Technical Congress' },
        { id: 'slide-3', imageUrl: 'https://images.pexels.com/photos/1709003/pexels-photo-1709003.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Annual General Meeting' },
      ];
      setSlides(defaultSlides);
      localStorage.setItem('admin_gallery', JSON.stringify(defaultSlides));
    }
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 1500); // Auto-change every 1.5 seconds!
    return () => clearInterval(interval);
  }, [slides.length]);

  const handlePrev = () => {
    if (slides.length === 0) return;
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    if (slides.length === 0) return;
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  if (slides.length === 0) return null;

  const activeSlide = slides[current];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.6 }}
      className="max-w-3xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto rounded-3xl overflow-hidden relative shadow-2xl mt-10 border border-white/10 group aspect-[21/9] sm:aspect-[16/7] md:aspect-[2.2/1] select-none"
    >
      {/* Slide Image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={activeSlide.imageUrl}
          alt={activeSlide.caption}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Dark overlay at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

      {/* Slide caption */}
      <div className="absolute bottom-5 sm:bottom-6 left-6 right-6 text-left pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.h2
            key={current}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-white text-lg sm:text-2xl md:text-3xl font-extrabold tracking-wide uppercase drop-shadow-md"
          >
            {activeSlide.caption}
          </motion.h2>
        </AnimatePresence>
      </div>

      {/* Left Navigation Arrow */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Right Navigation Arrow */}
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <ChevronRight size={20} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 right-6 flex gap-1.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === current ? 'w-6 bg-cyan-400' : 'w-2 bg-white/30'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
