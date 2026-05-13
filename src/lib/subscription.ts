export type PlanType = 'free' | 'pro' | 'premium';

export interface Plan {
  id: PlanType;
  name: string;
  price: number;
  priceUnit: string;
  description: string;
  features: string[];
  limits: {
    dailySearches: number;
    dailyPlays: number;
    aiSearches: number;
    maxRomSizeMB: number;
    saveSlots: number;
    cloudSaves: boolean;
    adFree: boolean;
  };
  color: string;
  gradient: string;
  popular?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceUnit: '/mês',
    description: 'Comece a jogar gratuitamente',
    features: [
      'Acesso a 3 consoles',
      '5 buscas por dia',
      '3 jogadas por dia',
      '1 slot de save',
      'Com anúncios',
    ],
    limits: {
      dailySearches: 5,
      dailyPlays: 3,
      aiSearches: 1,
      maxRomSizeMB: 5,
      saveSlots: 1,
      cloudSaves: false,
      adFree: false,
    },
    color: '#6b7280',
    gradient: 'from-gray-600 to-gray-700',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.90,
    priceUnit: '/mês',
    description: 'Para jogadores casuais',
    features: [
      'Acesso a 6 consoles',
      'Busca ilimitada',
      '20 jogadas por dia',
      'Busca por IA (10/dia)',
      '5 slots de save',
      'Sem anúncios',
    ],
    limits: {
      dailySearches: Infinity,
      dailyPlays: 20,
      aiSearches: 10,
      maxRomSizeMB: 25,
      saveSlots: 5,
      cloudSaves: true,
      adFree: true,
    },
    color: '#6366f1',
    gradient: 'from-indigo-600 to-purple-600',
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 39.90,
    priceUnit: '/mês',
    description: 'Experiência completa',
    features: [
      'Acesso a TODOS os consoles',
      'Busca ilimitada',
      'Jogadas ilimitadas',
      'Busca por IA ilimitada',
      'Saves na nuvem ilimitados',
      'Upload de ROMs até 100MB',
      'Sem anúncios',
      'Suporte prioritário',
    ],
    limits: {
      dailySearches: Infinity,
      dailyPlays: Infinity,
      aiSearches: Infinity,
      maxRomSizeMB: 100,
      saveSlots: Infinity,
      cloudSaves: true,
      adFree: true,
    },
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600',
  },
];

// Admin email — gets unlimited everything
const ADMIN_EMAIL = 'admin@admin.com';

export interface UserSubscription {
  plan: PlanType;
  email: string;
  name: string;
  avatar?: string;
  isAdmin: boolean;
  dailyStats: {
    date: string;
    searches: number;
    plays: number;
    aiSearches: number;
  };
  joinedAt: string;
}

const STORAGE_KEY = 'retroplay_user';
const USER_STORE_KEY = 'retroplay_users';
const ANON_AI_KEY = 'retroplay_anon_ai_count';
const ANON_AI_DATE_KEY = 'retroplay_anon_ai_date';

function isAdminEmail(email: string): boolean {
  return email.toLowerCase().trim() === ADMIN_EMAIL;
}

function getUserStore(): UserSubscription[] {
  try {
    const data = localStorage.getItem(USER_STORE_KEY);
    return data ? (JSON.parse(data) as UserSubscription[]) : [];
  } catch {
    return [];
  }
}

function saveUserStore(users: UserSubscription[]): void {
  localStorage.setItem(USER_STORE_KEY, JSON.stringify(users));
}

function getUserByEmail(email: string): UserSubscription | null {
  const normalized = email.toLowerCase().trim();
  return getUserStore().find((user) => user.email === normalized) ?? null;
}

export function loginUser(email: string): UserSubscription | null {
  const user = getUserByEmail(email);
  if (!user) return null;
  saveUser(user);
  return user;
}

export function getUser(): UserSubscription | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    const user = JSON.parse(data) as UserSubscription;

    // Ensure admin flag is set correctly (for existing users)
    const shouldBeAdmin = isAdminEmail(user.email);
    if (shouldBeAdmin && !user.isAdmin) {
      user.isAdmin = true;
      user.plan = 'premium';
      saveUser(user);
    }

    const today = new Date().toISOString().split('T')[0];
    if (user.dailyStats.date !== today) {
      user.dailyStats = { date: today, searches: 0, plays: 0, aiSearches: 0 };
      saveUser(user);
    }
    return user;
  } catch {
    return null;
  }
}

