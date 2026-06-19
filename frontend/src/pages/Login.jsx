import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login({ navigate }) {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setSubmitting(true);
    
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('#/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Incorrect credentials. Try admin@dlh.org / admin123');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper shortcut login buttons for ease of testing
  const loginQuickly = async (quickEmail, quickPass) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    setError('');
    setSubmitting(true);
    try {
      const result = await login(quickEmail, quickPass);
      if (result.success) {
        navigate('#/dashboard');
      }
    } catch (err) {
      setError('Quick login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
            {t('loginTitle')}
          </h2>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm flex items-start gap-2 animate-pulse-slow">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2" htmlFor="email-input">
              {t('emailLabel')}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground">
                <Mail className="h-5 w-5" />
              </span>
              <input
                id="email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@dlh.org"
                className="w-full bg-muted/30 border border-border/80 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2" htmlFor="password-input">
              {t('passwordLabel')}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground">
                <Lock className="h-5 w-5" />
              </span>
              <input
                id="password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-muted/30 border border-border/80 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/95 text-base font-bold py-3.5 rounded-xl transition-all duration-300 shadow-md shadow-primary/20 flex items-center justify-center gap-2"
          >
            {submitting ? t('loading') : t('submitLogin')}
            <ArrowRight className="h-5 w-5" />
          </button>
        </form>

        {/* Quick Testing Accounts */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs font-semibold text-muted-foreground mb-3 text-center uppercase tracking-wider">Quick Access for Testing / விரைவு உள்நுழைவு:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => loginQuickly('citizen@dlh.org', 'citizen123')}
              className="bg-muted hover:bg-muted/80 text-xs font-bold py-2.5 px-3 rounded-lg border border-border transition-colors text-foreground text-center"
            >
              Citizen Account (Ravi)
            </button>
            <button
              onClick={() => loginQuickly('admin@dlh.org', 'admin123')}
              className="bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary text-xs font-bold py-2.5 px-3 rounded-lg transition-colors text-center"
            >
              Admin Dashboard (Stats)
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm">
          <button
            onClick={() => navigate('#/register')}
            className="text-primary hover:underline font-semibold"
          >
            {t('noAccount')}
          </button>
        </div>
      </div>
    </div>
  );
}
