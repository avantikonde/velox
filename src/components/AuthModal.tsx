import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [emailOrUser, setEmailOrUser] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [password, setPassword] = useState('');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [showGoogleInput, setShowGoogleInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Google Auth
  const handleGoogleAuth = async (emailToUse?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const email = emailToUse || (customGoogleEmail ? customGoogleEmail : 'builder.monad@gmail.com');
      const user = await authService.loginWithGoogle(email);
      setTimeout(() => {
        setIsLoading(false);
        onAuthSuccess(user);
        onClose();
      }, 500);
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'Google authentication failed.');
    }
  };

  // Handle Email / Password Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUser || !password) {
      setError('Please fill in both email/username and password.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const user = await authService.loginWithEmail(emailOrUser, password);
      setIsLoading(false);
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'Login failed.');
    }
  };

  // Handle Email / Password Sign Up
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupUsername || !signupEmail || !password) {
      setError('Please fill in all registration fields.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const user = await authService.registerWithEmail(signupUsername, signupEmail, password);
      setIsLoading(false);
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'Sign up failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0D111A] border border-white/10 p-6 sm:p-7 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="w-10 h-10 mx-auto mb-2.5 rounded-xl bg-[#836EF9]/15 text-[#A78BFA] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white">
            {tab === 'signin' ? 'Sign in to MonadPump' : 'Create your Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Trade at 10,000 TPS with instant token launches
          </p>
        </div>

        {/* Tab Switcher: Sign in | Sign up */}
        <div className="flex rounded-xl bg-[#131926] p-1 border border-white/[0.06] mb-5 text-xs font-mono font-medium">
          <button
            onClick={() => {
              setTab('signin');
              setError(null);
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              tab === 'signin' ? 'bg-[#836EF9] text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign in
          </button>
          <button
            onClick={() => {
              setTab('signup');
              setError(null);
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              tab === 'signup' ? 'bg-[#836EF9] text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Authentication Section */}
        <div className="space-y-2.5 mb-5 font-mono">
          <button
            onClick={() => handleGoogleAuth()}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2.5 py-2 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs transition-all shadow-md active:scale-98 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.97 0 12s.45 3.84 1.24 5.42l4.04-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Custom Google Email input toggle */}
          <div className="text-center font-sans">
            <button
              onClick={() => setShowGoogleInput(!showGoogleInput)}
              className="text-[11px] text-slate-400 hover:text-[#A78BFA] transition-colors"
            >
              {showGoogleInput ? 'Hide custom Google account' : 'Sign in with specific Google email'}
            </button>
          </div>

          {showGoogleInput && (
            <div className="flex gap-2 animate-in fade-in duration-150">
              <input
                type="email"
                placeholder="your.email@gmail.com"
                value={customGoogleEmail}
                onChange={(e) => setCustomGoogleEmail(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-[#131926] border border-white/10 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-[#836EF9]"
              />
              <button
                onClick={() => handleGoogleAuth(customGoogleEmail)}
                className="px-3 py-1.5 rounded-lg bg-[#836EF9] text-white text-xs font-semibold hover:bg-[#7259f7]"
              >
                Link
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4 font-mono text-[10px] text-slate-500">
          <div className="border-t border-white/[0.08] w-full"></div>
          <span className="bg-[#0D111A] px-2.5 uppercase tracking-wider whitespace-nowrap">
            or email
          </span>
          <div className="border-t border-white/[0.08] w-full"></div>
        </div>

        {/* Email Sign In Form */}
        {tab === 'signin' ? (
          <form onSubmit={handleEmailLogin} className="space-y-3 font-mono text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1 font-sans">
                Email or Username
              </label>
              <div className="relative">
                <UserIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="trader@monad.xyz"
                  value={emailOrUser}
                  onChange={(e) => setEmailOrUser(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#131926] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#836EF9]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1 font-sans">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#131926] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#836EF9]"
                />
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#836EF9] hover:bg-[#7259f7] text-white text-xs font-bold transition-all active:scale-98 disabled:opacity-50 shadow-md shadow-[#836EF9]/20"
              >
                {isLoading ? 'Verifying session...' : 'Sign in ⚡'}
              </button>
            </div>
          </form>
        ) : (
          /* Email Sign Up Form */
          <form onSubmit={handleEmailSignup} className="space-y-3 font-mono text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1 font-sans">
                Username
              </label>
              <div className="relative">
                <UserIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="monad_trader"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#131926] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#836EF9]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1 font-sans">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#131926] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#836EF9]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1 font-sans">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#131926] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#836EF9]"
                />
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold transition-all active:scale-98 disabled:opacity-50 shadow-md"
              >
                {isLoading ? 'Creating account...' : 'Create Account 🚀'}
              </button>
            </div>
          </form>
        )}

        {/* Security Footer Notice */}
        <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Non-custodial Monad Wallet
          </span>
          <span className="text-emerald-400 font-medium">10,000 TPS</span>
        </div>

      </div>
    </div>
  );
};
