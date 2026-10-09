import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { User } from '../types';
import { authService } from '../services/authService';
import { AuroraButton } from './AuroraButton';

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
      }, 600);
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
      <div className="relative w-full max-w-md rounded-3xl glass-panel p-6 sm:p-8 bg-[#0a1220]/95 border border-[#EB96FF]/30 shadow-2xl shadow-[#EB96FF]/20 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-[#0B5777] via-[#EB96FF] to-[#F9D4E0] p-[2px] shadow-lg shadow-[#EB96FF]/30">
            <div className="w-full h-full bg-[#070c16] rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#EB96FF]" />
            </div>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {tab === 'signin' ? 'Sign in to MonadPump' : 'Create your Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access high-speed trading, portfolio tracking, and instant token launches
          </p>
        </div>

        {/* Tab Switcher: Sign in | Sign up */}
        <div className="flex rounded-xl bg-[#193153]/50 p-1 border border-white/5 mb-6 text-xs font-semibold">
          <button
            onClick={() => {
              setTab('signin');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              tab === 'signin' ? 'bg-[#EB96FF] text-[#070c16] font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign in
          </button>
          <button
            onClick={() => {
              setTab('signup');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              tab === 'signup' ? 'bg-[#EB96FF] text-[#070c16] font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Authentication Section */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleGoogleAuth()}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs transition-all shadow-md active:scale-98 disabled:opacity-50"
          >
            {/* Multi-color Google SVG Icon */}
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

          {/* Toggle for custom Google email */}
          <div className="text-center">
            <button
              onClick={() => setShowGoogleInput(!showGoogleInput)}
              className="text-[11px] text-slate-400 hover:text-[#EB96FF] transition-colors"
            >
              {showGoogleInput ? 'Hide custom Google account' : 'Sign in with a specific Google email'}
            </button>
          </div>

          {showGoogleInput && (
            <div className="flex gap-2 animate-in fade-in duration-200">
              <input
                type="email"
                placeholder="your.email@gmail.com"
                value={customGoogleEmail}
                onChange={(e) => setCustomGoogleEmail(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-[#193153]/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#EB96FF]"
              />
              <button
                onClick={() => handleGoogleAuth(customGoogleEmail)}
                className="px-3 py-1.5 rounded-lg bg-[#0B5777] text-white text-xs font-semibold hover:bg-[#0B5777]/80"
              >
                Link
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-white/10 w-full"></div>
          <span className="bg-[#0a1220] px-3 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            Or with email & password
          </span>
          <div className="border-t border-white/10 w-full"></div>
        </div>

        {/* Email Sign In Form */}
        {tab === 'signin' ? (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email or Username
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="trader@monad.xyz or monad_degen"
                  value={emailOrUser}
                  onChange={(e) => setEmailOrUser(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#193153]/40 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#EB96FF] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#193153]/40 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#EB96FF]"
                />
              </div>
            </div>

            <div className="pt-2">
              <AuroraButton
                type="submit"
                loading={isLoading}
                loadingText="Verifying session..."
                size="md"
                className="w-full"
              >
                Sign in ⚡
              </AuroraButton>
            </div>
          </form>
        ) : (
          /* Email Sign Up Form */
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Username
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. monad_chog"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#193153]/40 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#EB96FF] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#193153]/40 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#EB96FF] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#193153]/40 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#EB96FF]"
                />
              </div>
            </div>

            <div className="pt-2">
              <AuroraButton
                type="submit"
                loading={isLoading}
                loadingText="Creating account..."
                size="md"
                className="w-full"
              >
                Create Account 🚀
              </AuroraButton>
            </div>
          </form>
        )}

        {/* Security Footer Notice */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Non-custodial Monad Wallet linked
          </span>
          <span className="font-mono text-[#EB96FF]">10k TPS Ready</span>
        </div>

      </div>
    </div>
  );
};
