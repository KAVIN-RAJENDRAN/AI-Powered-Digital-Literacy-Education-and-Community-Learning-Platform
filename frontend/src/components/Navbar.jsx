import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Sun, Moon, Languages, LogOut, User as UserIcon, BookOpen, ShieldCheck, BarChart3, ShieldAlert } from 'lucide-react';

export default function Navbar({ currentPath, navigate }) {
  const { user, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('#/');
  };

  const navItems = [
    { label: t('navHome'), path: '#/', icon: BookOpen },
    { label: t('navCourses'), path: '#/courses', icon: BookOpen, reqAuth: true },
    { label: t('navSimulator'), path: '#/simulator', icon: ShieldCheck, reqAuth: true },
    { label: t('navDashboard'), path: '#/dashboard', icon: UserIcon, reqAuth: true },
    { label: t('navImpact'), path: '#/impact', icon: BarChart3 },
  ];

  if (user && user.role === 'admin') {
    navItems.push({ label: t('navAdmin'), path: '#/admin', icon: ShieldAlert });
  }

  const activeClass = "bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-lg transition-all duration-300 shadow-md shadow-primary/20 scale-105";
  const inactiveClass = "text-muted-foreground hover:text-foreground hover:bg-muted/50 px-4 py-2 rounded-lg transition-all duration-300";

  return (
    <nav className="sticky top-0 z-40 w-full glass border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('#/')}>
            <span className="text-xl font-extrabold bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary animate-pulse-slow" />
              {t('footerTitle')}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              if (item.reqAuth && !user) return null;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={isActive ? activeClass : inactiveClass}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right Action Widgets */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Switch */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              title="Change Language / மொழியை மாற்றுக"
              aria-label="Change Language"
            >
              <Languages className="h-5 w-5" />
              <span className="text-xs font-bold uppercase">{language}</span>
            </button>

            {/* Dark Mode Switch */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Toggle Dark Mode"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-2 border-l border-border pl-3">
                <span className="text-sm font-medium mr-2 hidden lg:inline-block">
                  {t('welcome')}, <strong className="text-primary">{user.username}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground p-2 rounded-lg transition-colors flex items-center gap-1.5"
                  title={t('navLogout')}
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 border-l border-border pl-3">
                <button
                  onClick={() => navigate('#/login')}
                  className="text-sm font-medium hover:text-primary px-3 py-2 rounded-lg transition-colors"
                >
                  {t('navLogin')}
                </button>
                <button
                  onClick={() => navigate('#/register')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300 shadow-sm"
                >
                  {t('navRegister')}
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button onClick={toggleLanguage} className="p-1.5 rounded-full hover:bg-muted text-muted-foreground">
              <span className="text-xs font-bold uppercase">{language}</span>
            </button>
            <button onClick={toggleTheme} className="p-1.5 rounded-full hover:bg-muted text-muted-foreground">
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label="Open menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border shadow-lg transition-all duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              if (item.reqAuth && !user) return null;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                >
                  {item.label}
                </button>
              );
            })}
            
            {user ? (
              <div className="border-t border-border pt-4 pb-2 px-3">
                <p className="text-sm font-medium text-muted-foreground mb-2">Logged in as: {user.username}</p>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full bg-destructive text-destructive-foreground text-center py-2 rounded-md font-semibold flex items-center justify-center gap-2"
                >
                  <LogOut className="h-4 w-4" /> {t('navLogout')}
                </button>
              </div>
            ) : (
              <div className="border-t border-border pt-4 pb-2 px-3 flex flex-col gap-2">
                <button
                  onClick={() => {
                    navigate('#/login');
                    setIsOpen(false);
                  }}
                  className="w-full border border-border py-2 rounded-md font-semibold hover:bg-muted"
                >
                  {t('navLogin')}
                </button>
                <button
                  onClick={() => {
                    navigate('#/register');
                    setIsOpen(false);
                  }}
                  className="w-full bg-primary text-primary-foreground py-2 rounded-md font-semibold hover:bg-primary/95"
                >
                  {t('navRegister')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
