import { motion } from 'framer-motion';
import { ArrowLeft, Linkedin, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageBackground from '../components/PageBackground';
import { committeeGroups } from '../data/siteData';

export default function CommitteePage() {
  const [groups] = useState<any[]>(committeeGroups);
  const [expandedGroups, setExpandedGroups] = useState<{ [key: number]: boolean }>({});
  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{
      background: 'linear-gradient(-45deg, #001a2e, #003050, #001a2e, #002040)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
    }}>
      {/* Page Background (Particles & Mouse Glow) */}
      <PageBackground />

      {/* 3D Grid */}
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

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors duration-200 mb-6 text-sm"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3">
            Section <span className="text-cyan-400">Committee</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl">
            Meet the executive committee members, advisors, and volunteers leading the operations and initiatives of the IEEE Gujarat Section.
          </p>
        </motion.div>

        {/* Committee Groups */}
        {groups.map((group: any, groupIdx: number) => {
          const isExpanded = expandedGroups[groupIdx] || false;
          const visibleMembers = isExpanded ? group.members : group.members.slice(0, 4);
          const hasMore = group.members.length > 4;

          return (
            <section key={group.role} className="mb-16">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">
                {group.role}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {visibleMembers.map((member: any, i: number) => (
                  <motion.div
                    key={member.name}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    className="glass-card p-6 rounded-2xl text-center flex flex-col items-center justify-between"
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <img
                        src={member.avatar || 'https://via.placeholder.com/150'}
                        alt={member.name}
                        className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-cyan-500/35"
                      />
                      <h3 className="text-white font-bold text-base sm:text-lg mb-1 leading-snug">{member.name}</h3>
                      <p className="text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">{member.position}</p>
                      <p className="text-slate-400 text-xs font-medium">{member.organization}</p>
                      {member.affiliation && (
                        <p className="text-slate-500 text-[10px] font-medium mt-1.5 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">{member.affiliation}</p>
                      )}
                      {member.ieeeNumber && (
                        <p className="text-cyan-500/80 font-mono text-[9px] mt-1.5 bg-cyan-500/5 px-2 py-0.5 rounded-md border border-cyan-500/10">IEEE No: {member.ieeeNumber}</p>
                      )}
                    </div>

                    <div className="flex gap-3 mt-2">
                      <a
                        href={`mailto:${member.email}`}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/5"
                        title="Send Email"
                      >
                        <Mail size={15} />
                      </a>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-400 transition-all border border-white/5"
                        title="LinkedIn Profile"
                      >
                        <Linkedin size={15} />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setExpandedGroups(prev => ({ ...prev, [groupIdx]: !isExpanded }))}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:translate-y-[-2px]"
                  >
                    {isExpanded ? 'Show Less' : `Show More (${group.members.length - 4} more)`}
                  </button>
                </div>
              )}
            </section>
          );
        })}
      </main>

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


