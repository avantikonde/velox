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
    authService.initDB();
    const users: StoredUserAccount[] = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');

    const email = (googleEmail || 'builder.monad@gmail.com').toLowerCase();
    const name = googleName || email.split('@')[0];

    let user = users.find(u => u.email.toLowerCase() === email);

    if (!user) {
      // Create new account linked with Google
      const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const newAddress = `0x${randomHex}`;

      user = {
        id: `usr_google_${Date.now()}`,
        username: name.toLowerCase().replace(/\s+/g, '_'),
        email,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        authProvider: 'google',
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

  // Logout
  logout: (): void => {
    localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
  }
};
