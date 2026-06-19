import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Smartphone, Globe, CreditCard, FileText, ShieldAlert, CheckCircle, ChevronRight, Play, ArrowLeft, ArrowRight, Award } from 'lucide-react';

export default function LearningCenter({ navigate }) {
  const { token, user } = useAuth();
  const { language, t } = useLanguage();
  
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [topics, setTopics] = useState([]);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // MOCK DATA fallback for local standalone state
  const mockModules = [
    { id: 1, title: language === 'ta' ? 'ஸ்மார்ட்போன் அடிப்படைகள்' : 'Smartphone Basics', description: language === 'ta' ? 'அழைப்புகள் செய்ய, தொடர்புகளை சேமிக்க, கேமராவைப் பயன்படுத்த மற்றும் வாட்ஸ்அப் பயன்படுத்த கற்றுக்கொள்ளுங்கள்.' : 'Learn to make calls, save contacts, use the camera, and WhatsApp.', icon: 'Smartphone', estimated_time: 15, topics_count: 4, progress_percentage: 0, is_completed: false },
    { id: 2, title: language === 'ta' ? 'இணைய அடிப்படைகள்' : 'Internet Basics', description: language === 'ta' ? 'இணையதளங்களை உலாவுவது, கூகுளில் தேடுவது மற்றும் மின்னஞ்சல்களை உருவாக்குவது எப்படி என்பதைப் புரிந்து கொள்ளுங்கள்.' : 'Understand how to browse websites, search Google, and create emails.', icon: 'Globe', estimated_time: 20, topics_count: 3, progress_percentage: 0, is_completed: false },
    { id: 3, title: language === 'ta' ? 'டிஜிட்டல் கட்டணங்கள்' : 'Digital Payments', description: language === 'ta' ? 'UPI, QR குறியீடு ஸ்கேனிங், வங்கி இடமாற்றங்கள் மற்றும் பாதுகாப்பான கட்டண நடைமுறைகளை மாஸ்டர் செய்யுங்கள்.' : 'Master UPI, QR code scanning, bank transfers, and safe payment practices.', icon: 'CreditCard', estimated_time: 25, topics_count: 4, progress_percentage: 0, is_completed: false },
    { id: 4, title: language === 'ta' ? 'அரசு சேவைகள்' : 'Government Services', description: language === 'ta' ? 'டிஜிலாக்கர், ஆதார், பான் மற்றும் ரயில் டிக்கெட் முன்பதிவு செய்வதை கற்றுக்கொள்ளுங்கள்.' : 'Learn to access DigiLocker, Aadhaar, PAN, and book railway tickets.', icon: 'FileText', estimated_time: 30, topics_count: 4, progress_percentage: 0, is_completed: false },
    { id: 5, title: language === 'ta' ? 'சைபர் பாதுகாப்பு' : 'Cyber Security', description: language === 'ta' ? 'ஃபிஷிங், மோசடிகள், பாதுகாப்பான கடவுச்சொற்கள் ஆகியவற்றிலிருந்து உங்களைப் பாதுகாத்துக் கொள்ளுங்கள் மற்றும் OTP ஐப் பாதுகாப்பாக வைத்திருங்கள்.' : 'Protect yourself from phishing, scams, secure passwords, and keep OTP safe.', icon: 'ShieldAlert', estimated_time: 20, topics_count: 4, progress_percentage: 0, is_completed: false }
  ];

  const mockTopicsByModule = {
    1: [
      {
        id: 101, title: language === 'ta' ? "அழைப்புகள் மேற்கொள்ளுதல்" : "Making Phone Calls",
        content: language === 'ta' ? "ஸ்மார்ட்போனில் அழைப்பு விடுக்க:\n1. பச்சை நிற 'Phone' ஐகானைத் தட்டவும்.\n2. கீபேடில் எண்களை தட்டச்சு செய்யவும்.\n3. கீழே உள்ள பச்சை பொத்தானை அழுத்தவும்.\n4. பேசிக் முடித்த பின் சிவப்பு பொத்தானை அழுத்தவும்." : "To make a phone call on your smartphone:\n1. Find and tap the green Phone icon on your screen.\n2. Tap the numbers on the keypad dialer.\n3. Tap the green Call button to connect.\n4. Tap the red button to hang up when finished.",
        interactiveType: 'phone'
      },
      {
        id: 102, title: language === 'ta' ? "தொடர்புகளைச் சேமித்தல்" : "Saving Contacts",
        content: language === 'ta' ? "விவரங்களை சேமிக்க:\n1. Contacts செயலியை திறக்கவும்.\n2. '+' குறியீட்டைத் தட்டவும்.\n3. அவர்களின் பெயர் மற்றும் தொலைபேசி எண்ணை தட்டச்சு செய்யவும்.\n4. 'Save' என்பதை அழுத்தவும்." : "To save a new contact:\n1. Open your Contacts app and tap the '+' button.\n2. Type the name and phone number of the person.\n3. Tap the 'Save' button. This saves it to your phone memory.",
        interactiveType: 'contact'
      },
      {
        id: 103, title: language === 'ta' ? "கேமராவைப் பயன்படுத்துதல்" : "Using the Camera",
        content: language === 'ta' ? "புகைப்படம் எடுக்க:\n1. கேமரா செயலியை திறக்கவும்.\n2. போனை நேராக பிடித்து குறிவைக்கவும்.\n3. வட்ட வடிவிலான வெள்ளை பொத்தானை தட்டி படம் பிடிக்கவும்." : "To capture a photo:\n1. Tap the Camera icon.\n2. Hold your smartphone steady and point at your subject.\n3. Tap the big circular white capture button to take the photo.",
        interactiveType: 'camera'
      },
      {
        id: 104, title: language === 'ta' ? "வாட்ஸ்அப் அறிமுகம்" : "Using WhatsApp Chat",
        content: language === 'ta' ? "மெசேஜ் அனுப்ப:\n1. வாட்ஸ்அப் செயலியை திறக்கவும்.\n2. உங்கள் நண்பரின் பெயரைத் தேர்ந்தெடுக்கவும்.\n3. மெசேஜ் பெட்டியில் தட்டச்சு செய்து பச்சை அம்பு குறியை தட்டவும்." : "To send a WhatsApp message:\n1. Open WhatsApp and select a contact.\n2. Tap in the message input box at the bottom.\n3. Type your text message and tap the green send arrow icon.",
        interactiveType: 'whatsapp'
      }
    ],
    3: [
      {
        id: 301, title: language === 'ta' ? "UPI மற்றும் QR குறியீடுகள்" : "UPI PIN & QR Payments",
        content: language === 'ta' ? "பாதுகாப்பாக பணம் அனுப்ப:\n1. Google Pay அல்லது PhonePe போன்ற செயலியைத் திறக்கவும்.\n2. 'Scan QR' என்பதைத் தட்டி கடைக்காரரின் QR குறியீட்டை ஸ்கேன் செய்யவும்.\n3. தொகையை உள்ளிட்டு, உங்களது ரகசிய UPI PIN-ஐ உள்ளிடவும்." : "To make a secure QR payment:\n1. Open your payment app (e.g. Google Pay, PhonePe).\n2. Tap 'Scan QR' and point camera at the store's code.\n3. Enter the amount to transfer and enter your secret UPI PIN.",
        interactiveType: 'upi'
      }
    ]
  };

  useEffect(() => {
    fetchModules();
  }, [language]);

  const fetchModules = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/courses/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setModules(data);
      } else {
        throw new Error();
      }
    } catch (e) {
      // Local Storage state mock for modules
      const savedProgress = JSON.parse(localStorage.getItem('dlh_modules_progress') || '{}');
      const loaded = mockModules.map(m => {
        const p = savedProgress[m.id] || 0;
        return {
          ...m,
          progress_percentage: p,
          is_completed: p >= 100
        };
      });
      setModules(loaded);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectModule = async (m) => {
    setSelectedModule(m);
    setActiveTopicIndex(0);
    setLoading(true);
    
    try {
      const response = await fetch(`/api/courses/${m.id}/topics?lang=${language}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTopics(data.topics);
      } else {
        throw new Error();
      }
    } catch (e) {
      // Fallback
      setTopics(mockTopicsByModule[m.id] || [
        {
          id: m.id * 100 + 1,
          title: language === 'ta' ? 'அறிமுகம்' : 'Introduction Topic',
          content: language === 'ta' ? `${m.title} இன் முக்கியத்துவத்தை விளக்குகிறது. மேலும் அறிய அடுத்த பக்கத்திற்குச் செல்லவும்.` : `This topic introduces ${m.title}. Read through details and proceed to the next step.`,
          interactiveType: 'generic'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTopic = async (topicId) => {
    try {
      await fetch(`/api/courses/topics/${topicId}/complete`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (e) {
      console.warn("Topic complete offline simulation saved locally");
    }

    // Update local state
    const currentProgress = ((activeTopicIndex + 1) / topics.length) * 100;
    
    // Save to local storage
    const savedProgress = JSON.parse(localStorage.getItem('dlh_modules_progress') || '{}');
    savedProgress[selectedModule.id] = Math.max(savedProgress[selectedModule.id] || 0, currentProgress);
    localStorage.setItem('dlh_modules_progress', JSON.stringify(savedProgress));

    setModules(prev => prev.map(m => m.id === selectedModule.id ? {
      ...m,
      progress_percentage: Math.round(Math.max(m.progress_percentage, currentProgress)),
      is_completed: Math.max(m.progress_percentage, currentProgress) >= 100
    } : m));

    if (activeTopicIndex < topics.length - 1) {
      setActiveTopicIndex(prev => prev + 1);
    } else {
      // Finished all topics, prompt to take Quiz!
      alert(language === 'ta' ? "அனைத்து பாடங்களையும் வெற்றிகரமாக முடித்துவிட்டீர்கள்! இப்போது நீங்கள் தேர்வை எழுதலாம்." : "You have completed all topics in this module! You can now take the module quiz.");
      navigate('#/quiz');
    }
  };

  const getModuleIcon = (iconName) => {
    switch (iconName) {
      case 'Smartphone': return Smartphone;
      case 'Globe': return Globe;
      case 'CreditCard': return CreditCard;
      case 'FileText': return FileText;
      case 'ShieldAlert': return ShieldAlert;
      default: return BookOpen;
    }
  };

  // Interactive UI Simulation elements
  const renderInteractiveWorkspace = (type) => {
    switch (type) {
      case 'phone':
        return <PhoneSimulator onComplete={() => handleCompleteTopic(topics[activeTopicIndex].id)} />;
      case 'upi':
        return <UPISimulator onComplete={() => handleCompleteTopic(topics[activeTopicIndex].id)} />;
      case 'camera':
        return <CameraSimulator onComplete={() => handleCompleteTopic(topics[activeTopicIndex].id)} />;
      case 'whatsapp':
        return <WhatsAppSimulator onComplete={() => handleCompleteTopic(topics[activeTopicIndex].id)} />;
      default:
        return (
          <div className="bg-card border border-border rounded-2xl p-8 text-center flex flex-col justify-center items-center h-full">
            <Award className="h-16 w-16 text-primary mb-4 animate-float" />
            <h4 className="text-lg font-bold mb-2">Read and Learn</h4>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
              Review the guidelines in the text box above and click the button to complete this step.
            </p>
            <button
              onClick={() => handleCompleteTopic(topics[activeTopicIndex].id)}
              className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:bg-primary/95 transition-all shadow-md"
            >
              Mark Step as Completed
            </button>
          </div>
        );
    }
  };

  if (loading && modules.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center font-bold text-lg text-muted-foreground flex flex-col items-center gap-3">
          <Smartphone className="h-10 w-10 animate-bounce text-primary" />
          {t('loading')}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {!selectedModule ? (
        // Module List View
        <div>
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-foreground mb-2 tracking-tight">
              {t('navCourses')}
            </h1>
            <p className="text-muted-foreground max-w-2xl readable-text-lg">
              Beginner-friendly step-by-step modules to master your smartphone, access public services, and transact online safely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((m) => {
              const Icon = getModuleIcon(m.icon);
              return (
                <div
                  key={m.id}
                  className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Icon className="h-6 w-6" />
                      </div>
                      {m.is_completed && (
                        <span className="bg-emerald-500/15 text-emerald-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-500/20">
                          <CheckCircle className="h-3 w-3" /> Completed
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-2">{m.title}</h3>
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed">{m.description}</p>
                  </div>

                  <div>
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{m.progress_percentage}%</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full transition-all duration-500"
                          style={{ width: `${m.progress_percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectModule(m)}
                      className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      Start Learning
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Single Module Topics view
        <div>
          <button
            onClick={() => {
              setSelectedModule(null);
              fetchModules();
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-8 bg-card border border-border px-4 py-2 rounded-xl transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Modules
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <span className="text-xs font-bold text-primary uppercase tracking-wide">
                  Step {activeTopicIndex + 1} of {topics.length}
                </span>
                <h2 className="text-2xl font-extrabold mt-1 mb-4 text-foreground">
                  {topics[activeTopicIndex]?.title}
                </h2>
                
                <div className="bg-muted/40 p-5 rounded-xl border border-border/40 text-sm leading-relaxed whitespace-pre-line text-foreground readable-text-lg">
                  {topics[activeTopicIndex]?.content}
                </div>
              </div>

              {/* Steps progression bar indicator */}
              <div className="flex justify-between items-center bg-card border border-border px-6 py-4 rounded-xl shadow-sm">
                <button
                  disabled={activeTopicIndex === 0}
                  onClick={() => setActiveTopicIndex(prev => prev - 1)}
                  className="p-2 border border-border hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                
                <div className="flex gap-1.5">
                  {topics.map((_, i) => (
                    <span
                      key={i}
                      className={`h-2 rounded-full transition-all ${i === activeTopicIndex ? 'bg-primary w-6' : 'bg-muted w-2'}`}
                    ></span>
                  ))}
                </div>

                <button
                  disabled={activeTopicIndex === topics.length - 1}
                  onClick={() => setActiveTopicIndex(prev => prev + 1)}
                  className="p-2 border border-border hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Right Simulator Column */}
            <div className="lg:col-span-6 h-[450px]">
              {renderInteractiveWorkspace(topics[activeTopicIndex]?.interactiveType)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------- SUB SIMULATOR COMPONENTS ----------------

// 1. Phone dialpad simulator
function PhoneSimulator({ onComplete }) {
  const [dialNum, setDialNum] = useState('');
  const [calling, setCalling] = useState(false);

  const pressNum = (num) => {
    if (dialNum.length < 10) setDialNum(prev => prev + num);
  };

  const handleCall = () => {
    if (dialNum.length >= 10) {
      setCalling(true);
      setTimeout(() => {
        setCalling(false);
        setDialNum('');
        onComplete();
      }, 3000);
    } else {
      alert("Please dial a valid 10-digit number.");
    }
  };

  return (
    <div className="bg-slate-950 w-72 mx-auto rounded-3xl border-8 border-slate-800 h-full p-4 flex flex-col justify-between text-white shadow-2xl relative overflow-hidden">
      {calling ? (
        <div className="flex flex-col items-center justify-center h-full space-y-6 animate-pulse-slow">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center">
            <Smartphone className="h-10 w-10 text-white" />
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-widest">Calling...</p>
            <h4 className="text-lg font-bold mt-1">{dialNum}</h4>
          </div>
          <button onClick={() => setCalling(false)} className="bg-red-500 hover:bg-red-600 p-4 rounded-full transition-colors mt-10">
            <X className="h-6 w-6 text-white" />
          </button>
        </div>
      ) : (
        <>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 h-14 flex items-center justify-end text-2xl font-bold tracking-wider overflow-hidden">
            {dialNum || "Dial..."}
          </div>
          <div className="grid grid-cols-3 gap-2 my-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((btn) => (
              <button
                key={btn}
                onClick={() => pressNum(btn)}
                className="bg-slate-800 hover:bg-slate-700 active:bg-slate-600 font-bold p-3 rounded-full flex items-center justify-center text-lg transition-colors"
              >
                {btn}
              </button>
            ))}
          </div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setDialNum('')}
              className="bg-slate-800 hover:bg-slate-700 p-3 rounded-full flex items-center justify-center transition-colors"
              title="Clear"
            >
              Clear
            </button>
            <button
              onClick={handleCall}
              className="bg-emerald-500 hover:bg-emerald-600 p-4 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-md shadow-emerald-500/20"
              title="Call"
            >
              <Smartphone className="h-6 w-6 text-white" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// 2. UPI Pin payment simulator
function UPISimulator({ onComplete }) {
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = () => {
    if (pin.length === 4 || pin.length === 6) {
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        setSuccess(true);
        setTimeout(() => {
          onComplete();
        }, 1500);
      }, 2000);
    } else {
      alert("Please enter a 4 or 6 digit PIN.");
    }
  };

  return (
    <div className="bg-slate-900 w-72 mx-auto rounded-3xl border-8 border-slate-800 h-full p-4 flex flex-col justify-between text-white shadow-2xl relative overflow-hidden">
      {success ? (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-white animate-bounce" />
          </div>
          <h4 className="text-xl font-bold text-emerald-400">Payment Successful</h4>
          <p className="text-xs text-slate-400">Transferred Rs. 150 to Grocery Store</p>
        </div>
      ) : (
        <>
          <div>
            <div className="border-b border-slate-800 pb-2 mb-4 text-center">
              <h4 className="text-sm font-bold text-slate-300">Enter UPI PIN</h4>
              <p className="text-[10px] text-slate-400 mt-1">Paying Grocery Store: Rs. 150</p>
            </div>
            
            <div className="flex justify-center gap-2 my-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 border-2 rounded-lg flex items-center justify-center text-xl font-bold ${pin.length > i ? 'border-primary bg-slate-800' : 'border-slate-700 bg-transparent'}`}
                >
                  {pin.length > i ? "•" : ""}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="grid grid-cols-3 gap-2 my-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, "Clear", 0, "OK"].map((btn) => (
                <button
                  key={btn}
                  onClick={() => {
                    if (btn === "Clear") setPin('');
                    else if (btn === "OK") handlePay();
                    else if (pin.length < 4) setPin(prev => prev + btn);
                  }}
                  className={`font-semibold p-2.5 rounded-xl flex items-center justify-center text-sm transition-colors ${btn === "OK" ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-800 hover:bg-slate-700'}`}
                >
                  {btn}
                </button>
              ))}
            </div>
            {processing && (
              <p className="text-xs text-center text-amber-400 animate-pulse mt-2">Processing secure payment...</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// 3. Camera simulator
function CameraSimulator({ onComplete }) {
  const [photoTaken, setPhotoTaken] = useState(false);
  const [loading, setLoading] = useState(false);

  const capturePhoto = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPhotoTaken(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    }, 1000);
  };

  return (
    <div className="bg-black w-72 mx-auto rounded-3xl border-8 border-slate-800 h-full flex flex-col justify-between text-white shadow-2xl relative overflow-hidden">
      {photoTaken ? (
        <div className="flex flex-col items-center justify-center h-full bg-slate-900/60 p-4">
          <div className="border-4 border-emerald-500 rounded-xl overflow-hidden shadow-2xl w-48 h-64 flex items-center justify-center bg-slate-800 mb-4 animate-pulse-slow">
            <span className="text-xs font-bold text-emerald-400 text-center px-4">✓ Photo Saved to Gallery</span>
          </div>
        </div>
      ) : (
        <>
          {/* Viewfinder */}
          <div className="flex-grow bg-slate-950 flex items-center justify-center relative border border-slate-800 m-2 rounded-xl">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Viewfinder screen</span>
            {loading && <span className="absolute inset-0 bg-white/20 animate-pulse"></span>}
          </div>
          
          {/* Controls */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-center items-center">
            <button
              onClick={capturePhoto}
              className="w-16 h-16 bg-white hover:bg-slate-100 rounded-full border-4 border-slate-400 active:scale-90 transition-transform flex items-center justify-center shadow-lg"
              title="Capture"
            ></button>
          </div>
        </>
      )}
    </div>
  );
}

// 4. WhatsApp simulator
function WhatsAppSimulator({ onComplete }) {
  const [messages, setMessages] = useState([
    { sender: 'them', text: "Hello! Did you learn WhatsApp basics?" }
  ]);
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { sender: 'me', text }]);
    setText('');

    // Simulate reply
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'them', text: "Wow, excellent! That is awesome." }]);
      setTimeout(() => {
        onComplete();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="bg-slate-900 w-72 mx-auto rounded-3xl border-8 border-slate-800 h-full flex flex-col justify-between text-white shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="bg-[#075E54] p-3 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm">
          F
        </div>
        <div>
          <h4 className="font-bold text-xs">Family Member</h4>
          <span className="text-[9px] text-emerald-300">online</span>
        </div>
      </div>

      {/* Messages Canvas */}
      <div className="flex-grow p-3 space-y-2 overflow-y-auto bg-[#ECE5DD]/10">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-2 rounded-lg text-xs max-w-[80%] ${m.sender === 'me' ? 'bg-[#DCF8C6] text-black rounded-tr-none' : 'bg-slate-800 text-white rounded-tl-none'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Footer input */}
      <div className="p-2 border-t border-slate-800 flex gap-1.5 items-center bg-slate-950">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          className="flex-grow bg-slate-900 border border-slate-800 rounded-full px-3 py-1.5 text-xs text-white focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-[#128C7E] text-white p-2 rounded-full flex items-center justify-center shrink-0"
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
