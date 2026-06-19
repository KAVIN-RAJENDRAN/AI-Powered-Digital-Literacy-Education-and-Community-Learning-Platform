import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, ShieldAlert, Award, Star, Compass, Smartphone, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Home({ navigate }) {
  const { t } = useLanguage();

  const statistics = [
    {
      label: t('statTrained'),
      count: "24,500+",
      sub: t('statTrainedSub'),
      icon: Compass,
      color: "from-blue-500 to-indigo-500"
    },
    {
      label: t('statCompleted'),
      count: "62,000+",
      sub: t('statCompletedSub'),
      icon: BookOpen,
      color: "from-purple-500 to-pink-500"
    },
    {
      label: t('statSafety'),
      count: "84.5%",
      sub: t('statSafetySub'),
      icon: ShieldCheck,
      color: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <div className="relative overflow-hidden pb-16">
      {/* Background blobs for premium depth */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-24 md:pb-20 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6 animate-pulse-slow">
          <Award className="h-4 w-4" /> Supporting Digital India
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-foreground via-primary to-indigo-600 bg-clip-text text-transparent">
          {t('heroTitle')}
        </h1>
        
        <p className="max-w-3xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 readable-text-lg">
          {t('heroSubtitle')}
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={() => navigate('#/courses')}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/95 text-base font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/35 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
          >
            {t('ctaStart')}
            <ArrowRight className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => navigate('#/simulator')}
            className="w-full sm:w-auto bg-card border border-border text-foreground hover:bg-muted/50 text-base font-semibold px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
          >
            {t('ctaSimulator')}
          </button>
        </div>
      </section>

      {/* Statistics section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statistics.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r ${stat.color}`}></div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-extrabold text-foreground mb-1">{stat.count}</h3>
                    <p className="text-xs text-muted-foreground">{stat.sub}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Success stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-foreground mb-4 readable-heading-xl">
            {t('successTitle')}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t('successSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Story 1 */}
          <div className="bg-card border border-border/60 rounded-2xl p-8 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition-all">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 text-white font-extrabold text-xl shadow-md">
              <Smartphone className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-500" />)}
              </div>
              <p className="text-base text-foreground leading-relaxed italic mb-4 readable-text-lg">
                "{t('testimonial1Text')}"
              </p>
              <h4 className="font-bold text-sm text-primary">{t('testimonial1Author')}</h4>
            </div>
          </div>

          {/* Story 2 */}
          <div className="bg-card border border-border/60 rounded-2xl p-8 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition-all">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shrink-0 text-white font-extrabold text-xl shadow-md">
              <ShieldAlert className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-500" />)}
              </div>
              <p className="text-base text-foreground leading-relaxed italic mb-4 readable-text-lg">
                "{t('testimonial2Text')}"
              </p>
              <h4 className="font-bold text-sm text-primary">{t('testimonial2Author')}</h4>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
