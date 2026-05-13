import { Link, useLocation } from 'react-router-dom';
import { Gamepad2, Home, Search, Upload, Sparkles, Menu, X, Compass } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GamepadStatus from './GamepadStatus';
import UserMenu from './UserMenu';
import AuthModal from './AuthModal';
import { isLoggedIn } from '../lib/subscription';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleAuthSuccess = () => {
    setLoggedIn(true);
    setAuthOpen(false);
  };

  const navItems = [
    { path: '/', icon: Compass, label: 'Descobrir' },
    { path: '/search', icon: Search, label: 'Buscar' },
    { path: '/ai-search', icon: Sparkles, label: 'IA' },
    { path: '/upload', icon: Upload, label: 'ROMs' },
  ];

  const isPlayer = location.pathname.startsWith('/play/');

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {!isPlayer && (
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled
              ? 'bg-[#0f0f1a]/95 backdrop-blur-xl shadow-lg shadow-black/30'
              : 'bg-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                  <Gamepad2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    RetroPlay
                  </span>
                  <span className="hidden sm:inline text-[10px] text-white/20 ml-2 font-medium tracking-wider uppercase">
                    Curadoria
                  </span>
                </div>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? 'bg-white/10 text-white'
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
                <div className="ml-2 flex items-center gap-2">
                  <GamepadStatus />
                  <UserMenu onOpenAuth={() => setAuthOpen(true)} />
                </div>
              </nav>

              <div className="flex items-center gap-2 md:hidden">
                <GamepadStatus />
                <UserMenu onOpenAuth={() => setAuthOpen(true)} />
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-xl bg-white/5 text-white/80 hover:bg-white/10 transition-colors"
                >
                  {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      <AnimatePresence>
        {menuOpen && !isPlayer && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#0f0f1a]/98 backdrop-blur-xl pt-20 px-4 md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-4 rounded-2xl text-lg font-medium transition-all ${
                      active
                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={!isPlayer ? 'pt-16' : ''}>{children}</main>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onSuccess={handleAuthSuccess} />
    </div>
  );
}
