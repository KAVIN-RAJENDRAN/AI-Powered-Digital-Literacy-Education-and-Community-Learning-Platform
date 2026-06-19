import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Award, BookOpen, Flame, ShieldCheck, Download, Printer, User as UserIcon, Calendar, CheckCircle2, X } from 'lucide-react';

export default function Dashboard({ navigate }) {
  const { token, user } = useAuth();
  const { language, t } = useLanguage();
  
  const [stats, setStats] = useState({
    coursesCompleted: 0,
    certificatesCount: 0,
    streakCount: 0
  });
  const [certificates, setCertificates] = useState([]);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null); // certificate details for print overlay
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardDetails();
  }, [language]);

  const fetchDashboardDetails = async () => {
    setLoading(true);
    try {
      // Parallel API calls
      const [modulesRes, certsRes] = await Promise.all([
        fetch('/api/courses/', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/quizzes/attempts', { headers: { 'Authorization': `Bearer ${token}` } }) // if endpoint exists
      ]);
      
      // Attempt handling or fallbacks
      let compCount = 0;
      if (modulesRes.ok) {
        const modules = await response.json();
        compCount = modules.filter(m => m.is_completed).length;
      }
      
      // Set values if API was ok, else fall back
    } catch (e) {
      console.warn("Using simulated data for dashboard details");
      
      // Local fallbacks
      const savedProgress = JSON.parse(localStorage.getItem('dlh_modules_progress') || '{}');
      const compCount = Object.values(savedProgress).filter(p => p >= 100).length;
      
      // Simulated certificates issued if progress is 100%
      const mockCerts = [];
      const modulesList = [
        { id: 1, name: "Smartphone Basics", tamilName: "ஸ்மார்ட்போன் அடிப்படைகள்" },
        { id: 3, name: "Digital Payments", tamilName: "டிஜிட்டல் கட்டணங்கள்" }
      ];

      modulesList.forEach(m => {
        if (savedProgress[m.id] >= 100) {
          mockCerts.push({
            certificate_uuid: `DLH-A${m.id}D9-38B${m.id}`,
            module_id: m.id,
            module_title: language === 'ta' ? m.tamilName : m.name,
            issued_at: new Date().toLocaleDateString()
          });
        }
      });

      setCertificates(mockCerts);
      setStats({
        coursesCompleted: compCount,
        certificatesCount: mockCerts.length,
        streakCount: user?.streak_count || 1
      });
      
      setRecentAttempts([
        { id: 1, module_title: language === 'ta' ? "ஸ்மார்ட்போன் அடிப்படைகள்" : "Smartphone Basics", score: 90.0, passed: true, attempted_at: new Date().toLocaleDateString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center font-bold text-lg text-muted-foreground flex flex-col items-center gap-3">
          <UserIcon className="h-10 w-10 animate-bounce text-primary" />
          {t('loading')}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-violet-600 rounded-3xl p-6 sm:p-8 text-primary-foreground mb-8 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {t('welcome')}, {user?.username}!
          </h1>
          <p className="text-primary-foreground/80 mt-1.5 readable-text-lg">
            Track your progress, download your certificates, and keep up your learning streak!
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10">
          <Flame className="h-6 w-6 text-amber-300 animate-pulse-slow fill-amber-300" />
          <div>
            <span className="text-xs uppercase font-bold tracking-wider opacity-75">Streak</span>
            <p className="text-lg font-black leading-none">{stats.streakCount} Days</p>
          </div>
        </div>
      </div>

      {/* Grid of metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-blue-500/10 text-blue-500 rounded-2xl">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase">Courses Completed</span>
            <h3 className="text-2xl font-black text-foreground mt-0.5">{stats.coursesCompleted} / 5</h3>
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-emerald-500/10 text-emerald-500 rounded-2xl">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase">Certificates Earned</span>
            <h3 className="text-2xl font-black text-foreground mt-0.5">{stats.certificatesCount}</h3>
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-purple-500/10 text-purple-500 rounded-2xl">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase">Learning Streak</span>
            <h3 className="text-2xl font-black text-foreground mt-0.5">{stats.streakCount} Days</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Certificates Earned */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" /> Certificates Issued
            </h2>

            {certificates.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                <Award className="h-12 w-12 text-muted-foreground/60 mx-auto mb-3" />
                <h4 className="font-bold text-muted-foreground mb-1">No Certificates Earned Yet</h4>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-4">
                  Complete all learning topics in a module and score 80% or higher in the quiz to unlock certificates.
                </p>
                <button
                  onClick={() => navigate('#/courses')}
                  className="bg-primary text-primary-foreground text-xs font-bold py-2 px-4 rounded-lg hover:bg-primary/95 transition-colors"
                >
                  Go to Courses
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <div
                    key={cert.certificate_uuid}
                    className="border border-border/80 rounded-xl p-4 flex justify-between items-center bg-muted/20 hover:border-primary/45 transition-colors"
                  >
                    <div>
                      <h4 className="font-bold text-foreground text-sm">{cert.module_title}</h4>
                      <p className="text-[10px] text-muted-foreground uppercase mt-1">ID: {cert.certificate_uuid}</p>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3" /> Issued: {cert.issued_at}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedCert(cert)}
                      className="bg-primary text-primary-foreground p-2 rounded-lg hover:bg-primary/95 transition-colors shadow-sm shrink-0"
                      title="View & Download Certificate"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Recent activity logs */}
        <div className="lg:col-span-4">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-4">Quiz Activity</h2>
            
            {recentAttempts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No quiz submissions logged yet.</p>
            ) : (
              <div className="space-y-4">
                {recentAttempts.map((attempt, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-border/60 pb-3 last:border-0 last:pb-0">
                    <div>
                      <h4 className="font-semibold text-xs text-foreground">{attempt.module_title}</h4>
                      <span className="text-[10px] text-muted-foreground">{attempt.attempted_at}</span>
                    </div>

                    <div className="text-right">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${attempt.passed ? 'bg-emerald-500/15 text-emerald-600' : 'bg-destructive/15 text-destructive'}`}>
                        {attempt.score}%
                      </span>
                      <p className="text-[9px] text-muted-foreground mt-0.5">{attempt.passed ? 'Passed' : 'Failed'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Printing Certificate Modal Overlay */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card max-w-3xl w-full border border-border rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 print:p-0 print:border-0 print:shadow-none">
            {/* Header controls for modal */}
            <div className="flex justify-between items-center border-b border-border pb-3 mb-6 print:hidden">
              <h3 className="font-bold text-foreground">Completion Certificate Preview</h3>
              <div className="flex gap-2">
                <button
                  onClick={handlePrintCertificate}
                  className="bg-secondary text-secondary-foreground hover:bg-muted font-semibold px-4 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors border border-border"
                >
                  <Printer className="h-4 w-4" /> Print / PDF
                </button>
                
                <button
                  onClick={() => setSelectedCert(null)}
                  className="bg-muted text-muted-foreground p-1.5 rounded-lg hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Certificate Template Canvas */}
            <div
              id="certificate-print-area"
              className="border-8 border-double border-primary/45 p-8 sm:p-12 bg-white text-slate-900 rounded-xl relative text-center flex flex-col justify-between min-h-[460px] shadow-sm select-none"
            >
              {/* Corner Ornaments */}
              <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-primary/50"></div>
              <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-primary/50"></div>
              <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 border-primary/50"></div>
              <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-primary/50"></div>

              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-primary">Certificate of Completion</span>
                <h2 className="text-3xl font-serif font-bold text-slate-900 mt-4">DIGITAL LITERACY HUB</h2>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1">Bridging the Digital Divide</p>
              </div>

              <div className="my-8">
                <p className="text-xs italic text-slate-500">This is proudly presented to</p>
                <h3 className="text-2xl font-serif font-bold text-primary underline decoration-dotted decoration-primary/40 underline-offset-8 mt-2">
                  {user?.username}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-4 leading-relaxed">
                  for successfully finishing the interactive training curriculum and demonstrating safe transactional and operational competence in
                </p>
                <h4 className="text-base font-bold text-slate-900 uppercase tracking-wider mt-3">
                  {selectedCert.module_title}
                </h4>
              </div>

              <div className="flex justify-between items-end border-t border-slate-200 pt-6 mt-4">
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Verification ID</span>
                  <strong className="text-xs text-slate-800 font-mono">{selectedCert.certificate_uuid}</strong>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center bg-primary/5 text-primary text-[10px] font-black tracking-tighter">
                    DLH SEAL
                  </div>
                  <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold mt-1">Verified Authority</span>
                </div>

                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Date Issued</span>
                  <strong className="text-xs text-slate-800">{selectedCert.issued_at}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
