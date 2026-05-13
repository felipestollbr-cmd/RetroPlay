import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Crown, LogOut, Settings, ChevronDown, Zap, Shield } from 'lucide-react';
import { getUser, logout, getPlan, PLANS, isAdmin } from '../lib/subscription';
import { useNavigate } from 'react-router-dom';

interface UserMenuProps {
  onOpenAuth: () => void;
}

export default function UserMenu({ onOpenAuth }: UserMenuProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const user = getUser();
  const plan = getPlan();
  const admin = isAdmin();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!user) {
    return (
      <button
        onClick={onOpenAuth}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-medium transition-all border border-white/10"
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">Entrar</span>
      </button>
    );
  }

  const nextPlan = !admin ? PLANS.find((p) => p.id !== plan.id && p.price > plan.price) : null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all border border-white/10"
      >
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
            admin
              ? 'bg-gradient-to-br from-red-500 to-rose-600'
              : `bg-gradient-to-br ${plan.gradient}`
          }`}
        >
          {admin ? (
            <Shield className="w-3.5 h-3.5 text-white" />
          ) : (
            <User className="w-3.5 h-3.5 text-white" />
          )}
        </div>
        <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
        {admin && (
          <span className="hidden sm:inline px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold">
            ADMIN
          </span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50"
          >
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <p className="text-white font-bold text-sm">{user.name}</p>
                {admin && (
                  <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold">
                    ADMIN
                  </span>
                )}
              </div>
              <p className="text-white/30 text-xs">{user.email}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <Crown className="w-3.5 h-3.5" style={{ color: admin ? '#f87171' : plan.color }} />
                <span className="text-xs font-medium" style={{ color: admin ? '#f87171' : plan.color }}>
                  {admin ? 'Administrador — Ilimitado' : `Plano ${plan.name}`}
                </span>
              </div>
            </div>

            <div className="p-2">
              {nextPlan && (
                <button
                  onClick={() => { setOpen(false); navigate('/plans'); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-amber-400 hover:bg-amber-500/10 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  <span>Upgrade para {nextPlan.name}</span>
                </button>
              )}
              {!admin && (
                <button
                  onClick={() => { setOpen(false); navigate('/plans'); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Planos e Assinatura</span>
                </button>
              )}
              <button
                onClick={() => { logout(); setOpen(false); window.location.reload(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
