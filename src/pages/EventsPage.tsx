import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Clock, ExternalLink, Filter, Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const allEvents = [
  {
    id: 1,
    title: 'IEEE INDICON 2025',
    subtitle: 'International Conference on Industrial Technology',
    date: 'Dec 12-14, 2025',
    time: '9:00 AM - 6:00 PM IST',
    location: 'Ahmedabad, Gujarat',
    category: 'Conference',
    status: 'upcoming' as const,
    description: 'Premier international conference bringing together researchers, industry professionals, and academicians to discuss advances in industrial technology.',
    registrationLink: '#',
  },
  {
    id: 2,
    title: 'AI/ML Workshop',
    subtitle: 'From Foundations to Large Language Models',
    date: 'Jun 8, 2025',
    time: '10:00 AM - 5:00 PM IST',
    location: 'IIT Gandhinagar',
    category: 'Workshop',
    status: 'upcoming' as const,
    description: 'Hands-on workshop covering machine learning fundamentals, neural networks, and practical applications of LLMs.',
    registrationLink: '#',
  },
  {
    id: 3,
    title: 'IEEE Gujarat Hackathon 2025',
    subtitle: 'Smart Cities Edition',
    date: 'Jul 19-20, 2025',
    time: '36 Hours',
    location: 'DAIICT, Gandhinagar',
    category: 'Hackathon',
    status: 'upcoming' as const,
    description: 'Annual hackathon focused on developing innovative solutions for smart city challenges using IoT, AI, and sustainable technologies.',
    registrationLink: '#',
  },
  {
    id: 4,
    title: 'Power Electronics Symposium',
    subtitle: 'Renewable Energy Integration',
    date: 'Aug 5, 2025',
    time: '2:00 PM - 5:00 PM IST',
    location: 'Online - IEEE Webex',
    category: 'Webinar',
    status: 'upcoming' as const,
    description: 'Expert talks on power electronics, renewable energy integration, and grid modernization.',
    registrationLink: '#',
  },
  {
    id: 5,
    title: 'IEEE Robotics Workshop',
    subtitle: 'ROS & Autonomous Systems',
    date: 'Sep 15, 2025',
    time: '9:00 AM - 4:00 PM IST',
    location: 'PDPU, Gandhinagar',
    category: 'Workshop',
    status: 'upcoming' as const,
    description: 'Practical workshop on Robot Operating System (ROS), sensor integration, and autonomous navigation.',
    registrationLink: '#',
  },
  {
    id: 6,
    title: 'Women in Engineering (WIE) Conference',
    subtitle: 'Celebrating Women in Engineering',
    date: 'Oct 10, 2025',
    time: '10:00 AM - 4:00 PM IST',
    location: 'CHARUSAT, Anand',
    category: 'Conference',
    status: 'upcoming' as const,
    description: 'Annual conference celebrating women in engineering with keynote sessions, networking, and career guidance.',
    registrationLink: '#',
  },
  {
    id: 7,
    title: 'IEEE Day Celebration 2025',
    subtitle: 'Global Anniversary Celebration',
    date: 'Oct 7, 2025',
    time: '5:00 PM - 8:00 PM IST',
    location: 'Virtual & Multiple Venues',
    category: 'Event',
    status: 'upcoming' as const,
    description: 'Global celebration of IEEE anniversary with technical talks, awards, and networking.',
    registrationLink: '#',
  },
  {
    id: 8,
    title: 'Cybersecurity Summit',
    subtitle: 'Securing the Digital Future',
    date: 'Nov 22, 2025',
    time: '9:00 AM - 5:00 PM IST',
    location: 'IITRAM, Ahmedabad',
    category: 'Conference',
    status: 'upcoming' as const,
    description: 'Summit on cybersecurity challenges, ethical hacking, and best practices for organizations.',
    registrationLink: '#',
  },
];

const categories = ['All', 'Conference', 'Workshop', 'Hackathon', 'Webinar', 'Event'];

