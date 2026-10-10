import { User } from '../types';

const USERS_STORAGE_KEY = 'velox_users_db';
const ACTIVE_USER_STORAGE_KEY = 'velox_active_user';

interface StoredUserAccount extends User {
  passwordHash?: string;
}

// Initial pre-seeded database
const DEFAULT_USERS: StoredUserAccount[] = [
  {
    id: 'usr_1',
    username: 'monad_degen',
    email: 'trader@monad.xyz',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    authProvider: 'email',
    passwordHash: 'password123',
    createdAt: '2026-09-15',
    monadWalletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
  },
  {
    id: 'usr_google',
    username: 'alex_monad',
    email: 'alex.dev@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    authProvider: 'google',
    createdAt: '2026-10-01',
    monadWalletAddress: '0x32A89F01bc7d92837fE76281bAA8192A0B577719'
  }
];

export const authService = {
  // Initialize Database
  initDB: (): void => {
    if (!localStorage.getItem(USERS_STORAGE_KEY)) {
      const legacy = localStorage.getItem('monadpump_users_db');
      localStorage.setItem(USERS_STORAGE_KEY, legacy || JSON.stringify(DEFAULT_USERS));
    }
  },

  // Get current active session
  getCurrentUser: (): User | null => {
    try {
      const stored = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  // Login via Username/Email & Password
  loginWithEmail: async (emailOrUsername: string, password: string): Promise<User> => {
    authService.initDB();
    const users: StoredUserAccount[] = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    
    const user = users.find(
      u => (u.email.toLowerCase() === emailOrUsername.toLowerCase() || u.username.toLowerCase() === emailOrUsername.toLowerCase())
    );

    if (!user) {
      throw new Error('No user account found with this email or username.');
    }

    if (user.passwordHash && user.passwordHash !== password) {
      throw new Error('Incorrect password. Please try again.');
    }

    const { passwordHash, ...safeUser } = user;
    localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(safeUser));
    return safeUser;
  },

  // Register via Username, Email & Password
  registerWithEmail: async (username: string, email: string, password: string): Promise<User> => {
    authService.initDB();
    const users: StoredUserAccount[] = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');

    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      throw new Error('An account with this email address already exists.');
    }

    const usernameExists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
    if (usernameExists) {
      throw new Error('This username is already taken. Please choose another.');
    }

    // Generate random Monad wallet address
    const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newAddress = `0x${randomHex}`;

    const newUser: StoredUserAccount = {
      id: `usr_${Date.now()}`,
      username: username.trim(),
      email: email.trim().toLowerCase(),
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      authProvider: 'email',
      passwordHash: password,
      createdAt: new Date().toISOString().split('T')[0],
      monadWalletAddress: newAddress
    };

    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    const { passwordHash: _, ...safeUser } = newUser;
    localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(safeUser));
    return safeUser;
  },

  // Google Authentication Link / Sign-In
  loginWithGoogle: async (googleEmail?: string, googleName?: string): Promise<User> => {
    return authService.loginWithSocial('google', googleEmail, googleName);
  },

  // Universal Social Sign-in (Google, Apple, GitHub)
  loginWithSocial: async (
    provider: 'google' | 'apple' | 'github',
    customEmail?: string,
    customName?: string
  ): Promise<User> => {
    authService.initDB();
    const users: StoredUserAccount[] = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');

    const fallbackEmail = provider === 'google' 
      ? 'builder.monad@gmail.com' 
      : provider === 'apple' 
        ? 'trader.apple@icloud.com' 
        : 'monad.coder@github.com';

    const email = (customEmail || fallbackEmail).toLowerCase();
    const defaultName = customName || (email.split('@')[0]);

    let user = users.find(u => u.email.toLowerCase() === email);

    if (!user) {
      const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const newAddress = `0x${randomHex}`;

      const avatar = provider === 'github'
        ? 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80'
        : provider === 'apple'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80';

      user = {
        id: `usr_${provider}_${Date.now()}`,
        username: defaultName.toLowerCase().replace(/\s+/g, '_'),
        email,
        avatarUrl: avatar,
        authProvider: provider,
        createdAt: new Date().toISOString().split('T')[0],
        monadWalletAddress: newAddress
      };

      users.push(user);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }

    const { passwordHash: _, ...safeUser } = user;
    localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(safeUser));
    return safeUser;
  },

  // Instant passwordless sign in with email
  loginWithEmailOnly: async (email: string): Promise<User> => {
    authService.initDB();
    const users: StoredUserAccount[] = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    const cleanEmail = email.trim().toLowerCase();

    let user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      const username = cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');
      const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      user = {
        id: `usr_email_${Date.now()}`,
        username,
        email: cleanEmail,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        authProvider: 'email',
        createdAt: new Date().toISOString().split('T')[0],
        monadWalletAddress: `0x${randomHex}`
      };
      users.push(user);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }

    const { passwordHash: _, ...safeUser } = user;
    localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(safeUser));
    return safeUser;
  },

  // Link / Sign in with connected device wallet address
  loginWithWalletAddress: async (address: string, walletName?: string): Promise<User> => {
    authService.initDB();
    const users: StoredUserAccount[] = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    const cleanAddr = address.toLowerCase();

    let user = users.find(u => u.monadWalletAddress.toLowerCase() === cleanAddr);
    if (!user) {
      const shortHandle = `${walletName?.toLowerCase() || 'trader'}_${address.slice(2, 6)}`;
      user = {
        id: `usr_wallet_${Date.now()}`,
        username: shortHandle,
        email: `${shortHandle}@velox.app`,
        avatarUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=100&auto=format&fit=crop&q=80',
        authProvider: 'wallet',
        createdAt: new Date().toISOString().split('T')[0],
        monadWalletAddress: address
      };
      users.push(user);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }

    const { passwordHash: _, ...safeUser } = user;
    localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(safeUser));
    return safeUser;
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
  }
};
