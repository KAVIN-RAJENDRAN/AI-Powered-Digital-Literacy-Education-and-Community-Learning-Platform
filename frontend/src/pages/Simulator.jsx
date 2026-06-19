import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, ShieldAlert, CheckCircle, AlertTriangle, Eye, HelpCircle, ArrowRight } from 'lucide-react';

export default function Simulator({ navigate }) {
  const { token, user } = useAuth();
  const { language, t } = useLanguage();
  
  const [scenarios, setScenarios] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // true = safe, false = scam
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [showClues, setShowClues] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);

  // MOCK DATA Fallback
  const mockScenarios = [
    {
      id: 1,
      type: "sms",
      title: language === 'ta' ? "பரிசு வென்ற SMS" : "Lottery Win SMS",
      content: language === 'ta' 
        ? "வாழ்த்துகள்! நீங்கள் ரூ. 10 லட்சம் பரிசுப் போட்டியில் வென்றுள்ளீர்கள். உங்கள் பரிசை உடனடியாகப் பெற இந்த இணைப்பைக் கிளிக் செய்க: http://win-lott-secure.in/claim" 
        : "CONGRATULATIONS! You have won a cash lottery of Rs. 10 Lakhs. Click this link: http://win-lott-secure.in/claim to claim your prize immediately!",
      is_safe: false,
      clues: language === 'ta' 
        ? ["win-lott-secure.in என்பது அரசு தளம் அல்ல.", "உடனடியாகப் பெறவும் என்ற அவசர வார்த்தை.", "அதிகப்படியான வாழ்த்துகள்."] 
        : ["win-lott-secure.in is not an official domain.", "Urgency: 'claim immediately' creates panic/haste.", "Random capitalizations and exclamation marks."],
      explanation: language === 'ta'
        ? "அதிகாரப்பூர்வ நிறுவனங்கள் ஒருபோதும் சீரற்ற பரிசுகளை வழங்க இணைப்புகளை கிளிக் செய்யுமாறு கேட்காது."
        : "Official organizations and banks never send SMS alerts with unofficial URLs requesting details to claim random prizes."
    },
    {
      id: 2,
      type: "email",
      title: language === 'ta' ? "வங்கி கணக்கு முடக்கம் எச்சரிக்கை" : "Urgent Bank Account Suspension",
      content: language === 'ta'
        ? "மதிப்பிற்குரிய வாடிக்கையாளரே, உங்கள் வங்கியின் பாதுகாப்பான பயன்பாட்டில் சந்தேகத்திற்கிடமான செயல்பாடுகள் கண்டறியப்பட்டுள்ளன. 24 மணி நேரத்திற்குள் http://hdlf-bank-kyc-status.net இல் உங்கள் KYC விவரங்களை புதுப்பிக்கவும்."
        : "Dear Customer, Your bank account has been flagged for suspicious activities. To prevent permanent suspension, update your KYC details within 24 hours at http://hdlf-bank-kyc-status.net.",
      is_safe: false,
      clues: language === 'ta'
        ? ["hdlf-bank-kyc-status.net என்பது வங்கியின் அசல் முகவரி அல்ல.", "பொதுவான வாழ்த்து.", "24 மணி நேர அச்சுறுத்தல்."]
        : ["Look at the sender domain: hdlf-bank-kyc-status.net (misspelled bank name).", "Suspension threat: creates fear.", "Generic greeting ('Dear Customer') instead of your name."],
      explanation: language === 'ta'
        ? "வங்கி கணக்கு விவரங்களையோ KYC விவரங்களையோ மின்னஞ்சல் இணைப்புகள் மூலம் வங்கிகள் கேட்காது."
        : "Banks never request sensitive details or updates through links in emails. If urgent, visit the bank branch or official app."
    },
    {
      id: 3,
      type: "call",
      title: language === 'ta' ? "வங்கி சரிபார்ப்பு அழைப்பு" : "Verification OTP Call",
      content: language === 'ta'
        ? "[தொலைபேசி அழைப்பு]: 'வணக்கம், நான் ஸ்டேட் பேங்க் மேலாளர் பேசுகிறேன். உங்கள் டெபிட் கார்டு இன்றுடன் முடிகிறது. அதை புதுப்பிக்க உங்கள் மொபைலுக்கு வந்துள்ள 6 இலக்க OTP எண்ணைக் கூறவும்.'"
        : "[Voice Call]: 'Hello, I am calling from State Bank support. Your debit card is expiring today. I have sent an activation code to your mobile. Please read out the 6-digit OTP code to reactivate your card immediately.'",
      is_safe: false,
      clues: language === 'ta'
        ? ["வங்கி ஊழியர் OTP-ஐக் கேட்கிறார்.", "இன்றே முடிகிறது என்ற போலி அவசரம்."]
        : ["The caller asks for your OTP code.", "Urgency: 'Expiring today' forces quick actions.", "Real banks state they never ask for OTPs."],
      explanation: language === 'ta'
        ? "வங்கி ஊழியர்கள், வாடிக்கையாளர் சேவை மையத்தினர் உட்பட எவரும் ஒருபோதும் OTP அல்லது கடவுச்சொற்களைக் கேட்க மாட்டார்கள்."
        : "Bank staff will never call you to request your OTP, PIN, CVV, or passwords. OTP is for security transactions and must remain secret."
    },
    {
      id: 4,
      type: "payment",
      title: language === 'ta' ? "UPI மூலம் பணம் பெறுதல்" : "UPI Money Receive Request",
      content: language === 'ta'
        ? "[UPI கட்டண அறிவிப்பு]: 'பெறுநர்: citizen@dlh.org. அனுப்பியவரிடமிருந்து ரூ. 5,000 பெற 'PAY' பொத்தானை அழுத்தி UPI PIN-ஐ உள்ளிடவும்.'"
        : "[UPI Notification Screen]: 'Requesting Rs. 5,000 from: citizen@dlh.org. Click PAY to receive money in your account.'",
      is_safe: false,
      clues: language === 'ta'
        ? ["பணம் பெறுவதற்கு 'PAY' பொத்தானை அழுத்தச் சொல்கிறது.", "UPI PIN உள்ளீடு செய்யக் கேட்கிறது."]
        : ["Action request: Click 'PAY' to receive money.", "UPI PIN entry is required. You do not need a PIN to receive money."],
      explanation: language === 'ta'
        ? "பணம் பெற ஒருபோதும் UPI PIN-ஐ தட்டச்சு செய்ய வேண்டியதில்லை. PIN என்பது பணம் அனுப்புவதற்கு மட்டுமே."
        : "You never need to enter your UPI PIN to receive money. PIN is exclusively for sending money or debiting accounts."
    }
  ];

  useEffect(() => {
    fetchScenarios();
  }, [language]);

  const fetchScenarios = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/simulator/scenarios?lang=${language}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setScenarios(data);
      } else {
        throw new Error();
      }
    } catch (e) {
      setScenarios(mockScenarios);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = (choice) => {
    setSelectedAnswer(choice);
    setIsEvaluated(true);
    
    // Check correctness
    const currentScenario = scenarios[activeIdx];
    if (choice === currentScenario.is_safe) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsEvaluated(false);
    setShowClues(false);
    if (activeIdx < scenarios.length - 1) {
      setActiveIdx(prev => prev + 1);
    } else {
      // Completed simulator
      alert(language === 'ta' ? `சிமுலேட்டர் முடிந்தது! உங்களது மதிப்பெண்: ${score}/${scenarios.length}` : `Simulator completed! Your score: ${score}/${scenarios.length}`);
      navigate('#/dashboard');
    }
  };

  if (loading && scenarios.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center font-bold text-lg text-muted-foreground flex flex-col items-center gap-3">
          <ShieldCheck className="h-10 w-10 animate-bounce text-primary" />
          {t('loading')}
        </div>
      </div>
    );
  }

  const currentScenario = scenarios[activeIdx];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-500 mb-4">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          {t('navSimulator')}
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto mt-2 readable-text-lg">
          Practice identifying cyber threats in real-life simulations. Train yourself to spot fake calls, scams, and banking fraud.
        </p>
      </div>

      {/* Simulator Interface */}
      <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
        {/* Progress Header */}
        <div className="bg-muted/50 px-6 py-4 flex justify-between items-center border-b border-border/80">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Scenario {activeIdx + 1} of {scenarios.length}
          </span>
          <span className="text-xs font-semibold text-emerald-500">
            Score: {score} / {scenarios.length}
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Title of scenario */}
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            {currentScenario?.title}
          </h2>

          {/* Core Content Box (representing SMS, Screen or Call prompt) */}
          <div className="bg-slate-950 text-white font-mono p-5 rounded-xl border border-slate-800 relative overflow-hidden shadow-inner min-h-[140px] flex flex-col justify-center">
            {/* Interface device frame simulation */}
            <div className="absolute top-2 left-4 flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            </div>
            
            <p className="text-sm mt-4 leading-relaxed whitespace-pre-line select-none">
              {currentScenario?.content}
            </p>
          </div>

          {/* Action Choice Buttons */}
          {!isEvaluated ? (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswerSubmit(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="h-5 w-5" /> Safe (அபாயமற்றது)
              </button>
              
              <button
                onClick={() => handleAnswerSubmit(false)}
                className="bg-destructive hover:bg-destructive/95 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
              >
                <ShieldAlert className="h-5 w-5" /> Scam / Unsafe (மோசடி)
              </button>
            </div>
          ) : (
            // Evaluated Feedback
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className={`p-5 rounded-xl border flex gap-3 ${selectedAnswer === currentScenario.is_safe ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
                {selectedAnswer === currentScenario.is_safe ? (
                  <CheckCircle className="h-6 w-6 shrink-0 text-emerald-500" />
                ) : (
                  <AlertTriangle className="h-6 w-6 shrink-0 text-destructive" />
                )}
                <div>
                  <h4 className="font-extrabold text-base">
                    {selectedAnswer === currentScenario.is_safe ? "Correct Answer! (சரியான விடை!)" : "Incorrect Answer! (தவறான விடை!)"}
                  </h4>
                  <p className="text-sm mt-1 leading-relaxed text-foreground/80 whitespace-pre-line readable-text-lg">
                    {currentScenario?.explanation}
                  </p>
                </div>
              </div>

              {/* Clues Reveal section */}
              <div>
                <button
                  onClick={() => setShowClues(!showClues)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary hover:underline"
                >
                  <Eye className="h-4 w-4" /> {showClues ? "Hide Clues (குறிப்புகளை மறை)" : "Reveal Clues (குறிப்புகளைக் காட்டு)"}
                </button>
                
                {showClues && (
                  <div className="mt-3 bg-muted/40 border border-border p-4 rounded-xl space-y-2 animate-in slide-in-from-top-2 duration-200">
                    {currentScenario?.clues.map((clue, idx) => (
                      <p key={idx} className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0"></span>
                        {clue}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/95 font-bold py-3 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                Next Scenario <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