const categoryColors: Record<string, { text: string; bg: string; border: string }> = {
  Conference: { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  Workshop: { text: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/30' },
  Hackathon: { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  Webinar: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  Event: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
};

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [events, setEvents] = useState<any[]>(allEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const localEvents = localStorage.getItem('admin_events');
        if (localEvents) {
          const parsed = JSON.parse(localEvents);
          const mapped = parsed.map((e: any) => ({
            id: e.id,
            title: e.title,
            subtitle: e.category,
            date: e.date,
            time: e.time,
            location: e.location,
            category: e.category,
            status: e.status || 'upcoming',
            description: e.description,
            registrationLink: e.registration_link || '#',
          }));
          setEvents(mapped);
          return;
        }

        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped = data.map((e: any) => ({
            id: e.id,
            title: e.title,
            subtitle: e.category,
            date: e.date,
            time: e.time,
            location: e.location,
            category: e.category,
            status: e.status || 'upcoming',
            description: e.description,
            registrationLink: e.registration_link || '#',
          }));
          setEvents(mapped);
          localStorage.setItem('admin_events', JSON.stringify(data));
        }
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
  }, []);

  const getCategoryCount = (category: string) => {
    if (category === 'All') return events.length;
    return events.filter(e => e.category === category).length;
  };

  const filteredEvents = events.filter((e) => {
    const matchesCategory = activeCategory === 'All' || e.category === activeCategory;
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{
      background: 'linear-gradient(-45deg, #001a2e, #003050, #001a2e, #002040)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
    }}>
      {/* Particles Canvas */}
      <ParticleCanvas />

      {/* Mouse Glow */}
      <MouseGlow />

      {/* 3D Background Grid */}
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

      {/* Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full animate-pulse" style={{
          background: 'radial-gradient(circle, rgba(0,200,255,0.15) 0%, transparent 70%)',
          top: '10%', left: '-10%',
        }} />
        <div className="absolute w-80 h-80 rounded-full animate-pulse" style={{
          background: 'radial-gradient(circle, rgba(100,150,255,0.12) 0%, transparent 70%)',
          bottom: '10%', right: '-5%', animationDelay: '2s',
        }} />
      </div>

      {/* Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 sm:mb-12"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors duration-200 mb-6 text-sm"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3">
            Upcoming <span className="text-cyan-400">Events</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl">
            Discover workshops, conferences, hackathons, and technical sessions organized by IEEE Gujarat Section.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="relative mb-6"
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search events by title, description, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-cyan-500/80 focus:bg-white/[0.08] focus:outline-none transition-all duration-300 text-sm sm:text-base"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-3">
            <Filter size={14} className="text-slate-500" />
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wide">Filter by Category</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const colors = categoryColors[cat];
              const count = getCategoryCount(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat
                      ? colors
                        ? `${colors.bg} ${colors.text} border ${colors.border}`
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-white/5 border border-white/[0.06] text-slate-400 hover:border-white/20 hover:text-slate-300'
                  }`}
                >
                  {cat} <span className="opacity-60 text-xs ml-1 font-mono">({count})</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredEvents.map((event, i) => (
            <EventCard
              key={event.id}
              event={event}
              delay={i * 0.05}
              onClick={() => setSelectedEvent(event)}
            />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-slate-500">No events found matching your query.</p>
          </motion.div>
        )}
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl z-10 border border-white/10"
              style={{
                background: 'linear-gradient(135deg, #020b18 0%, #051930 100%)',
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all z-20"
              >
                <X size={18} />
              </button>

              {/* Header Event Color Strip */}
              <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-transparent" />

              <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-xs font-mono font-medium px-3 py-1 rounded-full ${categoryColors[selectedEvent.category]?.bg || 'bg-white/5'} ${categoryColors[selectedEvent.category]?.text || 'text-white'}`}>
                    {selectedEvent.category}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {selectedEvent.status}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-tight">
                  {selectedEvent.title}
                </h2>
                {selectedEvent.subtitle && (
                  <p className="text-cyan-400 text-sm font-medium mb-6">{selectedEvent.subtitle}</p>
                )}

                <div className="h-px bg-white/10 w-full mb-6" />

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-3 text-slate-300">
                    <Calendar size={18} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Date</p>
                      <p className="text-sm font-medium">{selectedEvent.date}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-slate-300">
                    <Clock size={18} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Time</p>
                      <p className="text-sm font-medium">{selectedEvent.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-slate-300 sm:col-span-2">
                    <MapPin size={18} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Location</p>
                      <p className="text-sm font-medium">{selectedEvent.location}</p>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/10 w-full mb-6" />

                <div className="mb-8">
                  <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider mb-2">Description</h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                    {selectedEvent.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={selectedEvent.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 flex-1 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-cyan-500/20"
                  >
                    Register for this Event
                    <ExternalLink size={16} />
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(null)}
                    className="py-3.5 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-medium text-sm transition-all border border-white/10"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

function EventCard({ event, delay, onClick }: { event: any; delay: number; onClick: () => void }) {
  const colors = categoryColors[event.category] ?? categoryColors.Event;

  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 cursor-pointer group flex flex-col justify-between"
      style={{
        background: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <div>
        {/* Top accent line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-transparent rounded-full mb-4" />

        {/* Category + Status */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-mono font-medium px-3 py-1 rounded-full ${colors.bg} ${colors.text}`}>
            {event.category}
          </span>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full">
            {event.status}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-white text-base sm:text-lg leading-snug mb-1 group-hover:text-cyan-400 transition-colors">
          {event.title}
        </h3>
        {event.subtitle && <p className="text-slate-500 text-xs sm:text-sm mb-3 truncate">{event.subtitle}</p>}

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Meta */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm">
            <Calendar size={14} className="text-cyan-500 flex-shrink-0" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm">
            <Clock size={14} className="text-cyan-500 flex-shrink-0" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm">
            <MapPin size={14} className="text-cyan-500 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <a
        href={event.registrationLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-400 font-medium text-sm transition-all duration-200 border border-cyan-500/20 hover:border-cyan-500/40"
      >
        Register Now
        <ExternalLink size={14} />
      </a>
    </motion.div>
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

    const handleMouseMove = (e: MouseEvent) => {
      glow.style.left = e.clientX - 250 + 'px';
      glow.style.top = e.clientY - 250 + 'px';
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      glow.remove();
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return null;
}
