import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext(null);

export const translations = {
  en: {
    navHome: "Home",
    navCourses: "Learning Modules",
    navSimulator: "Safety Simulator",
    navDashboard: "My Dashboard",
    navImpact: "Community Impact",
    navAdmin: "Admin",
    navChatbot: "AI Assistant",
    navLogin: "Sign In",
    navRegister: "Sign Up",
    navLogout: "Logout",
    
    // Home Page
    heroTitle: "Learn Digital Skills. Stay Safe Online.",
    heroSubtitle: "A professional learning platform designed to help rural citizens, seniors, students, and new smartphone users master technology and secure payments.",
    ctaStart: "Start Learning Now",
    ctaSimulator: "Try Safety Simulator",
    
    statTrained: "People Trained",
    statCompleted: "Courses Completed",
    statSafety: "Digital Safety Score",
    statTrainedSub: "Empowering rural communities",
    statCompletedSub: "Bite-sized modules finished",
    statSafetySub: "Phishing & scam awareness",
    
    successTitle: "Real Stories of Digital Success",
    successSubtitle: "See how digital literacy has transformed everyday lives across the state.",
    
    testimonial1Text: "Learning UPI payments here helped me accept digital money at my vegetable stall. I no longer worry about change!",
    testimonial1Author: "M. Selvam, Vegetable Vendor (Age 48)",
    testimonial2Text: "I was scared of phone scams. The Digital Safety Simulator showed me exactly how to detect fake SMS and OTP frauds.",
    testimonial2Author: "K. Saraswathi, Grandmother (Age 64)",
    
    // Footer
    footerTitle: "Digital Literacy Hub",
    footerSubtitle: "Bridging the digital divide and enabling a safe, cashless society for every citizen.",
    footerCopyright: "© 2026 Digital Literacy Hub. Supported by Community Impact Initiative.",

    // Login/Register
    loginTitle: "Sign In to Your Account",
    registerTitle: "Create Your Free Account",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    usernameLabel: "Full Name",
    languagePreference: "Preferred Language",
    rolePreference: "Account Type",
    haveAccount: "Already have an account? Sign In",
    noAccount: "Don't have an account? Sign Up",
    submitLogin: "Sign In",
    submitRegister: "Create Account",

    // Common
    welcome: "Welcome back",
    back: "Back",
    next: "Next",
    submit: "Submit",
    congrats: "Congratulations!",
    tryAgain: "Try Again",
    loading: "Loading..."
  },
  ta: {
    navHome: "முகப்பு",
    navCourses: "கற்றல் தொகுதிகள்",
    navSimulator: "பாதுகாப்பு சிமுலேட்டர்",
    navDashboard: "எனது டாஷ்போர்டு",
    navImpact: "சமூக தாக்கம்",
    navAdmin: "நிர்வாகம்",
    navChatbot: "AI உதவியாளர்",
    navLogin: "உள்நுழைக",
    navRegister: "பதிவு செய்க",
    navLogout: "வெளியேறு",
    
    // Home Page
    heroTitle: "டிஜிட்டல் திறன்களைக் கற்றுக்கொள்ளுங்கள். பாதுகாப்பாக இருங்கள்.",
    heroSubtitle: "கிராமப்புற மக்கள், முதியவர்கள், மாணவர்கள் மற்றும் புதிய ஸ்மார்ட்போன் பயனர்கள் தொழில்நுட்பம் மற்றும் பாதுகாப்பான கட்டணங்களை மாஸ்டர் செய்ய உதவும் வகையில் வடிவமைக்கப்பட்ட தளம்.",
    ctaStart: "இப்போதே கற்கத் தொடங்குங்கள்",
    ctaSimulator: "பாதுகாப்பை சோதிக்கவும்",
    
    statTrained: "பயிற்சி பெற்ற மக்கள்",
    statCompleted: "முடிக்கப்பட்ட படிப்புகள்",
    statSafety: "டிஜிட்டல் பாதுகாப்பு மதிப்பெண்",
    statTrainedSub: "கிராமப்புற சமூகங்களை மேம்படுத்துதல்",
    statCompletedSub: "வழிகாட்டப்பட்ட தொகுதிகள்",
    statSafetySub: "மோசடி விழிப்புணர்வு மதிப்பெண்",
    
    successTitle: "டிஜிட்டல் வெற்றிகளின் நிஜக் கதைகள்",
    successSubtitle: "டிஜிட்டல் அறிவு நம் மக்களின் அன்றாட வாழ்க்கையை எவ்வாறு மாற்றியுள்ளது என்பதைப் பாருங்கள்.",
    
    testimonial1Text: "இங்கு UPI கட்டணங்களைக் கற்றுக்கொண்டது எனது காய்கறி கடையில் டிஜிட்டல் பணத்தை ஏற்க உதவியது. சில்லறை தட்டுப்பாடு இல்லை!",
    testimonial1Author: "எம். செல்வம், காய்கறி வியாபாரி (வயது 48)",
    testimonial2Text: "தொலைபேசி மோசடிகளைக் கண்டு பயந்தேன். போலி SMS மற்றும் OTP மோசடிகளைக் கண்டறிவது எப்படி என்பதை பாதுகாப்பு சிமுலேட்டர் எனக்குக் காட்டியது.",
    testimonial2Author: "கே. சரஸ்வதி, பாட்டி (வயது 64)",
    
    // Footer
    footerTitle: "டிஜிட்டல் அறிவு மையம்",
    footerSubtitle: "டிஜிட்டல் இடைவெளியைக் குறைத்து, ஒவ்வொரு குடிமகனுக்கும் பாதுகாப்பான, பணமில்லா சமூகத்தை செயல்படுத்துகிறது.",
    footerCopyright: "© 2026 டிஜிட்டல் அறிவு மையம். சமூக தாக்க முன்முயற்சியின் ஆதரவுடன்.",

    // Login/Register
    loginTitle: "உங்கள் கணக்கில் உள்நுழைக",
    registerTitle: "இலவச கணக்கை உருவாக்குங்கள்",
    emailLabel: "மின்னஞ்சல் முகவரி",
    passwordLabel: "கடவுச்சொல்",
    usernameLabel: "முழு பெயர்",
    languagePreference: "விருப்பமான மொழி",
    rolePreference: "கணக்கு வகை",
    haveAccount: "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக",
    noAccount: "கணக்கு இல்லையா? பதிவு செய்க",
    submitLogin: "உள்நுழைக",
    submitRegister: "கணக்கை உருவாக்கு",

    // Common
    welcome: "மீண்டும் வருக",
    back: "பின்னால்",
    next: "அடுத்து",
    submit: "சமர்ப்பி",
    congrats: "வாழ்த்துகள்!",
    tryAgain: "மீண்டும் முயற்சி",
    loading: "ஏற்றப்படுகிறது..."
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('dlh_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('dlh_language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'ta' : 'en'));
  };

  const t = (key) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
