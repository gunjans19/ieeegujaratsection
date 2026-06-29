import { motion } from 'framer-motion';
import { ArrowLeft, Linkedin, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const committeeMembers = [
  {
    role: 'Executive Committee',
    members: [
      {
        name: 'Dr. Anil Roy',
        position: 'Section Chair',
        organization: 'DA-IICT, Gandhinagar',
        email: 'anil.roy@ieeegujarat.org',
        linkedin: '#',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      },
      {
        name: 'Dr. Hardik Pathak',
        position: 'Vice Chair',
        organization: 'Adani University',
        email: 'hardik.pathak@ieeegujarat.org',
        linkedin: '#',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      },
      {
        name: 'Prof. Sanjay Chaudhary',
        position: 'Secretary',
        organization: 'Ahmedabad University',
        email: 'sanjay.chaudhary@ieeegujarat.org',
        linkedin: '#',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      },
      {
        name: 'Prof. Nilesh Ranpura',
        position: 'Treasurer',
        organization: 'L&T Technology Services',
        email: 'nilesh.ranpura@ieeegujarat.org',
        linkedin: '#',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      },
      {
        name: 'Prof. R. C. Hansdah',
        position: 'Joint Secretary',
        organization: 'IISc Bangalore / DA-IICT',
        email: 'hansdah@ieeegujarat.org',
        linkedin: '#',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      },
    ],
  },
  {
    role: 'Advisory Committee',
    members: [
      {
        name: 'Dr. Sameer Patel',
        position: 'Immediate Past Chair',
        organization: 'Nirma University',
        email: 'sameer.patel@ieeegujarat.org',
        linkedin: '#',
        avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      },
      {
        name: 'Dr. Manik Lal Das',
        position: 'Senior Advisor',
        organization: 'DA-IICT, Gandhinagar',
        email: 'maniklal.das@ieeegujarat.org',
        linkedin: '#',
        avatar: 'https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      },
    ],
  },
  {
    role: 'Subcommittee',
    members: [
      {
        name: 'Dr. Vijay Singh',
        position: 'Technical Activities Chair',
        organization: 'IIT Gandhinagar',
        email: 'vijay.singh@ieeegujarat.org',
        linkedin: '#',
        avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      },
      {
        name: 'Dr. Mita Patel',
        position: 'Women in Engineering (WIE) Chair',
        organization: 'Nirma University',
        email: 'mita.patel@ieeegujarat.org',
        linkedin: '#',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      },
    ],
  },
  {
    role: 'Section Student Representative Team',
    members: [
      {
        name: 'Meet Patel',
        position: 'Section Student Representative',
        organization: 'DA-IICT',
        email: 'meet.patel@ieeegujarat.org',
        linkedin: '#',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      },
      {
        name: 'Riya Shah',
        position: 'Associate Student Representative',
        organization: 'Nirma University',
        email: 'riya.shah@ieeegujarat.org',
        linkedin: '#',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      },
    ],
  },
  {
    role: 'Social Media Committee',
    members: [
      {
        name: 'Arnav Mehta',
        position: 'Social Media Chair',
        organization: 'Ahmedabad University',
        email: 'arnav.mehta@ieeegujarat.org',
        linkedin: '#',
        avatar: 'https://images.pexels.com/photos/912278/pexels-photo-912278.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      },
      {
        name: 'Dev Patel',
        position: 'Graphic Designer & Content Lead',
        organization: 'Adani University',
        email: 'dev.patel@ieeegujarat.org',
        linkedin: '#',
        avatar: 'https://images.pexels.com/photos/2287252/pexels-photo-2287252.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      },
    ],
  },
];

export default function CommitteePage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const local = localStorage.getItem('admin_committee');
    if (local && local.includes('Social Media Committee') && local.includes('Hansdah')) {
      setGroups(JSON.parse(local));
    } else {
      setGroups(committeeMembers);
      localStorage.setItem('admin_committee', JSON.stringify(committeeMembers));
    }
  }, []);
  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{
      background: 'linear-gradient(-45deg, #001a2e, #003050, #001a2e, #002040)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
    }}>
      {/* Particles Background */}
      <ParticleCanvas />

      {/* Mouse Glow cursor effect */}
      <MouseGlow />

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

      <main className="relative z-10 max-w-5xl lg:max-w-6xl xl:max-w-[1400px] mx-auto px-4 py-8 sm:py-12">
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
