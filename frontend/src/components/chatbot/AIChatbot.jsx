import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { MessageSquare, X, Send, Bot, User, Sparkles, HelpCircle } from 'lucide-react';

export default function AIChatbot() {
  const { token, user } = useAuth();
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: language === 'ta' 
        ? "வணக்கம்! நான் உங்கள் டிஜிட்டல் உதவி AI. ஸ்மார்ட்போன், இணையம் மற்றும் இணைய பாதுகாப்பு பற்றி நீங்கள் என்னிடம் கேட்கலாம்."
        : "Hello! I am your Digital Assistant AI. Ask me anything about smartphones, internet browsing, safe payments, or government services!"
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Suggestions list to support easy tapping for senior citizens
  const suggestions = language === 'ta' ? [
    "வாட்ஸ்அப் எவ்வாறு பயன்படுத்துவது?",
    "UPI பின் (PIN) பாதுகாப்பானதா?",
    "டிஜிலாக்கர் என்றால் என்ன?",
    "புதிய மொபைல் எண்ணை சேமிப்பது எப்படி?"
  ] : [
    "How to use WhatsApp?",
    "Is UPI PIN safe?",
    "What is DigiLocker?",
    "How to save a contact?"
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputMsg;
    if (!text.trim()) return;

    if (!textToSend) setInputMsg('');
    
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: text, lang: language })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
      } else {
        throw new Error("Chatbot API returned error status");
      }
    } catch (e) {
      console.warn("Using local chatbot simulation fallback:", e);
      
      // Standalone simulation rules matching keywords (English and Tamil)
      setTimeout(() => {
        let reply = "";
        const lowerText = text.toLowerCase();
        
        if (language === 'ta') {
          if (lowerText.includes("வாட்ஸ்அப்") || lowerText.includes("whatsapp") || lowerText.includes("செய்தி")) {
            reply = "வாட்ஸ்அப் எவ்வாறு பயன்படுத்துவது:\n1. திரையில் இருந்து WhatsApp-ஐத் திறக்கவும்.\n2. கீழே உள்ள 'Chat' ஐகானைத் தட்டி தொடர்பைத் தேர்ந்தெடுக்கவும்.\n3. மெசேஜ் பாக்ஸில் தட்டச்சு செய்து பச்சை அம்புக்குறியை அழுத்தவும்.";
          } else if (lowerText.includes("upi") || lowerText.includes("யுபிஐ") || lowerText.includes("பணம்") || lowerText.includes("கார்டு")) {
            reply = "UPI என்பது மொபைல் மூலமாக வங்கிக் கணக்கிலிருந்து பணப் பரிமாற்றம் செய்ய உதவுகிறது. பணம் அனுப்பும்போது மட்டுமே UPI PIN உள்ளிட வேண்டும். பணம் பெற PIN தேவையில்லை. PIN-ஐ யாரிடமும் பகிரக் கூடாது.";
          } else if (lowerText.includes("டிஜிலாக்கர்") || lowerText.includes("ஆதார்") || lowerText.includes("digilocker")) {
            reply = "டிஜிலாக்கர் என்பது அசல் ஆவணங்களை டிஜிட்டல் முறையில் பதிவிறக்கம் செய்து வைக்க உதவும் அரசு செயலியாகும். இதைப் பயன்படுத்த ஆதார் எண் மற்றும் OTP தேவை.";
          } else if (lowerText.includes("சேமி") || lowerText.includes("தொடர்பு") || lowerText.includes("காண்டாக்ட்")) {
            reply = "புதிய மொபைல் எண் சேமிக்க:\n1. போன் செயலியில் '+' குறியீட்டைத் தட்டவும்.\n2. பெயர் மற்றும் மொபைல் எண்ணை உள்ளிடவும்.\n3. 'Save' என்பதைத் அழுத்தவும்.";
          } else {
            reply = "மன்னிக்கவும், தாங்கள் கேட்ட விவரம் எனக்குப் புரியவில்லை. வாட்ஸ்அப், கூகுள் தேடல், UPI அல்லது சைபர் பாதுகாப்பு குறித்து கேட்கலாம்.";
          }
        } else {
          if (lowerText.includes("whatsapp") || lowerText.includes("message") || lowerText.includes("chat")) {
            reply = "How to use WhatsApp:\n1. Open WhatsApp on your mobile.\n2. Tap the Chat bubble icon.\n3. Select a contact and type your message.\n4. Tap the green Send arrow. You can also make voice/video calls from the icons at the top.";
          } else if (lowerText.includes("upi") || lowerText.includes("pay") || lowerText.includes("money") || lowerText.includes("pin")) {
            reply = "UPI allows direct bank-to-bank transfers. Remember:\n1. Enter UPI PIN *only* when sending money.\n2. Never enter your PIN to receive money.\n3. Never share your 4 or 6 digit PIN with anyone.";
          } else if (lowerText.includes("digilocker") || lowerText.includes("aadhaar") || lowerText.includes("pan")) {
            reply = "DigiLocker is a secure document wallet by Govt of India. Verify using Aadhaar OTP to pull your digital driving license, marksheet, or PAN card. It is legally valid everywhere.";
          } else if (lowerText.includes("save") || lowerText.includes("contact") || lowerText.includes("phone")) {
            reply = "To save a contact:\n1. Open your Contacts app and tap the '+' button.\n2. Enter the contact's name and mobile phone number.\n3. Tap 'Save' at the top. You can now call or message them.";
          } else {
            reply = "I'm sorry, I didn't quite catch that. You can ask me questions about WhatsApp, Google search, secure payments, or government certificate applications!";
          }
        }
        
        setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      }, 700);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/95 p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 animate-pulse-slow border-2 border-primary-foreground/20"
          title="Open AI Digital Helper"
          aria-label="Open AI chatbot"
        >
          <Bot className="h-7 w-7" />
          <span className="absolute -top-1 -right-1 bg-emerald-500 w-3 h-3 rounded-full border-2 border-background"></span>
        </button>
      )}

      {/* Chat Drawers */}
      {isOpen && (
        <div className="bg-card w-80 sm:w-96 h-[500px] rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-violet-600 p-4 text-primary-foreground flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-300 animate-spin-slow" />
              <div>
                <h3 className="font-bold text-sm tracking-wide">{t('navChatbot')}</h3>
                <span className="text-[10px] text-primary-foreground/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping"></span>
                  Online (EN / தமிழ்)
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground/80 hover:text-primary-foreground p-1 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close Chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Panel */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-muted/20">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`p-1.5 rounded-full h-8 w-8 flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground border border-border'}`}>
                    {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none shadow-sm' : 'bg-card text-foreground rounded-tl-none border border-border/80 shadow-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-2 items-center text-xs text-muted-foreground bg-card border border-border/60 px-3 py-1.5 rounded-full">
                  <Bot className="h-4 w-4 animate-bounce" />
                  {t('loading')}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions area */}
          <div className="px-4 py-2 border-t border-border bg-muted/10">
            <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1 mb-1">
              <HelpCircle className="h-3 w-3" /> Quick Questions / விரைவான கேள்வி:
            </p>
            <div className="flex flex-wrap gap-1">
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sug)}
                  className="text-[11px] bg-card border border-border hover:border-primary hover:text-primary px-2 py-1 rounded-full transition-all text-left truncate max-w-full"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Input Panel */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-border flex gap-2 items-center bg-card"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder={language === 'ta' ? "இங்கு தட்டச்சு செய்யவும்..." : "Ask a digital skill question..."}
              className="flex-grow bg-muted/50 border border-border/80 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/95 p-2 rounded-xl transition-colors flex items-center justify-center shrink-0"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
