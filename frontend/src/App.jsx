import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QRCodeSVG } from 'qrcode.react';
import { 
  CalendarDays, QrCode, Ticket, Utensils, MessagesSquare, LayoutDashboard, 
  Settings, UserCircle, LogOut, Search, Users, Activity, ChevronRight, Moon, Sun, ScanLine, CheckCircle2, AlertTriangle, BookOpen
} from 'lucide-react';
import Login from './components/Login.jsx';
import { logOut } from './firebase.js';

// --- Clean Sidebar ---
const Sidebar = ({ role, onLogout }) => {
  const isStudent = role === 'student';
  const links = isStudent ? [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Gate Pass', path: '/qr', icon: <QrCode size={20} /> },
    { name: 'Seating', path: '/seat', icon: <Ticket size={20} /> },
    { name: 'Food / Swag', path: '/food', icon: <Utensils size={20} /> },
    { name: 'EHSAAS QA', path: '/ehsaas', icon: <MessagesSquare size={20} /> },
    { name: 'Leaderboard', path: '/credit', icon: <UserCircle size={20} /> },
    { name: 'Event Rules', path: '/rules', icon: <BookOpen size={20} /> }
  ] : [
    { name: 'Command Center', path: '/admin/dashboard', icon: <Activity size={20} /> },
    { name: 'Manage Events', path: '/admin/events', icon: <CalendarDays size={20} /> },
    { name: 'Live Check-ins', path: '/admin/attendance', icon: <Users size={20} /> },
    { name: 'Swag Batches', path: '/admin/food', icon: <Utensils size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
    { name: 'Guidelines', path: '/admin/rules', icon: <BookOpen size={20} /> }
  ];

  return (
    <div className="w-72 h-screen bg-white dark:bg-black/90 border-r border-slate-200 dark:border-cyber-border flex flex-col fixed left-0 top-0 z-50 transition-colors duration-300">
      <div className="flex items-center gap-3 p-8 border-b border-slate-100 dark:border-cyber-border">
        <div className="p-2 bg-brand-500 rounded-xl shadow-md dark:bg-transparent dark:border dark:border-cyber-primary dark:shadow-[0_0_10px_rgba(0,240,255,0.3)] dark:rounded-none">
          <CalendarDays size={22} className="text-white dark:text-cyber-primary" />
        </div>
        <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white dark:font-mono">NEXUS<span className="text-brand-500 dark:text-cyber-primary">EVENT</span></h1>
      </div>
      
      <nav className="flex-1 space-y-1 p-6 overflow-y-auto">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 dark:text-cyber-primary/70 dark:font-mono">Workspace</div>
        {links.map((item) => (
          <Link 
            key={item.name} 
            to={item.path}
            aria-label={item.name}
            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-brand-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-cyber-primary dark:hover:bg-cyber-primary/10 rounded-2xl dark:rounded-none transition-all font-semibold dark:font-mono group"
          >
            <span className="text-slate-400 group-hover:text-brand-500 dark:text-slate-500 dark:group-hover:text-cyber-primary transition-colors">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-100 dark:border-cyber-border">
        <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl dark:rounded-none bg-slate-50 dark:bg-cyber-darker border border-slate-100 dark:border-cyber-border/50">
          <div className="w-10 h-10 rounded-full dark:rounded-none bg-slate-200 dark:bg-cyber-primary/20 flex items-center justify-center dark:border dark:border-cyber-primary/50">
             <UserCircle size={20} className="text-slate-600 dark:text-cyber-primary" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white capitalize">{role}</div>
            <div className="text-xs text-slate-500 font-mono dark:text-cyber-secondary">ID: {role === 'admin' ? 'ADM-99X' : 'STD-82B'}</div>
          </div>
        </div>
        <button onClick={onLogout} aria-label="Sign Out" className="flex justify-between items-center px-5 py-3 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 rounded-2xl dark:rounded-none transition-all font-bold dark:font-mono group">
          Sign Out
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

// --- Landing Page ---
const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="pt-40 pb-24 px-6 max-w-[1000px] mx-auto text-center flex flex-col items-center relative overflow-hidden">
        {/* Light background blobs */}
        <div className="absolute -top-10 right-0 w-96 h-96 bg-blue-50 dark:bg-cyber-primary/5 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-50 dark:bg-cyber-secondary/5 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

        <div className="badge-tag mb-8 relative z-10 dark:shadow-[0_0_15px_rgba(0,240,255,0.2)]">#1 Event Management Platform</div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-8 relative z-10">
          Build & Organize the <br className="hidden md:block"/>
          <span className="text-brand-500 dark:text-cyber-primary underline decoration-brand-500/30 dark:decoration-cyber-primary/40 underline-offset-8 dark:text-shadow-[0_0_10px_rgba(0,240,255,0.5)]">Ultimate Hackathons.</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-12 max-w-2xl relative z-10">
          From fast QR check-ins to intelligent seat allocation and automated food distribution. 
          The cleanest <span className="dark:text-cyber-secondary dark:font-mono">&lt;offline-first /&gt;</span> architecture for scaling events.
        </p>
        <div className="flex gap-4 relative z-10">
          <Link to="/login" aria-label="Explore Platform" className="btn-primary">Explore Platform</Link>
          <button aria-label="View Live Events" className="btn-outline">View Live Events</button>
        </div>
      </div>

      {/* Trust Metrics */}
      <div className="border-y border-slate-100 dark:border-cyber-border bg-slate-50 dark:bg-black/50 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-200 dark:divide-cyber-border">
          <div><div className="text-4xl font-bold text-slate-900 dark:text-white mb-1 dark:font-mono">500+</div><div className="text-sm font-bold text-slate-500 dark:text-cyber-primary uppercase">Hackathons</div></div>
          <div><div className="text-4xl font-bold text-slate-900 dark:text-white mb-1 dark:font-mono">100k+</div><div className="text-sm font-bold text-slate-500 dark:text-cyber-primary uppercase">Hackers</div></div>
          <div><div className="text-4xl font-bold text-slate-900 dark:text-white mb-1 dark:font-mono">5M+</div><div className="text-sm font-bold text-slate-500 dark:text-cyber-primary uppercase">Check-ins</div></div>
          <div><div className="text-4xl font-bold text-slate-900 dark:text-white mb-1 dark:font-mono">99.9%</div><div className="text-sm font-bold text-slate-500 dark:text-cyber-primary uppercase">Uptime</div></div>
        </div>
      </div>

      {/* Live Events Grid */}
      <div className="py-24 px-6 max-w-7xl mx-auto" id="live-events">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 dark:font-cyber">Trending <span className="text-brand-500 dark:text-cyber-secondary">Events</span></h2>
        <p className="text-slate-500 dark:text-cyber-primary font-mono mb-10 max-w-2xl">Public Directory. No authorization required to view ongoing and upcoming grid operations.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "CodeYuva Coding Challenge", org: "Codex Monarch", 
                date: "16 April 2026", time: "10:00 AM - 01:00 PM", location: "NRI Institute of Information Science and Technology", type: "Coding Challenge", status: "Open Reg", hackers: "142"
              },
              {
                title: "CyberSec Summit Array", org: "InfoSec India", 
                date: "24 April, 2026", time: "10:00 AM - 05:00 PM", location: "IIT Bombay, Mumbai", type: "Conference", status: "Upcoming", hackers: "508"
              },
              {
                title: "Nexus Web3.0 Build", org: "Polygon Guild", 
                date: "05 May, 2026", time: "48 Hours Sprint", location: "Virtual (Discord Base)", type: "Global Sprint", status: "Open Reg", hackers: "1200+"
              }
            ].map((ev, idx) => (
            <div key={idx} className="bento-card overflow-hidden group cursor-pointer flex flex-col h-full border-t-2 border-t-brand-500 dark:border-t-cyber-primary">
              <div className="bg-slate-50 dark:bg-black/60 p-6 flex-1 flex flex-col justify-between relative border-b border-slate-100 dark:border-cyber-border/40">
                <div className="relative z-10 flex justify-between items-start mb-6">
                  <span className={`badge-tag shadow-none shadow-sm dark:font-mono text-[10px] ${ev.status === 'Ongoing' ? 'dark:shadow-[0_0_10px_rgba(16,185,129,0.4)] dark:border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'dark:border-cyber-primary'}`}>
                    {ev.status === 'Ongoing' ? '⚫ LIVE NOW' : ev.status}
                  </span>
                </div>
                <div className="relative z-10">
                  <p className="text-brand-700 dark:text-cyber-secondary font-bold text-xs mb-1 uppercase tracking-widest font-mono">{ev.type} // {ev.org}</p>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight dark:font-cyber mb-4">{ev.title}</h3>
                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                     <p className="flex items-center gap-2"><span>📍</span> <strong>Where:</strong> {ev.location}</p>
                     <p className="flex items-center gap-2"><span>📅</span> <strong>When:</strong> {ev.date}</p>
                     <p className="flex items-center gap-2"><span>⏰</span> <strong>Time:</strong> {ev.time}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white dark:bg-black/40 mt-auto">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-500 mb-5 font-mono uppercase tracking-widest">
                  <span>Network Sync</span>
                  <span>{ev.hackers} Linked</span>
                </div>
                <Link to="/login" className="btn-outline w-full text-center hover:bg-brand-500 hover:text-white dark:hover:bg-cyber-primary dark:hover:text-black transition-colors rounded-sm text-sm">Join Grid &gt;</Link>
              </div>
            </div>
            ))}
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200 dark:border-cyber-border py-12 dark:bg-black">
         <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 dark:text-slate-600 text-sm font-medium dark:font-mono">
             © 2026 Nexus Event Ecosystem. Clean UI / Cyber Theme.
         </div>
      </footer>
    </div>
  );
};

// Login is now imported from ./components/Login.jsx (Firebase Google Auth)

// --- Clean Dashboards ---
const StudentDashboard = () => (
  <div className="p-10 space-y-8 max-w-6xl mx-auto animate-in fade-in duration-500">
    <div className="flex justify-between items-end mb-8 border-b border-slate-200 dark:border-cyber-border pb-8">
      <div>
        <div className="badge-tag mb-3">Student Node</div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white dark:font-cyber">Welcome, <span className="dark:text-cyber-primary">Dummy Hacker.</span></h1>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold text-slate-400 dark:text-cyber-secondary uppercase tracking-widest">Global Rank</div>
        <div className="text-3xl font-black text-brand-500 dark:text-white dark:font-mono mt-1">#42</div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:col-span-4 bento-card p-8 flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Entry Gate Pass</h3>
        <div className="p-4 bg-white border border-slate-100 dark:border-cyber-primary dark:shadow-[0_0_20px_rgba(0,240,255,0.3)] rounded-3xl dark:rounded-none mb-6">
            <QRCodeSVG value="CLEAN_ID_9043" size={180} level="H" />
        </div>
        <div className="w-full pt-4 border-t border-slate-100 dark:border-cyber-border flex justify-between items-center text-left">
            <span className="text-slate-500 dark:text-cyber-primary text-xs font-bold uppercase">Fallback PIN</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-lg bg-slate-50 dark:bg-white/10 px-3 py-1 rounded-lg dark:rounded-none">491-032</span>
        </div>
      </div>

      <div className="md:col-span-8 grid gap-6">
        <div className="bento-card p-6 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl dark:rounded-none bg-indigo-50 dark:bg-cyber-secondary/20 text-indigo-500 dark:text-cyber-secondary dark:border dark:border-cyber-secondary flex items-center justify-center"><Ticket size={24} /></div>
              <div>
                <h3 className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">Workstation Match</h3>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white dark:font-mono">B-42 <span className="text-base text-slate-400 dark:text-cyber-primary font-medium ml-2">Main Arena</span></p>
              </div>
            </div>
            <button className="px-5 py-2.5 bg-slate-50 text-slate-700 dark:text-cyber-secondary dark:bg-transparent dark:border dark:border-cyber-secondary dark:hover:bg-cyber-secondary/10 dark:font-mono rounded-xl dark:rounded-none font-bold hover:bg-slate-100 transition-colors">Access Map</button>
        </div>

        <div className="bento-card p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl dark:rounded-none bg-emerald-50 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center dark:border dark:border-emerald-500"><Utensils size={20} /></div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Fuel Allocation Tracker</h3>
            </div>
            <div className="mt-2"><span className="badge-success">Ready for Pizza Batch</span></div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-3">Head to cafeteria node. QR matrix active.</p>
        </div>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => (
  <div className="p-10 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500 h-full">
    <div className="flex justify-between items-end mb-2 border-b border-slate-200 dark:border-cyber-border pb-4">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 dark:font-cyber">Admin Command Center</h1>
        <p className="text-slate-500 dark:text-cyber-primary font-medium dark:font-mono">Monitoring Event: CodeYuva Coding Challenge</p>
      </div>
      <div className="badge-success shadow-none">● Live Server</div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[ { t: 'Total Hackers', v: '842', c: 'text-brand-500 dark:text-white' }, { t: 'Checked In', v: '610', c: 'text-emerald-500 dark:text-cyber-primary' },
         { t: 'Meals Distributed', v: '412', c: 'text-indigo-500 dark:text-cyber-secondary' }, { t: 'Global Errors', v: '15', c: 'text-orange-500 dark:text-red-500' }
      ].map((s, i) => (
        <div key={i} className="bento-card p-6">
          <span className="block text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">{s.t}</span>
          <span className={`text-5xl font-black dark:font-mono ${s.c}`}>{s.v}</span>
        </div>
      ))}
    </div>

    <div className="bento-card overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-cyber-border flex justify-between items-center bg-white dark:bg-black/60">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">Secure Live Scans</h3>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-cyber-primary w-4 h-4" />
          <input className="w-full bg-slate-50 dark:bg-black dark:font-mono border border-slate-200 dark:border-cyber-border rounded-xl dark:rounded-none py-2 pl-10 pr-3 text-sm text-slate-900 dark:text-white focus:border-brand-500 outline-none" placeholder="Search event logs..." />
        </div>
      </div>
      <div className="overflow-x-auto p-2">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase">
              <th className="px-6 py-4">Identity</th>
              <th className="px-6 py-4">Node Gate</th>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4 text-right">Verification Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-cyber-border">
            {['Rahul Verma', 'Sneha Sharma', 'Amit Kumar'].map((name, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{name}</td>
                <td className="px-6 py-4 text-slate-500 dark:text-cyber-primary dark:font-mono text-sm">Gate Zero</td>
                <td className="px-6 py-4 text-slate-400 dark:text-slate-500 dark:font-mono text-sm">10:{42+i} AM</td>
                <td className="px-6 py-4 text-right"><span className="badge-tag">Secure Sync</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const AdminEvents = () => {
  const navigate = useNavigate();
  return (
    <div className="p-10 max-w-7xl mx-auto animate-in fade-in pt-10">
      <div className="flex justify-between items-end mb-10 border-b border-slate-200 dark:border-cyber-border pb-6">
        <div>
          <h1 className="text-3xl font-cyber dark:text-white mb-2">Event Grid Selection</h1>
          <p className="text-slate-500 font-mono dark:text-cyber-primary">Select an authorized node to manage or initialize a new one.</p>
        </div>
        <button className="btn-primary text-sm shadow-none">Initialize New Node +</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div onClick={() => navigate('/admin/dashboard')} className="bento-card p-6 cursor-pointer hover:border-brand-500 dark:bg-black/60 dark:hover:border-cyber-primary group relative overflow-hidden transition-all duration-300">
           <div className="flex justify-between space-x-4 mb-4 items-start">
             <div>
                <span className="badge-success shadow-none mb-3">Live Network</span>
                <h3 className="font-extrabold text-xl dark:text-white dark:font-cyber">CodeYuva Delhi</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">10 April, NSUT Campus</p>
             </div>
             <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/50 dark:border dark:border-cyber-border text-brand-500 dark:text-cyber-primary group-hover:scale-110 transition-transform">
               <CalendarDays size={24} />
             </div>
           </div>
           <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-6">Assigned Rank: <strong className="dark:text-white">Head Admin</strong></p>
           <div className="flex justify-between items-center text-sm font-mono pt-4 border-t border-slate-100 dark:border-cyber-border">
              <span className="text-slate-500 dark:text-cyber-secondary">842 Regis</span>
              <span className="text-brand-500 dark:text-cyber-primary flex items-center gap-1 group-hover:underline">Enter System <ChevronRight size={14}/></span>
           </div>
        </div>

        <div className="bento-card p-6 cursor-pointer dark:bg-black/40 border-dashed dark:border-dashed border-2 hover:border-slate-400 dark:hover:border-cyber-border transition-all duration-300">
           <div className="flex justify-between space-x-4 mb-4 items-start opacity-70">
             <div>
                <span className="badge-tag shadow-none mb-3 bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600">Draft Mode</span>
                <h3 className="font-extrabold text-xl dark:text-white dark:font-cyber">CodeYuva Mumbai</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">15 April, IITB Campus</p>
             </div>
             <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/50 dark:border dark:border-cyber-border text-slate-400 dark:text-slate-500">
               <CalendarDays size={24} />
             </div>
           </div>
           <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-6 opacity-70">Assigned Rank: <strong className="dark:text-white">Pending Invite</strong></p>
           <div className="flex justify-between items-center text-sm font-mono pt-4 border-t border-slate-100 dark:border-cyber-border opacity-70">
              <span className="text-slate-500 dark:text-cyber-secondary">0 Regis</span>
              <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1">Locked <LogOut size={14}/></span>
           </div>
        </div>
      </div>
    </div>
  );
};

const PlaceholderPage = ({ title, icon: Icon }) => (
  <div className="p-10 flex flex-col items-center justify-center h-[80vh] text-center bg-slate-50 dark:bg-transparent animate-in fade-in">
    <div className="w-20 h-20 rounded-3xl dark:rounded-sm bg-white dark:bg-transparent dark:border-cyber-primary border border-slate-200 flex items-center justify-center mb-6 text-brand-500 dark:text-cyber-primary shadow-sm dark:shadow-[0_0_20px_rgba(0,240,255,0.2)]">
      <Icon size={40} />
    </div>
    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3 dark:font-cyber">&lt;{title.replace(' ', '')}/&gt;</h1>
    <p className="text-slate-500 dark:text-cyber-primary max-w-md mx-auto text-base font-medium dark:font-mono">This module is seamlessly integrated but currently in mock-mode. Database binding will initialize soon.</p>
  </div>
);

const StudentQR = () => {
   const [hasPremium, setHasPremium] = useState(false);
   const [flipped, setFlipped] = useState(false);

   if (!hasPremium) {
       return (
         <div className="p-10 max-w-4xl mx-auto animate-in fade-in pt-10">
            <div className="mb-10 w-full rounded-3xl p-[1px] bg-gradient-to-r from-orange-500 to-amber-500 shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:shadow-[0_0_50px_rgba(249,115,22,0.5)] transition-all cursor-pointer" onClick={() => setHasPremium(true)}>
                <div className="bg-black/90 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="w-full">
                        <div className="flex items-center gap-3 mb-4">
                           <span className="badge-tag bg-orange-500/20 text-orange-400 border-orange-500/50">Credit Score: 78</span>
                           <h2 className="text-2xl font-cyber text-white">Unlock Premium Smart Entry Card</h2>
                        </div>
                        <p className="text-slate-400 font-mono text-sm mb-6 max-w-lg">Your high credit score makes you eligible for an exclusive hardware upgrade. Claim your physical NFC card and never wait in long lines again!</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 mb-2">
                            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-orange-500 flex-shrink-0"/> <span className="text-slate-300 text-sm font-bold">2X Faster Gate Entry</span></div>
                            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-orange-500 flex-shrink-0"/> <span className="text-slate-300 text-sm font-bold">Priority Food System Queue</span></div>
                            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-orange-500 flex-shrink-0"/> <span className="text-slate-300 text-sm font-bold">Unlock Front-Row Seat Access</span></div>
                            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-orange-500 flex-shrink-0"/> <span className="text-slate-300 text-sm font-bold">Lifelong Campus-wide Access</span></div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center border-l-0 md:border-l border-white/10 md:pl-8 h-full w-full md:w-auto mt-4 md:mt-0">
                        <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-extrabold text-lg flex-shrink-0 w-full md:w-auto shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-105 transition-transform mb-3">Claim ID ₹299</button>
                        <p className="text-xs text-slate-500 font-mono uppercase tracking-widest text-center">One-time payment</p>
                    </div>
                </div>
            </div>

             <div className="flex flex-col items-center">
                 <h2 className="text-3xl font-cyber dark:text-white mb-2">Basic Gate Pass Matrix</h2>
                 <p className="text-slate-500 dark:text-cyber-primary font-mono mb-8 text-center">Increase screen brightness to 100% for rapid optical scanning.</p>
                 <div className="bento-card p-12 flex flex-col items-center w-full max-w-md bg-white dark:bg-black/80 relative">
                    <div className="p-6 bg-white rounded-2xl dark:rounded-none dark:border-4 dark:border-cyber-primary dark:shadow-[0_0_30px_rgba(0,240,255,0.4)]">
                       <QRCodeSVG value="AUTH-X-99" size={250} />
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-cyber-border w-full text-center">
                        <span className="text-xs uppercase tracking-widest text-slate-400 dark:text-cyber-secondary block mb-2 font-bold font-mono">Fallback Node PIN</span>
                        <span className="text-4xl font-mono font-black text-brand-500 dark:text-cyber-primary tracking-[0.3em]">74910</span>
                    </div>
                 </div>
             </div>
         </div>
       );
   }

   return (
       <div className="p-10 max-w-4xl mx-auto flex flex-col items-center animate-in fade-in pt-10">
            <h2 className="text-3xl font-cyber dark:text-white mb-2 tracking-wide">Smart Entry NFC Card</h2>
            <p className="text-orange-400 font-mono mb-8 text-center font-bold">2X ENTRY SPEED: Hold near scanner hardware at the gate.</p>

            <div className="relative w-[340px] h-[540px] rounded-[2rem] shadow-[0_20px_50px_rgba(249,115,22,0.2)] hover:shadow-[0_30px_60px_rgba(249,115,22,0.3)] transition-all cursor-pointer overflow-hidden border-2 border-white/5" onClick={() => setFlipped(!flipped)}>
                <div className="absolute inset-0 bg-[#0a0a0a]"></div>
                
                {!flipped ? (
                    <div className="absolute inset-0 flex flex-col items-center w-full h-full text-white bg-grid-white/[0.02]">
                        <div className="absolute top-0 w-[150%] h-[240px] bg-gradient-to-b from-orange-500 to-orange-400 rounded-b-[100%] shadow-lg blur-[2px] opacity-20 transform -translate-y-4"></div>
                        <div className="absolute top-0 w-full h-[180px] bg-gradient-to-b from-orange-600 to-amber-500 rounded-b-[50%] flex justify-center items-end pb-8">
                            <span className="font-cyber font-black text-2xl tracking-widest text-black/90">NEXUS EVENT</span>
                        </div>
                        
                        <div className="absolute top-6 right-6 flex items-center gap-1 opacity-80 text-black z-20">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-pulse">
                                <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="M2.5 16.5C4 15 6 14.5 8 15"/><path d="M2 20.5C5 18 8 18 11 20"/>
                            </svg>
                        </div>
                        
                        <div className="absolute top-[130px] w-28 h-28 rounded-full border-4 border-[#0a0a0a] bg-slate-800 shadow-xl overflow-hidden flex items-center justify-center">
                             <img src="https://ui-avatars.com/api/?name=Amit+Kumar&background=0a0a0a&color=f97316&size=150&bold=true" alt="Avatar" className="w-full h-full object-cover"/>
                        </div>

                        <div className="mt-[280px] text-center w-full px-6 z-10">
                            <h3 className="text-3xl font-black tracking-tight mb-1">Amit Kumar</h3>
                            <p className="text-orange-400 font-bold uppercase tracking-widest text-sm mb-6">Participant / Student</p>
                            
                            <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                                <p className="text-slate-400 text-xs font-mono mb-1">Permanent ID</p>
                                <p className="text-xl font-mono tracking-[4px] font-bold">NEX-7491-09</p>
                            </div>
                        </div>

                        <div className="absolute bottom-6 w-full flex justify-center opacity-60">
                            <span className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Tap to Flip</span>
                        </div>
                    </div>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center w-full h-full text-white bg-[#111]">
                        <div className="absolute bottom-0 w-[120%] h-[200px] bg-gradient-to-b from-orange-500/20 to-amber-500/10 rounded-t-[100%] transform translate-y-10"></div>
                        
                        <div className="w-full p-8 flex flex-col items-center h-full relative z-10">
                            <h4 className="font-cyber text-slate-400 tracking-widest text-sm mb-6 pb-4 border-b border-white/10 w-full text-center">AUTHENTICATION</h4>
                            
                            <div className="p-3 bg-white rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] mb-8">
                                <QRCodeSVG value="AUTH-X-99" size={140} />
                            </div>

                            <div className="w-full text-center space-y-4">
                                <div>
                                    <p className="text-xs text-slate-400 font-mono uppercase tracking-widest">Contact Support</p>
                                    <p className="text-sm font-bold text-slate-200">support@nexusevent.com</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-mono uppercase tracking-widest">Valid Through</p>
                                    <p className="text-sm font-bold text-slate-200">Dec 2026</p>
                                </div>
                            </div>

                            <div className="absolute bottom-8 right-8 text-orange-500 opacity-60">
                                <div className="font-[cursive] text-2xl rotate-[-5deg] italic">Amit Kr.</div>
                            </div>
                            
                            <div className="absolute bottom-8 left-8 text-orange-500 flex flex-col items-center animate-pulse">
                                <Activity size={32} />
                                <span className="text-[10px] font-bold mt-1 tracking-widest">NFC</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
       </div>
   );
};

const StudentCredit = () => (
   <div className="p-10 max-w-4xl mx-auto animate-in fade-in pt-10">
     <h1 className="text-3xl font-cyber dark:text-white mb-8">System Credit Rating <span className="text-brand-500 dark:text-cyber-primary ml-4">75/100</span></h1>
     
     <div className="bento-card p-8 mb-8 border-l-4 border-l-emerald-500 rounded-none dark:bg-black/60">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
           <div>
              <h3 className="font-bold text-xl mb-1 dark:text-white">Good Standing Matrix</h3>
              <p className="text-slate-500 text-sm font-mono dark:text-cyber-secondary">Clearance across all nodes is currently active.</p>
           </div>
           <div className="flex gap-3">
              <span className="badge-tag bg-brand-500/10 text-brand-500 dark:border-cyber-primary/50 text-base py-2 px-4 shadow-[0_0_15px_rgba(0,240,255,0.2)]">Level 3 Hacker</span>
              <span className="badge-success shadow-none text-base py-2 px-4">🟢 SAFE</span>
           </div>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full dark:rounded-none overflow-hidden mb-6">
             <div className="bg-emerald-500 h-full w-[75%] dark:shadow-[0_0_15px_rgba(16,185,129,0.8)]"></div>
        </div>
        <div className="p-4 border border-white/10 bg-slate-900 rounded-xl relative overflow-hidden">
             <div className="absolute right-0 top-0 text-9xl text-white opacity-5 pointer-events-none translate-x-4 -translate-y-4">🏆</div>
             <p className="text-white font-mono text-xs uppercase tracking-widest mb-1 opacity-70">Major Events Registration Index</p>
             <h4 className="text-emerald-400 font-black text-lg mb-2">ELIGIBLE FOR: TIER-1 HACKATHONS</h4>
             <p className="text-slate-400 text-sm">Because your EXP is greater than 60, you have priority lane access to register for any major competitive coding event (like CodeYuva). Do not let your score dip below 60 to maintain this immunity.</p>
        </div>
     </div>

     <h3 className="font-bold text-lg mb-4 mt-8 dark:text-white">Transaction Logs</h3>
     <div className="space-y-4">
        <div className="bento-card p-5 flex justify-between items-center dark:bg-black/40">
           <div>
              <p className="font-bold dark:text-white">API Check-in (Gate 1)</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">Oct 24, 09:14 AM</p>
           </div>
           <span className="text-emerald-500 font-bold font-mono">+10 EXP</span>
        </div>
        <div className="bento-card p-5 flex justify-between items-center dark:bg-black/40">
           <div>
              <p className="font-bold dark:text-white">Late Withdrawal Penalty</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">Oct 20, 18:00 PM</p>
           </div>
           <span className="text-red-500 font-bold font-mono">-7 EXP</span>
        </div>
     </div>
   </div>
);

const StudentFood = () => {
  const [isRegistered, setIsRegistered] = useState(true);

  return (
    <div className="p-10 max-w-4xl mx-auto animate-in fade-in pt-10">
      <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-cyber dark:text-white mb-2">Fuel Distribution Node</h1>
            <p className="text-slate-500 font-mono tracking-widest text-sm uppercase">Catering System Synced to Main Gate</p>
          </div>
          <button onClick={() => setIsRegistered(!isRegistered)} className="badge-tag bg-slate-200 dark:bg-slate-800 text-slate-500 text-xs shadow-none cursor-pointer hover:bg-slate-300 dark:hover:text-white">
              Mock: {isRegistered ? 'Unregister Student' : 'Register Student'}
          </button>
      </div>

      {!isRegistered ? (
          <div className="bento-card p-12 flex flex-col justify-center items-center text-center dark:bg-red-500/5 border-2 border-dashed border-red-500/30">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                 <AlertTriangle size={32} className="text-red-500" />
              </div>
              <h2 className="text-2xl font-cyber dark:text-white mb-3 tracking-widest">NO REGISTERED EVENT</h2>
              <p className="text-slate-500 font-mono max-w-lg mb-6">Food allocation is strictly bound to active event registrations. Since you are not registered for any ongoing events today, your catering options are digitally masked to prevent unauthorized collection.</p>
              <button onClick={() => setIsRegistered(true)} className="px-6 py-2 bg-brand-500 text-white font-bold rounded shadow-lg shadow-brand-500/30">Re-Sync Registration</button>
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bento-card p-8 dark:bg-black/60 shadow-[0_0_20px_rgba(0,0,0,0.5)] border-t-4 border-t-indigo-500 dark:border-t-cyber-primary rounded-none">
             <div className="flex justify-between items-start mb-4">
                 <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 font-mono">Current Sync Status</h3>
                 <span className="badge-tag shadow-none text-[10px] bg-brand-500/10 text-brand-500 border-none">CodeYuva Challenge</span>
             </div>
             <div className="text-5xl font-black text-indigo-600 dark:text-cyber-primary font-mono mb-6">ELIGIBLE</div>
             <div className="space-y-3">
               <p className="text-slate-500 dark:text-slate-400">Batch Assignment: <strong className="dark:text-white glow-text-cyan">Row A (Seats 1-10)</strong></p>
               <p className="text-slate-500 dark:text-slate-400">Time Window: <strong className="dark:text-white">14:00 - 14:15 hrs</strong></p>
               <p className="text-slate-500 dark:text-slate-400">Menu Category: <strong className="dark:text-emerald-400">Standard Veg Meal</strong></p>
             </div>
          </div>
          <div className="bento-card p-8 dark:bg-black/40 flex flex-col justify-center items-center text-center">
             <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex justify-center items-center mb-4">
                 <AlertTriangle className="text-orange-500" />
             </div>
             <h3 className="font-bold text-lg mb-2 dark:text-white">Standby Protocol</h3>
             <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">Wait for your batch notification before proceeding to the cafeteria.</p>
          </div>
          <div className="md:col-span-2 bento-card p-6 bg-red-50 dark:bg-red-500/10 border-l-4 border-l-red-500">
             <h3 className="text-red-600 dark:text-red-500 font-cyber font-bold mb-2 text-lg">⚠️ WASTAGE PENALTY RULE</h3>
             <p className="text-red-800 dark:text-red-400/80 font-mono text-sm leading-relaxed">
                 The event committee has zero tolerance for food wastage. If you do not collect your food within your assigned Batch window on <strong>three consecutive occasions</strong>, your Event ID will be permanently blacklisted from all future Food distribution queues. Ensure you fetch your meal when 'Row A' is paged out.
             </p>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminAttendanceScan = ({ logs, setLogs }) => {
    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: { width: 250, height: 250 },
            fps: 5,
        });
        
        scanner.render(
            (decodedText) => {
                // Check if it's our mock format AUTH-X-99 or something, but we just log it
                setLogs(prev => [`Scanned: ${decodedText.substring(0,10)}... (Verified)`, ...prev]);
                // Optional: scanner.clear() to stop after 1 scan, but for attendance we keep scanning
            },
            (error) => {
                // Ignore routine scanning frame errors
            }
        );
        
        return () => {
            scanner.clear().catch(error => console.error('Failed to clear scanner', error));
        };
    }, []);

    return (
      <div className="p-10 max-w-6xl mx-auto animate-in fade-in">
         <h1 className="text-3xl font-cyber dark:text-white mb-2">Live QR Attendance Scanner</h1>
         <p className="text-slate-500 font-mono mb-8 dark:text-cyber-primary">Verify node passes continuously</p>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 border-2 border-dashed border-slate-300 dark:border-cyber-primary/50 rounded-3xl dark:rounded-none flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-black/30 text-center relative overflow-hidden">
                <div id="reader" className="w-full h-full bg-white dark:bg-black/80 rounded-xl dark:rounded-none overflow-hidden [&>*]:text-slate-900 [&>*]:dark:text-white border-none shadow-none"></div>
                <div className="mt-4 flex gap-2 w-full">
                    <button className="btn-outline w-full text-xs font-mono">Pause Feed</button>
                    <button className="btn-primary w-full text-xs font-mono">Force Sync</button>
                </div>
            </div>
            <div className="lg:col-span-2 bento-card p-0 overflow-hidden">
               <div className="p-6 border-b border-slate-100 dark:border-cyber-border flex justify-between items-center bg-slate-50 dark:bg-black/80">
                  <h3 className="font-bold dark:text-white font-cyber">Live verification queue</h3>
                  <span className="badge-tag shadow-none text-[10px]">Autosync Active</span>
               </div>
               {logs.map((log, i)=> (
                  <div key={i} className="p-4 border-b border-slate-50 dark:border-cyber-border/30 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                     <div className="flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-emerald-500" />
                        <span className="font-bold dark:text-slate-300 text-sm">{log}</span>
                     </div>
                     <span className="text-xs text-slate-400 font-mono">10:4{i} AM</span>
                  </div>
               ))}
            </div>
         </div>
      </div>
    );
};

const StudentRules = () => (
  <div className="p-10 max-w-5xl mx-auto animate-in fade-in pt-10 pb-20">
    <div className="flex items-center gap-4 mb-6 border-b border-slate-200 dark:border-cyber-border pb-6">
      <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500 dark:bg-cyber-primary/10 dark:text-cyber-primary dark:border dark:border-cyber-primary/50 dark:shadow-[0_0_15px_rgba(0,240,255,0.2)]">
        <BookOpen size={28} />
      </div>
      <div>
        <h1 className="text-3xl font-cyber dark:text-white">Platform Vision & Guidelines</h1>
        <p className="text-slate-500 font-mono dark:text-cyber-secondary mt-1">Understanding the Smart Event Architecture</p>
      </div>
    </div>

    {/* Project Context & Vision for Judges */}
    <div className="mb-8 bento-card p-8 bg-slate-900 border-none rounded-2xl dark:bg-black/60 dark:border dark:border-cyber-primary/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 text-white dark:text-cyber-primary">
           <Activity size={150} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3 font-cyber">What is NexusEvent? (For Judges & Users)</h2>
        <p className="text-slate-300 font-mono text-sm leading-relaxed mb-6 max-w-3xl relative z-10">
          Most large-scale college and corporate events suffer from massive physical bottlenecks: chaotic entry gates, free-for-all seating arguments, and extreme crowds during food distribution. <br/><br/>
          We built this platform to completely digitize the event flow. Our system acts as an autonomous digital bouncer and coordinator.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
           <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
               <strong className="text-cyan-400 block mb-1">⚡ Ultra-Fast Entry</strong>
               <span className="text-xs text-slate-400">Gate entries are processed under 2 seconds. Users present their dynamic QR app or tap their Premium Offline NFC card.</span>
           </div>
           <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
               <strong className="text-purple-400 block mb-1">🍔 Smart Distribution</strong>
               <span className="text-xs text-slate-400">No more stampedes. Users are paged dynamically using Batch IDs (e.g. Delta-14) to control cafeteria crowds.</span>
           </div>
           <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
               <strong className="text-emerald-400 block mb-1">📊 Gamified Credit</strong>
               <span className="text-xs text-slate-400">Behavioral tracking prevents waste. Arriving late or double-claiming food burns EXP, dropping your priority queue.</span>
           </div>
        </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { t: "🆔 Entry Pipeline", b: "border-brand-500 dark:border-cyan-500", c: [
          "Display your dashboard QR at the optical gate",
          "Optional: Use your 74910 Offline Fallback PIN",
          "Alternatively, tap your hardware NFC Pass"
        ]},
        { t: "🪑 Seat Allocation Engine", b: "border-indigo-500 dark:border-purple-500", c: [
           "Seats are locked mathematically upon arrival",
           "Sit precisely on assigned location (e.g. B-42)",
           "Seat changes must be approved by the Grid Admin"
        ]},
        { t: "🍔 Batch Food Matrix", b: "border-emerald-500 dark:border-emerald-500", c: [
          "Wait passively until your Batch ID is called",
          "One-time scan confirms consumption",
          "Our firewall strictly prevents duplicate meals"
        ]},
        { t: "🎟 Digital Compensation", b: "border-orange-500 dark:border-orange-500", c: [
          "In event of stockouts, digital compensation points are instantly wired to your profile."
        ]},
        { t: "💬 Mentorship Query (EHSAAS)", b: "border-pink-500 dark:border-pink-500", c: [
          "Send doubts securely via the EHSAAS component",
          "Toggle Anonymous mode to hide identity from peers"
        ]},
        { t: "📊 Credit Network", b: "border-yellow-500 dark:border-yellow-500", c: [
          "Maintain a score >70 to unlock VIP features",
          "Repeated network violations result in auto-ban"
        ]}
      ].map((rule, idx) => (
        <div key={idx} className={`bento-card p-6 dark:bg-black/40 border-l-4 ${rule.b} rounded-none`}>
          <h3 className="font-bold text-lg dark:text-white mb-4 flex items-center gap-2">{rule.t}</h3>
          <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm font-medium">
            {rule.c.map((text, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-white mt-1.5 flex-shrink-0"></div> {text}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="md:col-span-2 bento-card p-6 dark:bg-red-500/10 border border-red-200 dark:border-red-500 mt-4 rounded-none">
          <h3 className="font-bold text-lg text-red-600 dark:text-red-500 mb-2 flex items-center gap-2">⚠️ Master Overrides</h3>
          <p className="text-slate-600 dark:text-red-400 text-sm font-medium">Do not clone your QR code. Local network nodes will reject identical token hashes automatically. All grid actions are monitored by event volunteers. Thank you.</p>
      </div>
    </div>
  </div>
);

const AdminGuidelines = () => (
  <div className="p-10 max-w-5xl mx-auto animate-in fade-in pt-10 pb-20">
    <div className="flex items-center gap-4 mb-8 border-b border-slate-200 dark:border-cyber-border pb-6">
      <div className="p-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-black dark:shadow-[0_0_15px_rgba(255,255,255,0.4)]">
        <Settings size={28} />
      </div>
      <div>
        <h1 className="text-3xl font-cyber dark:text-white">Admin Guidelines</h1>
        <p className="text-slate-500 font-mono dark:text-cyber-primary mt-1">🧠 System manages event entry, seating, food, and behavior.</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       {[
        { t: "📊 Entry Management", c: ["Ensure QR scanning is working at the gate", "Monitor live attendance"] },
        { t: "🪑 Seating Control", c: ["Seats are assigned automatically (first-come basis)", "Approve or reject seat change requests"] },
        { t: "🍔 Food Management", c: ["Set batch size for distribution", "Monitor food collection via QR scan", "Handle shortages and trigger compensation"] },
        { t: "📶 Offline Mode", c: ["Fetch data before event", "System works on local network", "Sync data to cloud after event"] },
        { t: "🔒 Security", c: ["Prevent duplicate entries", "Monitor suspicious scans"] },
        { t: "💬 EHSAAS Moderation", c: ["Review questions", "Block misuse if needed"] },
        { t: "📈 Credit System", c: ["Monitor user behavior", "Handle appeals fairly"] }
       ].map((guide, idx) => (
          <div key={idx} className={`bento-card p-6 dark:bg-black/60 dark:border-cyber-border border-2 border-dashed hover:border-slate-400 dark:hover:border-cyber-primary transition-colors`}>
            <h3 className="font-bold text-lg dark:text-cyber-primary mb-3 font-cyber text-slate-800">{guide.t}</h3>
            <ul className="space-y-2 text-slate-500 text-sm font-mono dark:text-slate-300">
              {guide.c.map((text, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-brand-500 dark:text-cyber-secondary mt-0.5">▹</span> {text}
                </li>
              ))}
            </ul>
          </div>
       ))}
       <div className="md:col-span-2 p-6 bg-slate-800 text-white dark:bg-cyber-dark dark:border-y dark:border-cyber-primary mt-4 text-center font-mono text-sm leading-relaxed">
          ⚠️ Always ensure smooth flow and avoid crowd congestion. Maintain the grid stability at all cost.
       </div>
    </div>
  </div>
);

const AdminFoodAllocation = ({ attendanceCount }) => {
   const [batches, setBatches] = useState([
      { id: 'Row A (Seats 1-10)', status: 'Active', served: 0, total: 10 },
      { id: 'Row B (Seats 11-20)', status: 'Blocked', served: 0, total: 10 },
      { id: 'Row C (Seats 21-30)', status: 'Blocked', served: 0, total: 10 },
      { id: 'Row D (Seats 31-40)', status: 'Blocked', served: 0, total: 10 },
   ]);
   const [scanLogs, setScanLogs] = useState([]);
   
   const totalServed = batches.reduce((acc, b) => acc + b.served, 0);

   useEffect(() => {
        const scanner = new Html5QrcodeScanner('food-reader', {
            qrbox: { width: 250, height: 250 },
            fps: 5,
        });
        
        scanner.render(
            (decodedText) => {
                setScanLogs(prev => [`Marked Meal: ${decodedText.substring(0,8)}...`, ...prev].slice(0, 5));
                
                setBatches(prev => {
                    let newBatches = [...prev];
                    let activeIdx = newBatches.findIndex(b => b.status === 'Active');
                    if(activeIdx === -1) return prev;
                    
                    let current = { ...newBatches[activeIdx] };
                    if (current.served < current.total) {
                        current.served += 1;
                    }

                    if (current.served === 6 && activeIdx + 1 < newBatches.length) {
                        let next = { ...newBatches[activeIdx + 1] };
                        if (next.status === 'Blocked') {
                            next.status = 'Standby';
                            newBatches[activeIdx + 1] = next;
                        }
                    }
                    
                    if (current.served === current.total) {
                        current.status = 'Completed';
                        newBatches[activeIdx] = current;
                        
                        if (activeIdx + 1 < newBatches.length) {
                            let next = { ...newBatches[activeIdx + 1] };
                            next.status = 'Active';
                            newBatches[activeIdx + 1] = next;
                        }
                    } else {
                        newBatches[activeIdx] = current;
                    }
                    
                    return newBatches;
                });
            },
            (err) => {}
        );
        
        return () => {
             scanner.clear().catch(e => console.error('Failed to clear food scanner', e));
        };
   }, []);

   const handleServe = (batchIdx) => {
       if (totalServed >= attendanceCount) {
            setScanLogs(prev => [`[ERROR] OVERRIDE BLOCKED. Scanned check-ins: ${attendanceCount}. Meals: ${totalServed}`, ...prev].slice(0, 5));
            return;
       }
       setBatches(prev => {
           let newBatches = [...prev];
           let current = { ...newBatches[batchIdx] };
           
           if (current.status !== 'Active') return prev;
           
           if (current.served < current.total) {
               current.served += 1;
           }

           if (current.served === 6 && batchIdx + 1 < newBatches.length) {
               let next = { ...newBatches[batchIdx + 1] };
               if (next.status === 'Blocked') {
                   next.status = 'Standby';
                   newBatches[batchIdx + 1] = next;
               }
           }
           
           if (current.served === current.total) {
               current.status = 'Completed';
               newBatches[batchIdx] = current;
               
               if (batchIdx + 1 < newBatches.length) {
                   let next = { ...newBatches[batchIdx + 1] };
                   next.status = 'Active';
                   newBatches[batchIdx + 1] = next;
               }
           } else {
               newBatches[batchIdx] = current;
           }
           
           return newBatches;
       });
   };

   return (
      <div className="p-10 max-w-6xl mx-auto animate-in fade-in pt-10">
         <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 border-b border-slate-200 dark:border-cyber-border pb-6 gap-4">
            <div>
               <h1 className="text-3xl font-cyber dark:text-white mb-2">Food Distribution Queue</h1>
               <p className="text-slate-500 font-mono dark:text-cyber-secondary">10 Seats/Row logic with 6-Served Standby Threshold Active.</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-xs font-mono font-bold text-slate-500 tracking-widest uppercase">Issued</p>
                    <p className="text-xl font-black text-brand-500 dark:text-cyber-primary">{totalServed} / {attendanceCount}</p>
                </div>
                <div className="badge-tag shadow-none text-xs bg-indigo-500/10 text-indigo-500 border-indigo-500/30">Auto-Queue Enforcement: ON</div>
            </div>
         </div>

         {totalServed >= attendanceCount && (
             <div className="mb-8 bento-card p-4 border border-amber-500/50 bg-amber-50 dark:bg-amber-500/10 flex items-center justify-between rounded-lg">
                 <div>
                     <h3 className="text-amber-600 dark:text-amber-500 font-bold mb-1 font-cyber tracking-widest text-lg">⚠️ SYSTEM ENFORCEMENT PROTOCOL</h3>
                     <p className="text-slate-600 dark:text-amber-400/80 text-xs font-mono">
                         Food distribution is permanently locked until more attendees complete the Gate 1 Check-in.<br/>
                         *This guarantees zero food wastage and prevents duplicate claims.*
                     </p>
                 </div>
                 <div className="text-4xl">🛑</div>
             </div>
         )}
         
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
                <h3 className="font-bold text-lg dark:text-white flex items-center gap-2 mb-4"><Utensils size={18}/> Live Batch Status</h3>
                {batches.map((b, idx) => (
                    <div key={b.id} className={`bento-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${
                        b.status === 'Active' ? 'dark:bg-brand-500/10 border-l-4 border-l-brand-500 shadow-[0_0_20px_rgba(0,240,255,0.1)]' : 
                        b.status === 'Standby' ? 'dark:bg-amber-500/10 border-l-4 border-l-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' :
                        b.status === 'Completed' ? 'dark:bg-emerald-500/10 border-l-4 border-l-emerald-500 opacity-60' : 
                        'dark:bg-red-500/5 border-l-4 border-l-red-500/50 opacity-40'
                    }`}>
                        <div>
                            <div className="flex items-center gap-3">
                               <h3 className="font-black text-xl dark:text-white font-mono">{b.id}</h3>
                               {b.status === 'Active' && <span className="badge-tag bg-brand-500 text-white animate-pulse shadow-none border-none py-0.5 px-2 text-[10px]">CURRENT</span>}
                               {b.status === 'Standby' && <span className="badge-tag bg-amber-500/20 text-amber-500 border-amber-500/30 shadow-none py-0.5 px-2 text-[10px] animate-pulse">PREPARING TO GO</span>}
                               {b.status === 'Blocked' && <span className="badge-tag bg-red-500/20 text-red-500 border-red-500/30 shadow-none py-0.5 px-2 text-[10px]">BLOCKED</span>}
                               {b.status === 'Completed' && <span className="badge-tag bg-emerald-500/20 text-emerald-500 border-emerald-500/30 shadow-none py-0.5 px-2 text-[10px]">SERVED</span>}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Required completion: {b.total} nodes.</p>
                        </div>
                        
                        <div className="flex items-center gap-6 w-full md:w-auto mt-2 md:mt-0">
                            <div className="flex flex-col items-end">
                                <span className="text-2xl font-black font-mono tracking-widest dark:text-white"><span className={b.status === 'Active' ? 'text-brand-500' : ''}>{b.served}</span>/{b.total}</span>
                                <div className="flex gap-1 mt-1 flex-wrap w-[110px] justify-end">
                                    {[...Array(b.total)].map((_, i) => (
                                        <div key={i} className={`w-2 h-2 rounded-full ${i < b.served ? 'bg-brand-500 dark:shadow-[0_0_5px_rgba(0,240,255,0.8)]' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                                    ))}
                                </div>
                            </div>
                            <button 
                                onClick={() => handleServe(idx)}
                                disabled={b.status !== 'Active' || totalServed >= attendanceCount}
                                className={`px-4 py-2 rounded-xl text-sm font-bold font-mono transition-colors border ${
                                    (b.status === 'Active' && totalServed < attendanceCount) ? 'bg-brand-500 text-white border-brand-500 hover:bg-brand-600 shadow-[0_0_15px_rgba(0,240,255,0.3)]' : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-600 cursor-not-allowed cursor-not-allowed'
                                }`}
                            >
                                {(b.status === 'Active' && totalServed >= attendanceCount) ? 'BLOCKED' : 'MANUAL (+1)'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="space-y-6">
                 {/* Optical Scanner for Meal Ticket */}
                 <div className="bento-card p-6 border-2 border-dashed border-brand-500/30 dark:border-cyber-primary/50 dark:bg-black/40 relative overflow-hidden flex flex-col items-center">
                    <h3 className="font-bold text-lg dark:text-white mb-2 font-cyber self-start w-full border-b border-white/10 pb-3">Optical Meal Scanner</h3>
                    <div id="food-reader" className="w-full mt-4 bg-white dark:bg-black/80 rounded-xl overflow-hidden [&>*]:text-slate-900 [&>*]:dark:text-white border-none shadow-none"></div>
                    
                    <div className="w-full mt-4 bg-black/50 p-3 rounded-lg border border-white/5 h-24 overflow-y-auto font-mono text-xs text-brand-400">
                        {scanLogs.length === 0 ? <span className="text-slate-500 tracking-widest">Awaiting scans...</span> : scanLogs.map((log, i) => <div key={i}>&gt; {log}</div>)}
                    </div>
                 </div>

                 <div className="bento-card p-6 dark:bg-black/40 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                         <Settings size={150} className={batches.some(b=>b.status==='Active') ? 'animate-[spin_4s_linear_infinite]' : ''}/>
                     </div>
                     <h3 className="font-bold text-lg dark:text-white mb-2 font-cyber">System Enforcer Rules</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed tracking-wide">
                        <strong className="dark:text-amber-400 block mb-1">THRESHOLD BREACH ALERT (6/10)</strong>
                        When the current Row reaches 6/10 served, the system sends an automatic pager alert to the NEXT ROW to "Get Ready (<span className="text-amber-500">PREPARING TO GO</span>)". <br/><br/>
                        They will only become <span className="text-brand-500 font-bold">CURRENT</span> once all 10 members of the active row have been mapped.
                     </p>
                     
                     <div className="p-4 bg-slate-50 dark:bg-black/60 rounded-xl font-mono text-xs text-slate-600 dark:text-amber-500 space-y-2 border border-slate-100 dark:border-amber-500/20">
                         <p>&gt; Validating Sequence: <span className="text-brand-500">{batches.find(b=>b.status==='Active')?.id || 'All Complete'}</span></p>
                         <p>&gt; Standby Queue: <span className="text-white">{batches.find(b=>b.status==='Standby')?.id || 'None'}</span></p>
                     </div>
                 </div>
            </div>
         </div>
      </div>
   );
};

const StudentSeating = () => (
  <div className="p-10 max-w-4xl mx-auto animate-in fade-in pt-10">
    <h1 className="text-3xl font-cyber dark:text-white mb-8">Seat Allocation Array</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bento-card p-8 dark:bg-black/60 shadow-[0_0_20px_rgba(0,0,0,0.5)] border-t-4 border-t-indigo-500 dark:border-t-cyber-primary rounded-none">
         <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 font-mono">Assigned Grid Location</h3>
         <div className="text-6xl font-black text-indigo-600 dark:text-cyber-primary font-mono mb-6 glow-text-cyan">B-42</div>
         <div className="space-y-3">
           <p className="text-slate-500 dark:text-slate-400">Zone Vector: <strong className="dark:text-white">North Wing</strong></p>
           <p className="text-slate-500 dark:text-slate-400">Power Outlets: <strong className="dark:text-emerald-400">Available</strong></p>
         </div>
      </div>
      <div className="md:col-span-2 bento-card p-6 bg-amber-50 dark:bg-amber-500/10 border-l-4 border-l-amber-500">
         <h3 className="text-amber-600 dark:text-amber-500 font-cyber font-bold mb-2 text-lg">⚠️ GRID POSITION LOCK</h3>
         <p className="text-amber-800 dark:text-amber-400/80 font-mono text-sm leading-relaxed">
             All seating assignments are algorithmically locked based on registration timing and team topology. Changing seats without Grid Admin approval will result in an immediate deduction of <strong className="text-red-500">15 EXP</strong> and disciplinary warning.
         </p>
      </div>
    </div>
  </div>
);

const StudentSupport = () => (
  <div className="p-10 max-w-4xl mx-auto animate-in fade-in pt-10">
    <h1 className="text-3xl font-cyber dark:text-white mb-8">EHSAAS Intelligence (Mentor Q&A)</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="md:col-span-2 bento-card p-6 shadow-none dark:bg-black/40 border border-slate-200 dark:border-white/10">
         <textarea placeholder="Transmit your query to the mentor network..." className="w-full bg-slate-50 dark:bg-black/80 rounded-lg p-4 font-mono text-sm focus:outline-none dark:text-white dark:border-cyber-primary/50 border mb-4 h-32"></textarea>
         <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-brand-500 dark:accent-cyber-primary w-4 h-4" />
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Anonymous Transmission</span>
            </label>
            <button className="px-6 py-2 bg-brand-500 text-white dark:bg-cyber-primary/20 dark:text-cyber-primary dark:border dark:border-cyber-primary font-bold rounded shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:bg-brand-600 hover:scale-105 transition-all">TRANSMIT</button>
         </div>
      </div>
      <div className="md:col-span-2 bento-card p-6 bg-red-50 dark:bg-red-500/10 border-l-4 border-l-red-500">
         <h3 className="text-red-600 dark:text-red-500 font-cyber font-bold mb-2 text-lg">⚠️ NETWORK SPAM DIRECTIVE</h3>
         <p className="text-red-800 dark:text-red-400/80 font-mono text-sm leading-relaxed">
             The EHSAAS module is closely monitored. Spamming the mentor network, transmitting irrelevant data, or abusing the anonymous feature will result in a global mute and a <strong className="text-red-500">-10 EXP penalty</strong> per offense. Always verify the FAQ database before asking.
         </p>
      </div>
    </div>
  </div>
);

export default function App() {
  const [userRole, setUserRole] = useState(null);
  const [theme, setTheme] = useState(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  const [attendanceLogs, setAttendanceLogs] = useState(['Amit Kumar (Verified)', 'Sneha Sharma (Verified)']);
  const navigate = useNavigate();

  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    }
  };

  return (
    <div className={`min-h-screen flex bg-slate-50 dark:bg-cyber-darker dark:dark-grid-bg transition-colors duration-500 selection:bg-brand-500/20 selection:text-brand-900 dark:selection:bg-cyber-primary/30 dark:selection:text-cyber-primary`}>
      
      {/* Top Floating Navbar (Only for landing or if required) */}
      {!userRole && (
        <nav className="fixed top-0 w-full bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-slate-100 dark:border-cyber-border z-50 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-brand-500 dark:bg-transparent dark:border dark:border-cyber-primary text-white dark:text-cyber-primary dark:shadow-[0_0_10px_rgba(0,240,255,0.4)] rounded-lg dark:rounded-none"><CalendarDays size={20} /></div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white dark:font-mono">NexusEvent</span>
            </div>
            
            <div className="flex items-center gap-6">
               <button onClick={toggleTheme} className="text-slate-500 hover:text-slate-900 dark:text-cyber-primary dark:hover:text-white transition-colors" title="Toggle Theme">
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
               </button>
              <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-cyber-primary dark:font-mono">Sign In</Link>
              <Link to="/admin/login" className="px-5 py-2.5 bg-slate-900 dark:bg-cyber-primary/10 text-white dark:text-cyber-primary dark:border dark:border-cyber-primary text-sm font-bold rounded-full dark:rounded-sm hover:bg-slate-800 dark:hover:bg-cyber-primary dark:hover:text-black dark:hover:shadow-[0_0_15px_rgba(0,240,255,0.8)] transition-all shadow-md">
                Admin Login
              </Link>
            </div>
          </div>
        </nav>
      )}

      {userRole && <Sidebar role={userRole} onLogout={() => { setUserRole(null); navigate('/', { replace: true }); }} />}
      
      {/* The main workspace */}
      <main className={`flex-1 transition-all duration-300 ${userRole ? 'ml-72' : 'pt-20'} h-screen overflow-y-auto`}>
        {userRole && (
           <div className="fixed top-6 right-6 z-50">
               <button onClick={toggleTheme} className="p-3 bg-white dark:bg-black text-slate-500 hover:text-slate-900 dark:text-cyber-primary dark:border dark:border-cyber-primary dark:shadow-[0_0_15px_rgba(0,240,255,0.2)] rounded-full dark:rounded-sm transition-colors shadow-lg" title="Toggle Hackathon Theme">
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
               </button>
           </div>
        )}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login role="student" onLogin={r => { setUserRole(r); navigate('/dashboard'); }} />} />
          <Route path="/admin/login" element={<Login role="admin" onLogin={r => { setUserRole(r); navigate('/admin/events'); }} />} />
          
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/qr" element={<StudentQR />} />
          <Route path="/seat" element={<StudentSeating />} />
          <Route path="/food" element={<StudentFood />} />
          <Route path="/ehsaas" element={<StudentSupport />} />
          <Route path="/credit" element={<StudentCredit />} />
          <Route path="/rules" element={<StudentRules />} />
          
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/attendance" element={<AdminAttendanceScan logs={attendanceLogs} setLogs={setAttendanceLogs} />} />
          <Route path="/admin/food" element={<AdminFoodAllocation attendanceCount={attendanceLogs.length} />} />
          <Route path="/admin/settings" element={<PlaceholderPage title="Grid Configurations" icon={Settings} />} />
          <Route path="/admin/rules" element={<AdminGuidelines />} />
        </Routes>
      </main>
    </div>
  );
}
