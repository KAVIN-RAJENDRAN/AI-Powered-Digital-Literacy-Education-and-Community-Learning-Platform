import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { HelpCircle, Award, CheckCircle, AlertTriangle, ArrowRight, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Quiz({ navigate }) {
  const { token } = useAuth();
  const { language, t } = useLanguage();
  
  const [selectedModuleId, setSelectedModuleId] = useState(1);
  const [quizzes, setQuizzes] = useState([]);
  const [userAnswers, setUserAnswers] = useState({}); // quiz_id -> selected_index
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // MOCK QUIZZES FALLBACK
  const mockQuizzes = {
    1: [
      {
        id: 1001,
        question: language === 'ta' ? "அழைப்பை மேற்கொள்ள எண்ணை தட்டச்சு செய்த பிறகு எந்த பொத்தானை அழுத்த வேண்டும்?" : "Which button do you press to make a phone call after entering a number?",
        options: language === 'ta' ? ["சிவப்பு பொத்தான்", "பச்சை பொத்தான்", "கேமரா ஐகான்", "ஒலி கூட்டல் பொத்தான்"] : ["Red Button", "Green Button", "Camera Icon", "Volume Up Button"],
        correct_option_index: 1,
        explanation: language === 'ta' ? "பச்சை பொத்தான் அழைப்பை இணைக்க அல்லது புதிய அழைப்பைத் தொடங்கப் பயன்படுகிறது." : "The green dialer button is used to connect calls."
      },
      {
        id: 1002,
        question: language === 'ta' ? "வாட்ஸ்அப்பின் (WhatsApp) முதன்மை செயல்பாடு என்ன?" : "What is the primary function of WhatsApp?",
        options: language === 'ta' ? ["விளையாட்டுகள்", "கணக்கீடு", "செய்திகள் அனுப்புதல் மற்றும் வீடியோ கால்கள் செய்தல்", "வண்டி முன்பதிவு"] : ["Playing games", "Calculator", "Sending text messages and making video calls", "Bus booking"],
        correct_option_index: 2,
        explanation: language === 'ta' ? "வாட்ஸ்அப் மூலம் ஆடியோ, வீடியோ மற்றும் எழுத்துச் செய்திகளை இலவசமாக அனுப்ப முடியும்." : "WhatsApp is a messenger app supporting chat, files exchange, and calling."
      },
      {
        id: 1003,
        question: language === 'ta' ? "புகைப்படம் எடுக்க உங்கள் கேமராவில் எதைத் தட்ட வேண்டும்?" : "What do you tap in your camera app to snap a photo?",
        options: language === 'ta' ? ["சிவப்பு வீடியோ பொத்தான்", "வெள்ளை வட்டப் பொத்தான்", "பவர் பட்டன்", "திரை விளக்கு"] : ["Red video button", "White circular button", "Power button", "Screen brightness"],
        correct_option_index: 1,
        explanation: language === 'ta' ? "பெரும்பாலான போன்களில் வெள்ளை வட்ட பொத்தான் புகைப்படம் எடுக்கப் பயன்படுகிறது." : "The white circular shutter button takes images in most camera interfaces."
      }
    ],
    3: [
      {
        id: 3001,
        question: language === 'ta' ? "உங்களது ரகசிய UPI PIN-ஐ யாரிடம் பகிர்ந்து கொள்ளலாம்?" : "When should you share your secure UPI PIN with someone?",
        options: language === 'ta' ? ["வங்கி மேலாளரிடம்", "உறவினர்களிடம்", "ஒருபோதும் யாரிடமும் பகிர்ந்து கொள்ளக் கூடாது", "கேஷ்பேக் பெறும்போது"] : ["With bank managers", "With relatives", "Never, it should be kept secret", "To receive cashbacks"],
        correct_option_index: 2,
        explanation: language === 'ta' ? "UPI PIN என்பது மிகவும் ரகசியமானது. பணம் அனுப்ப மட்டுமே இது தேவை. பணம் பெற PIN தேவையில்லை. யாரிடமும் பகிரக் கூடாது." : "Your UPI PIN is strictly confidential. Banks never call to request it. Only enter PIN to send money."
      }
    ]
  };

  useEffect(() => {
    loadQuizQuestions();
  }, [selectedModuleId, language]);

  const loadQuizQuestions = async () => {
    setLoading(true);
    setSubmitted(false);
    setResults(null);
    setUserAnswers({});
    
    try {
      const response = await fetch(`/api/quizzes/${selectedModuleId}?lang=${language}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
      } else {
        throw new Error();
      }
    } catch (e) {
      setQuizzes(mockQuizzes[selectedModuleId] || [
        {
          id: selectedModuleId * 1000 + 1,
          question: language === 'ta' ? "டிஜிட்டல் சாதனங்களின் பாதுகாப்பான பயன்பாடு எது?" : "What is a secure practice when using digital devices?",
          options: language === 'ta' ? ["OTP பகிர்தல்", "வலிமையான கடவுச்சொற்களைப் பயன்படுத்துதல்", "அனைத்து இணைப்புகளையும் கிளிக் செய்தல்", "பாதுகாப்பற்ற வைஃபை பயன்படுத்துதல்"] : ["Sharing OTP", "Using strong passwords", "Clicking random link", "Using open WiFi"],
          correct_option_index: 1,
          explanation: language === 'ta' ? "வலிமையான கடவுச்சொல் உங்கள் கணக்குகளை ஊடுருவல்களிலிருந்து பாதுகாக்கும்." : "Using unique, strong passwords shields accounts from hacks."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (quizId, idx) => {
    if (submitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [quizId]: idx
    }));
  };

  const handleSubmitQuiz = async () => {
    // Verify all answered
    if (Object.keys(userAnswers).length < quizzes.length) {
      alert(language === 'ta' ? "தயவுசெய்து அனைத்து கேள்விகளுக்கும் பதிலளிக்கவும்." : "Please answer all questions before submitting.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/quizzes/${selectedModuleId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answers: userAnswers })
      });
      
      if (response.ok) {
        const data = await response.json();
        setResults(data);
        setSubmitted(true);
        if (data.passed) triggerConfetti();
      } else {
        throw new Error();
      }
    } catch (e) {
      // Local scoring fallback
      let correct = 0;
      const feedback = quizzes.map(q => {
        const isCorrect = userAnswers[q.id] === q.correct_option_index;
        if (isCorrect) correct += 1;
        return {
          quiz_id: q.id,
          question: q.question,
          correct_option_index: q.correct_option_index,
          selected_option_index: userAnswers[q.id],
          is_correct: isCorrect,
          explanation: q.explanation
        };
      });

      const score = (correct / quizzes.length) * 100;
      const passed = score >= 80;
      
      const mockResult = {
        score,
        passed,
        correct_answers: correct,
        total_questions: quizzes.length,
        feedback,
        certificate_issued: passed,
        certificate_id: passed ? `DLH-M${selectedModuleId}C9-MOCK` : null
      };

      setResults(mockResult);
      setSubmitted(true);
      
      if (passed) {
        triggerConfetti();
        // Save certificate locally
        const savedProgress = JSON.parse(localStorage.getItem('dlh_modules_progress') || '{}');
        savedProgress[selectedModuleId] = 100; // Force complete progress
        localStorage.setItem('dlh_modules_progress', JSON.stringify(savedProgress));
      }
    } finally {
      setLoading(false);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Module Quizzes
        </h1>
        <p className="text-muted-foreground mt-2 readable-text-lg">
          Select a course module, answer the questions, and secure a scoring rate of 80% to earn certificates.
        </p>
      </div>

      {/* Selector of modules */}
      {!submitted && (
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {[
            { id: 1, label: language === 'ta' ? "ஸ்மார்ட்போன் அடிப்படைகள்" : "Smartphone Basics" },
            { id: 2, label: language === 'ta' ? "இணைய அடிப்படைகள்" : "Internet Basics" },
            { id: 3, label: language === 'ta' ? "டிஜிட்டல் கட்டணங்கள்" : "Digital Payments" },
            { id: 4, label: language === 'ta' ? "அரசு சேவைகள்" : "Government Services" },
            { id: 5, label: language === 'ta' ? "சைபர் பாதுகாப்பு" : "Cyber Security" }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedModuleId(m.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedModuleId === m.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground hover:text-foreground border-border'}`}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      {loading && quizzes.length === 0 ? (
        <div className="text-center py-12 text-sm text-muted-foreground">Loading quiz questions...</div>
      ) : (
        <div className="space-y-6">
          {/* Question Cards */}
          {quizzes.map((q, idx) => (
            <div key={q.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-base mb-4 flex gap-2">
                <span className="text-primary">{idx + 1}.</span>
                {q.question}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options.map((opt, oIdx) => {
                  const isSelected = userAnswers[q.id] === oIdx;
                  
                  let optStyle = "border border-border/80 bg-muted/20 hover:bg-muted text-foreground";
                  if (isSelected) optStyle = "border-primary bg-primary/10 text-primary font-semibold";
                  
                  // Post submission visual check overrides
                  if (submitted) {
                    const isCorrectOption = oIdx === q.correct_option_index;
                    const isUserSelection = userAnswers[q.id] === oIdx;
                    
                    if (isCorrectOption) {
                      optStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-600 font-bold";
                    } else if (isUserSelection) {
                      optStyle = "border-destructive bg-destructive/10 text-destructive";
                    } else {
                      optStyle = "border-border/40 opacity-60 text-muted-foreground";
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={submitted}
                      onClick={() => handleSelectOption(q.id, oIdx)}
                      className={`text-left p-3.5 rounded-xl text-sm transition-all flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Individual Question feedback explanation */}
              {submitted && (
                <div className="mt-4 p-4 bg-muted/40 rounded-xl text-xs text-muted-foreground leading-relaxed border border-border/40">
                  <strong className="text-foreground block mb-0.5">Explanation:</strong>
                  {q.explanation}
                </div>
              )}
            </div>
          ))}

          {/* Submission and results footer card */}
          {!submitted ? (
            <button
              onClick={handleSubmitQuiz}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/95 font-bold py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              Submit Quiz <ArrowRight className="h-5 w-5" />
            </button>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-6 shadow-lg text-center space-y-4 animate-in fade-in duration-300">
              <div className="inline-flex p-3 rounded-full bg-primary/15 text-primary">
                {results?.passed ? <CheckCircle className="h-8 w-8 text-emerald-500" /> : <AlertTriangle className="h-8 w-8 text-destructive" />}
              </div>
              
              <h3 className="text-2xl font-black">
                {results?.passed ? "Passed! (வெற்றி!)" : "Failed! (மீண்டும் முயற்சி செய்க)"}
              </h3>
              
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                You scored <strong>{results?.score}%</strong> ({results?.correct_answers} out of {results?.total_questions} correct).
                {results?.passed
                  ? " Outstanding! A completion certificate has been added to your dashboard profile."
                  : " Minimum 80% score required to earn your certificate. Feel free to re-read modules and attempt again."}
              </p>

              <div className="flex gap-4">
                <button
                  onClick={loadQuizQuestions}
                  className="flex-1 bg-secondary text-secondary-foreground hover:bg-muted font-bold py-3 rounded-xl transition-all border border-border"
                >
                  {results?.passed ? "Retake Quiz" : "Try Again"}
                </button>
                
                <button
                  onClick={() => navigate(results?.passed ? '#/dashboard' : '#/courses')}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/95 font-bold py-3 rounded-xl transition-all shadow-md"
                >
                  {results?.passed ? "View Certificate" : "Review Modules"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
