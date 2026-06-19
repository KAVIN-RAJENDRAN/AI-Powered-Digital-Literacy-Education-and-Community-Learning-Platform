import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

export default function Register({ navigate }) {
  const { register } = useAuth();
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lang, setLang] = useState('en');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setSubmitting(true);
    
    try {
      const result = await register(username, email, password, role, lang);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('#/login');
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
            {t('registerTitle')}
          </h2>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm flex items-start gap-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 text-sm flex items-start gap-2">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <span>Account created successfully! Redirecting to login...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-1.5" htmlFor="reg-username">
              {t('usernameLabel')}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground">
                <User className="h-5 w-5" />
              </span>
              <input
                id="reg-username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ravi Kumar"
                className="w-full bg-muted/30 border border-border/80 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-1.5" htmlFor="reg-email">
              {t('emailLabel')}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground">
                <Mail className="h-5 w-5" />
              </span>
              <input
                id="reg-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@dlh.org"
                className="w-full bg-muted/30 border border-border/80 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-1.5" htmlFor="reg-password">
              {t('passwordLabel')}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground">
                <Lock className="h-5 w-5" />
              </span>
              <input
                id="reg-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-muted/30 border border-border/80 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5" htmlFor="reg-lang">
                {t('languagePreference')}
              </label>
              <select
                id="reg-lang"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none text-foreground"
              >
                <option value="en">English</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5" htmlFor="reg-role">
                {t('rolePreference')}
              </label>
              <select
                id="reg-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none text-foreground"
              >
                <option value="user">Citizen (User)</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/95 text-base font-bold py-3 rounded-xl transition-all duration-300 shadow-md shadow-primary/20 flex items-center justify-center gap-2 mt-6"
          >
            {submitting ? t('loading') : t('submitRegister')}
            <ArrowRight className="h-5 w-5" />
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <button
            onClick={() => navigate('#/login')}
            className="text-primary hover:underline font-semibold"
          >
            {t('haveAccount')}
          </button>
        </div>
      </div>
    </div>
  );
}
