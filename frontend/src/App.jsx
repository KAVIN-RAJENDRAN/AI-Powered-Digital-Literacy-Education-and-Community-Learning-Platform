import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import { useTheme } from './context/ThemeContext';

// Pages
import Home from './pages/Home';
import LearningCenter from './pages/LearningCenter';
import Simulator from './pages/Simulator';
import Dashboard from './pages/Dashboard';
import ImpactDashboard from './pages/ImpactDashboard';
import Quiz from './pages/Quiz';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

// Global Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChatbot from './components/chatbot/AIChatbot';

function App() {
  const { user, token } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  
  // Custom Hash Router State
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Safe navigation helper
  const navigate = (hash) => {
    window.location.hash = hash;
  };

  // Route resolver
  const renderPage = () => {
    switch (currentPath) {
      case '#/':
        return <Home navigate={navigate} />;
      case '#/courses':
        return user ? <LearningCenter navigate={navigate} /> : <Login navigate={navigate} />;
      case '#/simulator':
        return user ? <Simulator navigate={navigate} /> : <Login navigate={navigate} />;
      case '#/dashboard':
        return user ? <Dashboard navigate={navigate} /> : <Login navigate={navigate} />;
      case '#/impact':
        return <ImpactDashboard navigate={navigate} />;
      case '#/quiz':
        return user ? <Quiz navigate={navigate} /> : <Login navigate={navigate} />;
      case '#/admin':
        return user && user.role === 'admin' ? <AdminDashboard navigate={navigate} /> : <Home navigate={navigate} />;
      case '#/login':
        return <Login navigate={navigate} />;
      case '#/register':
        return <Register navigate={navigate} />;
      default:
        return <Home navigate={navigate} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Accessible Navigation Bar */}
      <Navbar currentPath={currentPath} navigate={navigate} />
      
      {/* Primary Page Canvas */}
      <main className="flex-grow">
        {renderPage()}
      </main>
      
      {/* Shared Footer */}
      <Footer navigate={navigate} />
      
      {/* Floating AI Chatbot Assistant for digital literacy queries */}
      {user && <AIChatbot />}
    </div>
  );
}

export default App;