export function saveUser(user: UserSubscription): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  const users = getUserStore();
  const existingIndex = users.findIndex((item) => item.email === user.email);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  saveUserStore(users);
}

export function createUser(email: string, name: string, plan: PlanType = 'free'): UserSubscription {
  const normalizedEmail = email.toLowerCase().trim();
  const existing = getUserByEmail(normalizedEmail);
  const isAdmin = isAdminEmail(normalizedEmail);
  const today = new Date().toISOString().split('T')[0];

  if (existing) {
    existing.name = name;
    existing.plan = isAdmin ? 'premium' : existing.plan;
    existing.isAdmin = isAdmin;
    saveUser(existing);
    return existing;
  }

  const user: UserSubscription = {
    plan: isAdmin ? 'premium' : plan,
    email: normalizedEmail,
    name,
    isAdmin,
    dailyStats: { date: today, searches: 0, plays: 0, aiSearches: 0 },
    joinedAt: new Date().toISOString(),
  };
  saveUser(user);
  return user;
}

export function updatePlan(plan: PlanType): void {
  const user = getUser();
  if (user && !user.isAdmin) {
    user.plan = plan;
    saveUser(user);
  }
}

export function isAdmin(): boolean {
  const user = getUser();
  return user?.isAdmin === true;
}

export function canSearch(): boolean {
  const user = getUser();
  if (user?.isAdmin) return true;
  if (!user) return true; // Anonymous users can search
  const plan = PLANS.find((p) => p.id === user.plan);
  if (!plan) return false;
  return plan.limits.dailySearches === Infinity || user.dailyStats.searches < plan.limits.dailySearches;
}

export function canPlay(): boolean {
  const user = getUser();
  if (user?.isAdmin) return true;
  if (!user) return true; // Anonymous users can play
  const plan = PLANS.find((p) => p.id === user.plan);
  if (!plan) return false;
  return plan.limits.dailyPlays === Infinity || user.dailyStats.plays < plan.limits.dailyPlays;
}

export function canUseAI(): boolean {
  const user = getUser();
  if (user?.isAdmin) return true;
  if (!user) {
    // Anonymous users get 2 AI searches per day
    const today = new Date().toISOString().split('T')[0];
    const savedDate = sessionStorage.getItem(ANON_AI_DATE_KEY);
    if (savedDate !== today) {
      sessionStorage.setItem(ANON_AI_DATE_KEY, today);
      sessionStorage.setItem(ANON_AI_KEY, '0');
      return true;
    }
    const count = parseInt(sessionStorage.getItem(ANON_AI_KEY) || '0', 10);
    return count < 2;
  }
  const plan = PLANS.find((p) => p.id === user.plan);
  if (!plan) return false;
  return plan.limits.aiSearches === Infinity || user.dailyStats.aiSearches < plan.limits.aiSearches;
}

export function incrementSearch(): void {
  const user = getUser();
  if (user && !user.isAdmin) {
    user.dailyStats.searches++;
    saveUser(user);
  }
}

export function incrementPlay(): void {
  const user = getUser();
  if (user && !user.isAdmin) {
    user.dailyStats.plays++;
    saveUser(user);
  }
}

export function incrementAISearch(): void {
  const user = getUser();
  if (user && !user.isAdmin) {
    user.dailyStats.aiSearches++;
    saveUser(user);
  } else if (!user) {
    const count = parseInt(sessionStorage.getItem(ANON_AI_KEY) || '0', 10);
    sessionStorage.setItem(ANON_AI_KEY, String(count + 1));
  }
}

export function getPlan(): Plan {
  const user = getUser();
  if (user?.isAdmin) {
    return PLANS.find((p) => p.id === 'premium') || PLANS[2];
  }
  return PLANS.find((p) => p.id === (user?.plan || 'free')) || PLANS[0];
}

export function isLoggedIn(): boolean {
  return getUser() !== null;
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getAvailableConsoles(): string[] {
  const user = getUser();
  if (user?.isAdmin) {
    return ['nes', 'gb', 'snes', 'segaMD', 'gba', 'n64', 'psx', 'nds', 'atari2600'];
  }
  const plan = getPlan();
  switch (plan.id) {
    case 'free':
      return ['nes', 'gb', 'snes'];
    case 'pro':
      return ['nes', 'gb', 'snes', 'segaMD', 'gba', 'n64', 'atari2600'];
    case 'premium':
    default:
      return ['nes', 'gb', 'snes', 'segaMD', 'gba', 'n64', 'psx', 'nds', 'atari2600'];
  }
}
