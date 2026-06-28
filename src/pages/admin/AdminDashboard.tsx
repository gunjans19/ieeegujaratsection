import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Link2, Calendar, LogOut, Plus, Edit2, Trash2, Save,
  X, ChevronRight, Bell, Users, Globe, Check, AlertCircle, Menu, Image as ImageIcon
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

type Tab = 'overview' | 'links' | 'events' | 'announcements' | 'committee' | 'slideshow';

interface LinkItem {
  key: string;
  section: string;
  content: { label: string; description: string; url: string; icon: string };
}

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  status: string;
  registration_link: string;
}

const EMPTY_EVENT: Omit<EventItem, 'id'> = {
  title: '', description: '', date: '', time: '',
  location: '', category: 'Conference', status: 'upcoming', registration_link: '',
};

const defaultCommittee = [
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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [committeeGroups, setCommitteeGroups] = useState<any[]>([]);
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [addingEvent, setAddingEvent] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { checkAdmin(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);
  useEffect(() => { if (activeTab !== 'overview') loadData(activeTab); }, [activeTab]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const checkAdmin = async () => {
    const isAuthed = localStorage.getItem('admin_auth') === 'true';
    if (!isAuthed) {
      navigate('/admin');
      return;
    }
    loadData('overview');
  };

  const loadData = async (tab: string) => {
    setLoading(true);
    if (tab === 'overview' || tab === 'links') {
      const { data } = await supabase.from('site_content').select('*').eq('section', 'links').order('key');
      setLinks((data as LinkItem[]) || []);
    }
    if (tab === 'overview' || tab === 'events') {
      const { data } = await supabase.from('events').select('*').order('date');
      setEvents((data as EventItem[]) || []);
    }
    if (tab === 'overview' || tab === 'announcements') {
      const { data, error } = await supabase.from('site_content').select('*').eq('section', 'announcements').order('updated_at', { ascending: false });
      if (!error && data && data.length > 0) {
        setAnnouncements(data);
      } else {
        const local = localStorage.getItem('admin_announcements');
        if (local) {
          setAnnouncements(JSON.parse(local));
        } else {
          const defaultAnn = [
            { key: 'ann-1', section: 'announcements', content: { text: 'IEEE Gujarat Section Annual General Meeting — June 30, 2025' } },
            { key: 'ann-2', section: 'announcements', content: { text: 'Call for Papers: IEEE INDICON 2025 — Deadline August 31' } },
            { key: 'ann-3', section: 'announcements', content: { text: 'Student Branch Excellence Awards Nominations Now Open' } },
            { key: 'ann-4', section: 'announcements', content: { text: 'New Technical Chapter: IEEE Aerospace & Electronic Systems Society' } },
          ];
          setAnnouncements(defaultAnn);
          localStorage.setItem('admin_announcements', JSON.stringify(defaultAnn));
        }
      }
    }
    if (tab === 'overview' || tab === 'committee') {
      const local = localStorage.getItem('admin_committee');
      if (local && local.includes('Social Media Committee') && local.includes('Hansdah')) {
        setCommitteeGroups(JSON.parse(local));
      } else {
        setCommitteeGroups(defaultCommittee);
        localStorage.setItem('admin_committee', JSON.stringify(defaultCommittee));
      }
    }
    if (tab === 'overview' || tab === 'slideshow') {
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
    }
    setLoading(false);
  };

  const handleSaveSlide = (slide: any, id?: string) => {
    setSlides(prev => {
      let updated;
      if (id) {
        updated = prev.map(s => s.id === id ? { ...s, imageUrl: slide.imageUrl, caption: slide.caption } : s);
      } else {
        updated = [...prev, { id: 'slide_' + Date.now(), imageUrl: slide.imageUrl, caption: slide.caption }];
      }
      localStorage.setItem('admin_gallery', JSON.stringify(updated));
      return updated;
    });
    showToast(id ? 'Slide updated successfully' : 'Slide added successfully');
    loadData('slideshow');
  };

  const handleDeleteSlide = (id: string) => {
    if (!confirm('Delete this slide?')) return;
    setSlides(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem('admin_gallery', JSON.stringify(updated));
      return updated;
    });
    showToast('Slide deleted successfully');
    loadData('slideshow');
  };

  const handleLogout = async () => {
    localStorage.removeItem('admin_auth');
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const handleSaveLink = async (link: LinkItem) => {
    const { error } = await supabase.from('site_content').upsert({
      key: link.key, section: 'links', content: link.content, updated_at: new Date().toISOString(),
    });
    if (error) {
      // Dev Mode Local Fallback
      setLinks(prev => {
        const updated = prev.map(l => l.key === link.key ? link : l);
        localStorage.setItem('admin_links', JSON.stringify(updated));
        return updated;
      });
      setEditingLink(null);
      showToast('Updated locally (Dev Mode)', 'success');
      return;
    }
    setEditingLink(null);
    showToast('Link updated successfully');
    loadData('links');
  };

  const handleSaveEvent = async (evt: Partial<EventItem>) => {
    if (evt.id) {
      const { error } = await supabase.from('events').update(evt).eq('id', evt.id);
      if (error) {
        // Dev Mode Local Fallback
        setEvents(prev => {
          const updated = prev.map(e => e.id === evt.id ? { ...e, ...evt } as EventItem : e);
          localStorage.setItem('admin_events', JSON.stringify(updated));
          return updated;
        });
        setEditingEvent(null);
        showToast('Updated locally (Dev Mode)', 'success');
        return;
      }
      showToast('Event updated');
    } else {
      const mockId = 'event_' + Date.now();
      const newEvt = { ...evt, id: mockId } as EventItem;
      const { error } = await supabase.from('events').insert(evt);
      if (error) {
        // Dev Mode Local Fallback
        setEvents(prev => {
          const updated = [...prev, newEvt];
          localStorage.setItem('admin_events', JSON.stringify(updated));
          return updated;
        });
        setAddingEvent(false);
        showToast('Added locally (Dev Mode)', 'success');
        return;
      }
      showToast('Event added');
    }
    setEditingEvent(null);
    setAddingEvent(false);
    loadData('events');
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) {
      // Dev Mode Local Fallback
      setEvents(prev => {
        const updated = prev.filter(e => e.id !== id);
        localStorage.setItem('admin_events', JSON.stringify(updated));
        return updated;
      });
      showToast('Deleted locally (Dev Mode)', 'success');
      return;
    }
    showToast('Event deleted');
    loadData('events');
  };

  const handleSaveAnnouncement = async (key: string, text: string, link?: string) => {
    const isNew = !key;
    const actualKey = isNew ? 'announcement_' + Date.now() : key;
    const annItem = { key: actualKey, section: 'announcements', content: { text, link } };
    const { error } = await supabase.from('site_content').upsert({
      key: actualKey,
      section: 'announcements',
      content: { text, link },
      updated_at: new Date().toISOString(),
    });
    if (error) {
      // Dev Mode Local Fallback
      setAnnouncements(prev => {
        let updated;
        if (isNew) {
          updated = [annItem, ...prev];
        } else {
          updated = prev.map(a => a.key === key ? annItem : a);
        }
        localStorage.setItem('admin_announcements', JSON.stringify(updated));
        return updated;
      });
      showToast(isNew ? 'Added locally (Dev Mode)' : 'Updated locally (Dev Mode)', 'success');
      return;
    }
    showToast(isNew ? 'Announcement added' : 'Announcement updated');
    loadData('announcements');
  };

  const handleDeleteAnnouncement = async (key: string) => {
    if (!confirm('Delete this announcement?')) return;
    const { error } = await supabase.from('site_content').delete().eq('key', key);
    if (error) {
      // Dev Mode Local Fallback
      setAnnouncements(prev => {
        const updated = prev.filter(a => a.key !== key);
        localStorage.setItem('admin_announcements', JSON.stringify(updated));
        return updated;
      });
      showToast('Deleted locally (Dev Mode)', 'success');
      return;
    }
    showToast('Announcement deleted');
    loadData('announcements');
  };

  const handleSaveMember = (member: any, originalName?: string) => {
    setCommitteeGroups(prev => {
      let groupExists = false;
      let updated = prev.map(g => {
        if (g.role === member.roleGroup) {
          groupExists = true;
          let members;
          if (originalName) {
            members = g.members.map((m: any) => m.name === originalName ? {
              name: member.name,
              position: member.position,
              organization: member.organization,
              email: member.email,
              linkedin: member.linkedin,
              avatar: member.avatar,
              ieeeNumber: member.ieeeNumber,
              affiliation: member.affiliation
            } : m);
          } else {
            members = [...g.members, {
              name: member.name,
              position: member.position,
              organization: member.organization,
              email: member.email,
              linkedin: member.linkedin,
              avatar: member.avatar,
              ieeeNumber: member.ieeeNumber,
              affiliation: member.affiliation
            }];
          }
          return { ...g, members };
        }
        return g;
      });

      if (!groupExists) {
        updated = [...updated, {
          role: member.roleGroup,
          members: [{
            name: member.name,
            position: member.position,
            organization: member.organization,
            email: member.email,
            linkedin: member.linkedin,
            avatar: member.avatar,
            ieeeNumber: member.ieeeNumber,
            affiliation: member.affiliation
          }]
        }];
      }

      localStorage.setItem('admin_committee', JSON.stringify(updated));
      return updated;
    });
    showToast(originalName ? 'Member updated successfully' : 'Member added successfully');
    loadData('committee');
  };

  const handleDeleteMember = (name: string, groupRole: string) => {
    if (!confirm(`Delete ${name}?`)) return;
    setCommitteeGroups(prev => {
      const updated = prev.map(g => {
        if (g.role === groupRole) {
          return { ...g, members: g.members.filter((m: any) => m.name !== name) };
        }
        return g;
      }).filter(g => g.members.length > 0);
      localStorage.setItem('admin_committee', JSON.stringify(updated));
      return updated;
    });
    showToast('Member deleted successfully');
    loadData('committee');
  };

  const navItems: { id: Tab; icon: typeof LayoutDashboard; label: string }[] = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'links', icon: Link2, label: 'Manage Links' },
    { id: 'events', icon: Calendar, label: 'Manage Events' },
    { id: 'announcements', icon: Bell, label: 'Manage Announcements' },
    { id: 'committee', icon: Users, label: 'Manage Committee' },
    { id: 'slideshow', icon: ImageIcon, label: 'Manage Slideshow' },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: '#030d1a' }}>
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 h-screen w-64 z-30 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`} style={{ background: 'rgba(0,15,35,0.98)', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
        {/* Logo */}
        <div className="px-5 py-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <img src="/2_20260512_144200_0001.png" alt="IEEE" className="h-10 w-auto object-contain" />
          <p className="text-[10px] text-slate-500 mt-2 font-mono">Developed by Harshpal Singh Solanki</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
              {activeTab === id && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-white font-bold truncate">{localStorage.getItem('admin_name') || 'Harshpal Singh Solanki'}</p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{localStorage.getItem('admin_email') || 'harshpal@ieee.org'}</p>
              <p className="text-[9px] text-cyan-400 font-semibold tracking-wider uppercase mt-1">{localStorage.getItem('admin_role') || 'Super Admin'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 text-sm hover:bg-red-500/10 transition-colors mb-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <p className="text-[9px] text-slate-600 text-center font-mono uppercase tracking-wider mt-1">Developed by Harshpal Singh Solanki</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-5 py-4 border-b sticky top-0 z-10"
          style={{ background: 'rgba(3,13,26,0.95)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-white/5">
              <Menu className="w-5 h-5 text-slate-400" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white capitalize">
                {activeTab === 'overview' ? 'Dashboard' : activeTab === 'links' ? 'Manage Links' : activeTab === 'events' ? 'Manage Events' : activeTab === 'announcements' ? 'Manage Announcements' : activeTab === 'committee' ? 'Manage Committee' : 'Manage Slideshow'}
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">IEEE Gujarat Section Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-white/5 transition-colors">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">View Site</span>
            </a>
            <div className="w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Bell className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-5 md:p-8 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {activeTab === 'overview' && <OverviewTab links={links} events={events} setActiveTab={setActiveTab} />}
              {activeTab === 'links' && (
                <LinksTab
                  links={links}
                  editingLink={editingLink}
                  setEditingLink={setEditingLink}
                  onSave={handleSaveLink}
                />
              )}
              {activeTab === 'events' && (
                <EventsTab
                  events={events}
                  editingEvent={editingEvent}
                  addingEvent={addingEvent}
                  setEditingEvent={setEditingEvent}
                  setAddingEvent={setAddingEvent}
                  onSave={handleSaveEvent}
                  onDelete={handleDeleteEvent}
                />
              )}
              {activeTab === 'announcements' && (
                <AnnouncementsTab
                  announcements={announcements}
                  onSave={handleSaveAnnouncement}
                  onDelete={handleDeleteAnnouncement}
                />
              )}
              {activeTab === 'committee' && (
                <CommitteeTab
                  groups={committeeGroups}
                  onSave={handleSaveMember}
                  onDelete={handleDeleteMember}
                />
              )}
              {activeTab === 'slideshow' && (
                <SlideshowTab
                  slides={slides}
                  onSave={handleSaveSlide}
                  onDelete={handleDeleteSlide}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl ${
              toast.type === 'success'
                ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/20 border border-red-500/30 text-red-300'
            }`}
          >
            {toast.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span className="text-sm font-medium">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Overview Tab ──────────────────────────────────────────────────────────────
function OverviewTab({ links, events, setActiveTab }: { links: LinkItem[]; events: EventItem[]; setActiveTab: (t: Tab) => void }) {
  const upcoming = events.filter((e) => e.status === 'upcoming').length;

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Links', value: links.length, icon: Link2, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Total Events', value: events.length, icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Upcoming Events', value: upcoming, icon: Bell, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Site Status', value: 'Live', icon: Globe, color: 'text-green-400', bg: 'bg-green-500/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Access */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Links preview */}
        <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white">Quick Links</h3>
            <button onClick={() => setActiveTab('links')} className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Edit all</button>
          </div>
          <div className="space-y-3">
            {links.slice(0, 4).map((l) => (
              <div key={l.key} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-500" />
                <span className="text-sm text-slate-300 flex-1 truncate">{l.content.label}</span>
                <span className="text-xs text-slate-500 truncate max-w-28">{l.content.url}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Events preview */}
        <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white">Upcoming Events</h3>
            <button onClick={() => setActiveTab('events')} className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Manage</button>
          </div>
          <div className="space-y-3">
            {events.filter((e) => e.status === 'upcoming').slice(0, 4).map((e) => (
              <div key={e.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-slate-300 truncate">{e.title}</p>
                  <p className="text-xs text-slate-500">{e.date}</p>
                </div>
              </div>
            ))}
            {events.filter((e) => e.status === 'upcoming').length === 0 && (
              <p className="text-sm text-slate-500">No upcoming events</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Links Tab ─────────────────────────────────────────────────────────────────
function LinksTab({ links, editingLink, setEditingLink, onSave }: {
  links: LinkItem[];
  editingLink: string | null;
  setEditingLink: (k: string | null) => void;
  onSave: (l: LinkItem) => void;
}) {
  return (
    <div className="space-y-4 max-w-3xl">
      <p className="text-sm text-slate-500 mb-6">Edit the label, description and URL for each quick-link card on the main page.</p>
      {links.map((link) => (
        <motion.div key={link.key} layout className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {editingLink === link.key ? (
            <EditLinkForm link={link} onSave={onSave} onCancel={() => setEditingLink(null)} />
          ) : (
            <div className="flex items-center justify-between p-5">
              <div className="flex-1 min-w-0 mr-4">
                <p className="font-semibold text-white text-sm mb-0.5">{link.content.label}</p>
                <p className="text-xs text-slate-400 mb-1">{link.content.description}</p>
                <p className="text-xs text-slate-600 font-mono truncate">{link.content.url}</p>
              </div>
              <button onClick={() => setEditingLink(link.key)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-cyan-500/10 hover:text-cyan-400 text-slate-400 text-sm transition-all">
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function EditLinkForm({ link, onSave, onCancel }: { link: LinkItem; onSave: (l: LinkItem) => void; onCancel: () => void }) {
  const [content, setContent] = useState(link.content);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ ...link, content }); }} className="p-5 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Label" value={content.label} onChange={(v) => setContent({ ...content, label: v })} />
        <Field label="Description" value={content.description} onChange={(v) => setContent({ ...content, description: v })} />
      </div>
      <Field label="URL" value={content.url} onChange={(v) => setContent({ ...content, url: v })} />
      <div className="flex gap-3 pt-1">
        <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 text-sm transition-colors">
          <Save className="w-4 h-4" /> Save Changes
        </button>
        <button type="button" onClick={onCancel} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 text-sm transition-colors">
          <X className="w-4 h-4" /> Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Events Tab ────────────────────────────────────────────────────────────────
function EventsTab({ events, editingEvent, addingEvent, setEditingEvent, setAddingEvent, onSave, onDelete }: {
  events: EventItem[];
  editingEvent: EventItem | null;
  addingEvent: boolean;
  setEditingEvent: (e: EventItem | null) => void;
  setAddingEvent: (b: boolean) => void;
  onSave: (e: Partial<EventItem>) => void;
  onDelete: (id: string) => void;
}) {
  const statusColors: Record<string, string> = {
    upcoming: 'text-emerald-400 bg-emerald-500/10',
    ongoing: 'text-yellow-400 bg-yellow-500/10',
    past: 'text-slate-400 bg-slate-500/10',
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Add button */}
      {!addingEvent && !editingEvent && (
        <button onClick={() => setAddingEvent(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 text-sm font-medium transition-all">
          <Plus className="w-4 h-4" /> Add New Event
        </button>
      )}

      {/* Add Form */}
      {addingEvent && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,200,255,0.15)' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <h3 className="text-white font-semibold text-sm">New Event</h3>
          </div>
          <EventForm data={EMPTY_EVENT} onSave={onSave} onCancel={() => setAddingEvent(false)} />
        </motion.div>
      )}

      {/* Event Cards */}
      {events.map((event) => (
        <motion.div key={event.id} layout className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {editingEvent?.id === event.id ? (
            <>
              <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <h3 className="text-white font-semibold text-sm">Edit Event</h3>
              </div>
              <EventForm data={editingEvent} onSave={onSave} onCancel={() => setEditingEvent(null)} />
            </>
          ) : (
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-semibold text-white text-sm">{event.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[event.status] ?? statusColors.past}`}>
                      {event.status}
                    </span>
                    <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{event.category}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2 line-clamp-1">{event.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                    {event.date && <span>{event.date}</span>}
                    {event.time && <span>{event.time}</span>}
                    {event.location && <span>{event.location}</span>}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setEditingEvent(event)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-cyan-500/10 hover:text-cyan-400 text-slate-400 transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(event.id)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-slate-400 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function EventForm({ data, onSave, onCancel }: { data: Partial<EventItem>; onSave: (e: Partial<EventItem>) => void; onCancel: () => void }) {
  const [form, setForm] = useState(data);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const [startHour, setStartHour] = useState('09');
  const [startMinute, setStartMinute] = useState('00');
  const [startPeriod, setStartPeriod] = useState('AM');

  const [endHour, setEndHour] = useState('05');
  const [endMinute, setEndMinute] = useState('00');
  const [endPeriod, setEndPeriod] = useState('PM');

  useEffect(() => {
    if (data.time) {
      const parts = data.time.split('-');
      if (parts.length === 2) {
        const start = parts[0].trim().split(' ');
        const end = parts[1].trim().split(' ');
        if (start.length === 2) {
          const startHM = start[0].split(':');
          if (startHM.length === 2) {
            setStartHour(startHM[0]);
            setStartMinute(startHM[1]);
          }
          setStartPeriod(start[1]);
        }
        if (end.length === 2) {
          const endHM = end[0].split(':');
          if (endHM.length === 2) {
            setEndHour(endHM[0]);
            setEndMinute(endHM[1]);
          }
          setEndPeriod(end[1]);
        }
      } else {
        const start = data.time.trim().split(' ');
        if (start.length === 2) {
          const startHM = start[0].split(':');
          if (startHM.length === 2) {
            setStartHour(startHM[0]);
            setStartMinute(startHM[1]);
          }
          setStartPeriod(start[1]);
        }
      }
    }
  }, [data.time]);

  const updateTimeStr = (sh: string, sm: string, sp: string, eh: string, em: string, ep: string) => {
    const timeStr = `${sh}:${sm} ${sp} - ${eh}:${em} ${ep}`;
    setForm(f => ({ ...f, time: timeStr }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTime = `${startHour}:${startMinute} ${startPeriod} - ${endHour}:${endMinute} ${endPeriod}`;
    onSave({ ...form, time: finalTime });
  };

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Title *" value={form.title ?? ''} onChange={(v) => set('title', v)} required />
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Category</label>
          <select value={form.category ?? 'Conference'} onChange={(e) => set('category', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none">
            {['Conference', 'Workshop', 'Hackathon', 'Webinar', 'Event'].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Date *</label>
          <input
            type="date"
            value={form.date ?? ''}
            onChange={(e) => set('date', e.target.value)}
            required
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none transition-colors"
            style={{ colorScheme: 'dark' }}
          />
        </div>
        <Field label="Location" value={form.location ?? ''} onChange={(v) => set('location', v)} placeholder="Venue or Online" />
        
        {/* Start Time */}
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Start Time *</label>
          <div className="flex gap-2">
            <select
              value={startHour}
              onChange={(e) => { setStartHour(e.target.value); updateTimeStr(e.target.value, startMinute, startPeriod, endHour, endMinute, endPeriod); }}
              className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none"
            >
              {hours.map(h => <option key={h} value={h} className="bg-slate-900">{h}</option>)}
            </select>
            <select
              value={startMinute}
              onChange={(e) => { setStartMinute(e.target.value); updateTimeStr(startHour, e.target.value, startPeriod, endHour, endMinute, endPeriod); }}
              className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none"
            >
              {minutes.map(m => <option key={m} value={m} className="bg-slate-900">{m}</option>)}
            </select>
            <select
              value={startPeriod}
              onChange={(e) => { setStartPeriod(e.target.value); updateTimeStr(startHour, startMinute, e.target.value, endHour, endMinute, endPeriod); }}
              className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none"
            >
              {['AM', 'PM'].map(p => <option key={p} value={p} className="bg-slate-900">{p}</option>)}
            </select>
          </div>
        </div>

        {/* End Time */}
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">End Time *</label>
          <div className="flex gap-2">
            <select
              value={endHour}
              onChange={(e) => { setEndHour(e.target.value); updateTimeStr(startHour, startMinute, startPeriod, e.target.value, endMinute, endPeriod); }}
              className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none"
            >
              {hours.map(h => <option key={h} value={h} className="bg-slate-900">{h}</option>)}
            </select>
            <select
              value={endMinute}
              onChange={(e) => { setEndMinute(e.target.value); updateTimeStr(startHour, startMinute, startPeriod, endHour, e.target.value, endPeriod); }}
              className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none"
            >
              {minutes.map(m => <option key={m} value={m} className="bg-slate-900">{m}</option>)}
            </select>
            <select
              value={endPeriod}
              onChange={(e) => { setEndPeriod(e.target.value); updateTimeStr(startHour, startMinute, startPeriod, endHour, endMinute, e.target.value); }}
              className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none"
            >
              {['AM', 'PM'].map(p => <option key={p} value={p} className="bg-slate-900">{p}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Status</label>
          <select value={form.status ?? 'upcoming'} onChange={(e) => set('status', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none">
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="past">Past</option>
          </select>
        </div>
        <Field label="Registration Link" value={form.registration_link ?? ''} onChange={(v) => set('registration_link', v)} placeholder="https://..." />
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1.5">Description</label>
        <textarea value={form.description ?? ''} onChange={(e) => set('description', e.target.value)} rows={3}
          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none resize-none" />
      </div>
      <div className="flex gap-3">
        <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 text-sm font-medium transition-colors">
          <Save className="w-4 h-4" /> Save Event
        </button>
        <button type="button" onClick={onCancel} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 text-sm transition-colors">
          <X className="w-4 h-4" /> Cancel
        </button>
      </div>
    </form>
  );
}

function Field({ label, value, onChange, placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1.5">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required}
        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:border-cyan-500 focus:outline-none transition-colors" />
    </div>
  );
}

function AnnouncementsTab({
  announcements,
  onSave,
  onDelete
}: {
  announcements: any[];
  onSave: (key: string, text: string, link?: string) => void;
  onDelete: (key: string) => void;
}) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [inputText, setInputText] = useState('');
  const [inputLink, setInputLink] = useState('');

  const handleEdit = (ann: any) => {
    setEditingKey(ann.key);
    setInputText(ann.content.text);
    setInputLink(ann.content.link || '');
  };

  const handleCancel = () => {
    setEditingKey(null);
    setAddingNew(false);
    setInputText('');
    setInputLink('');
  };

  const handleSubmit = (e: React.FormEvent, key: string) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSave(key, inputText.trim(), inputLink.trim() || undefined);
    handleCancel();
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Add Button */}
      {!addingNew && !editingKey && (
        <button
          onClick={() => { setAddingNew(true); setInputText(''); setInputLink(''); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 text-sm font-medium transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Announcement
        </button>
      )}

      {/* Add Form */}
      {addingNew && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,200,255,0.15)' }}>
          <div className="px-6 py-4 border-b border-white/10">
            <h3 className="text-white font-semibold text-sm">New Announcement</h3>
          </div>
          <form onSubmit={(e) => handleSubmit(e, '')} className="p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Announcement Text *" value={inputText} onChange={setInputText} placeholder="Enter announcement text..." required />
              <Field label="Link URL (Optional)" value={inputLink} onChange={setInputLink} placeholder="https://..." />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 text-sm font-medium transition-colors">
                <Save className="w-4 h-4" /> Save
              </button>
              <button type="button" onClick={handleCancel} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 text-sm transition-colors">
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* List */}
      <div className="space-y-4">
        {announcements.map((ann) => (
          <motion.div key={ann.key} layout className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {editingKey === ann.key ? (
              <form onSubmit={(e) => handleSubmit(e, ann.key)} className="p-5 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Edit Announcement Text *" value={inputText} onChange={setInputText} required />
                  <Field label="Link URL (Optional)" value={inputLink} onChange={setInputLink} placeholder="https://..." />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 text-sm transition-colors">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                  <button type="button" onClick={handleCancel} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 text-sm transition-colors">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-5 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 leading-relaxed font-medium">{ann.content.text}</p>
                  {ann.content.link && (
                    <a href={ann.content.link} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:underline inline-flex items-center gap-1 mt-1">
                      Link: {ann.content.link}
                    </a>
                  )}
                  <p className="text-xs text-slate-600 mt-1 font-mono">ID: {ann.key}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleEdit(ann)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-cyan-500/10 hover:text-cyan-400 text-slate-400 transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(ann.key)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-slate-400 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
        {announcements.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-8">No announcements found.</p>
        )}
      </div>
    </div>
  );
}

function CommitteeTab({ groups, onSave, onDelete }: { groups: any[]; onSave: (member: any, originalName?: string) => void; onDelete: (name: string, groupRole: string) => void }) {
  const [addingNew, setAddingNew] = useState(false);
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [originalName, setOriginalName] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [avatar, setAvatar] = useState('');
  const [roleGroup, setRoleGroup] = useState('Executive Committee');
  const [ieeeNumber, setIeeeNumber] = useState('');
  const [affiliation, setAffiliation] = useState('');

  const handleAddClick = () => {
    setName(''); setPosition(''); setOrganization(''); setEmail(''); setLinkedin(''); setAvatar(''); setRoleGroup('Executive Committee');
    setIeeeNumber(''); setAffiliation('');
    setAddingNew(true);
    setEditingMember(null);
  };

  const handleEditClick = (member: any, groupRole: string) => {
    setName(member.name);
    setPosition(member.position);
    setOrganization(member.organization);
    setEmail(member.email);
    setLinkedin(member.linkedin);
    setAvatar(member.avatar);
    setRoleGroup(groupRole);
    setIeeeNumber(member.ieeeNumber || '');
    setAffiliation(member.affiliation || '');
    setOriginalName(member.name);
    setEditingMember(member);
    setAddingNew(false);
  };

  const handleCancel = () => {
    setAddingNew(false);
    setEditingMember(null);
    setOriginalName(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, position, organization, email, linkedin, avatar, roleGroup, ieeeNumber, affiliation }, originalName || undefined);
    handleCancel();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Add Button */}
      {!addingNew && !editingMember && (
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 text-sm font-medium transition-all"
        >
          <Plus className="w-4 h-4" /> Add Committee Member
        </button>
      )}

      {/* Form Card (Add/Edit) */}
      {(addingNew || editingMember) && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,200,255,0.15)' }}>
          <div className="px-6 py-4 border-b border-white/10">
            <h3 className="text-white font-semibold text-sm">{editingMember ? `Edit Member: ${originalName}` : 'New Committee Member'}</h3>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name *" value={name} onChange={setName} placeholder="Dr. Anil Roy" required />
              <Field label="Position / Role *" value={position} onChange={setPosition} placeholder="Section Chair" required />
              <Field label="Organization *" value={organization} onChange={setOrganization} placeholder="DA-IICT, Gandhinagar" required />
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Role Group *</label>
                <select
                  value={roleGroup}
                  onChange={(e) => setRoleGroup(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-500/80 focus:bg-white/[0.08] focus:outline-none transition-all text-sm"
                >
                  <option value="Executive Committee" className="bg-slate-900">Executive Committee</option>
                  <option value="Advisory Committee" className="bg-slate-900">Advisory Committee</option>
                  <option value="Subcommittee" className="bg-slate-900">Subcommittee</option>
                  <option value="Section Student Representative Team" className="bg-slate-900">Section Student Representative Team</option>
                  <option value="Social Media Committee" className="bg-slate-900">Social Media Committee</option>
                </select>
              </div>
              <Field label="Email Address *" value={email} onChange={setEmail} placeholder="anil.roy@ieeegujarat.org" required />
              <Field label="LinkedIn URL" value={linkedin} onChange={setLinkedin} placeholder="https://linkedin.com/in/..." />
              <Field label="IEEE Number" value={ieeeNumber} onChange={setIeeeNumber} placeholder="e.g. 98765432" />
              <Field label="Affiliation" value={affiliation} onChange={setAffiliation} placeholder="e.g. Senior Member, WIE Chair" />
              <div className="sm:col-span-2 space-y-3">
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Avatar Image</label>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {avatar && (
                    <img src={avatar} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-white/10" />
                  )}
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setAvatar(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-400 hover:file:bg-cyan-500/30 file:cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-500">Or enter an image URL below:</p>
                    <input
                      type="text"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="https://images.pexels.com/..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-500/80 focus:bg-white/[0.08] focus:outline-none transition-all text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 text-sm font-medium transition-colors">
                <Save className="w-4 h-4" /> {editingMember ? 'Save Changes' : 'Add Member'}
              </button>
              <button type="button" onClick={handleCancel} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 text-sm transition-colors">
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Grouped Lists */}
      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.role} className="space-y-4">
            <h3 className="text-white font-bold text-base border-b border-white/10 pb-2">{group.role}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.members.map((m: any) => (
                <div key={m.name} className="p-5 rounded-2xl flex items-center justify-between gap-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={m.avatar || 'https://via.placeholder.com/150'} alt={m.name} className="w-12 h-12 rounded-full object-cover border border-white/10 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-slate-200 font-bold truncate">{m.name}</p>
                      <p className="text-xs text-cyan-400 font-semibold">{m.position}</p>
                      <p className="text-xs text-slate-500 truncate">{m.organization}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleEditClick(m, group.role)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-cyan-500/10 hover:text-cyan-400 text-slate-400 transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(m.name, group.role)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-slate-400 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {groups.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-8">No committee members found.</p>
        )}
      </div>
    </div>
  );
}

function SlideshowTab({
  slides,
  onSave,
  onDelete
}: {
  slides: any[];
  onSave: (slide: any, id?: string) => void;
  onDelete: (id: string) => void;
}) {
  const [addingNew, setAddingNew] = useState(false);
  const [editingSlide, setEditingSlide] = useState<any | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');

  const handleAddClick = () => {
    setImageUrl(''); setCaption('');
    setAddingNew(true);
    setEditingSlide(null);
  };

  const handleEditClick = (slide: any) => {
    setImageUrl(slide.imageUrl);
    setCaption(slide.caption);
    setEditingSlide(slide);
    setAddingNew(false);
  };

  const handleCancel = () => {
    setAddingNew(false);
    setEditingSlide(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ imageUrl, caption }, editingSlide?.id || undefined);
    handleCancel();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Add Button */}
      {!addingNew && !editingSlide && (
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 text-sm font-medium transition-all"
        >
          <Plus className="w-4 h-4" /> Add Gallery Slide
        </button>
      )}

      {/* Form Card */}
      {(addingNew || editingSlide) && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,200,255,0.15)' }}>
          <div className="px-6 py-4 border-b border-white/10">
            <h3 className="text-white font-semibold text-sm">{editingSlide ? 'Edit Slide' : 'New Gallery Slide'}</h3>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Slide Caption *" value={caption} onChange={setCaption} placeholder="e.g. SAMPARK 2026" required />
              <div className="sm:col-span-2 space-y-3">
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Slide Image</label>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {imageUrl && (
                    <img src={imageUrl} alt="Preview" className="w-24 h-16 rounded-lg object-cover border border-white/10" />
                  )}
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setImageUrl(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-400 hover:file:bg-cyan-500/30 file:cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-500">Or enter an image URL below:</p>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.pexels.com/..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-500/80 focus:bg-white/[0.08] focus:outline-none transition-all text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 text-sm font-medium transition-colors">
                <Save className="w-4 h-4" /> Save Slide
              </button>
              <button type="button" onClick={handleCancel} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 text-sm transition-colors">
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {slides.map((s) => (
          <div key={s.id} className="p-4 rounded-2xl flex flex-col justify-between gap-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <img src={s.imageUrl} alt={s.caption} className="w-full h-32 rounded-xl object-cover border border-white/5" />
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-200 truncate">{s.caption}</p>
                <p className="text-[10px] text-slate-500 font-mono">ID: {s.id}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEditClick(s)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-cyan-500/10 hover:text-cyan-400 text-slate-400 transition-all">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(s.id)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-slate-400 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
