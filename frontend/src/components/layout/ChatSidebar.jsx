import { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Sparkles, Loader2 } from 'lucide-react';

const ChatSidebar = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: "Hello! I'm your mOOMOO AI Advisor. How can I help you manage your herd today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), type: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Mock AI Response - In a real app, this would call your backend LLM endpoint
    setTimeout(() => {
      let botResponse = "I'm analyzing your farm data... ";
      
      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('milk')) {
        botResponse += "Daily milk production is up by 5% today. Bessie (#COW-001) is your top producer.";
      } else if (lowerInput.includes('sick') || lowerInput.includes('health')) {
        botResponse += "I've detected 2 cows with slightly elevated temperatures in Barn B. I recommend a physical checkup.";
      } else if (lowerInput.includes('profit') || lowerInput.includes('money')) {
        botResponse += "Your net profit for this month is projected to be Rs. 450,000. Reducing feed waste could save you an extra 3%.";
      } else {
        botResponse += "All systems are stable. Your herd's health score is 98%. Is there anything specific you'd like to know?";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="chat-sidebar card glass-card">
      <div className="chat-header">
        <div className="bot-title">
          <div className="bot-icon">
            <Sparkles size={16} />
          </div>
          <div>
            <h3>AI Herd Advisor</h3>
            <span className="online-status">Online • Ready to assist</span>
          </div>
        </div>
        <button onClick={onClose} className="close-btn">
          <X size={20} />
        </button>
      </div>

      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message-wrapper ${msg.type}`}>
            <div className="avatar">
              {msg.type === 'bot' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className="message-bubble">
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message-wrapper bot">
            <div className="avatar"><Bot size={16} /></div>
            <div className="message-bubble typing">
              <Loader2 size={16} className="animate-spin" />
              <span>Analyzing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="chat-input-area">
        <input 
          type="text" 
          placeholder="Ask anything about your farm..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="send-btn" disabled={!input.trim() || isTyping}>
          <Send size={18} />
        </button>
      </form>

      <style jsx>{`
        .chat-sidebar {
          position: fixed;
          top: 80px;
          right: 20px;
          bottom: 20px;
          width: 380px;
          display: flex;
          flex-direction: column;
          z-index: 1000;
          padding: 0;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid var(--border);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .chat-header {
          padding: 1.25rem;
          background: var(--secondary);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .bot-title { display: flex; align-items: center; gap: 0.75rem; }
        .bot-icon {
          width: 32px;
          height: 32px;
          background: var(--primary);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bot-title h3 { font-size: 1rem; font-weight: 700; margin: 0; }
        .online-status { font-size: 0.7rem; opacity: 0.8; display: flex; align-items: center; gap: 4px; }
        .online-status::before { content: ''; width: 6px; height: 6px; background: #10b981; border-radius: 50%; display: inline-block; }
        
        .close-btn { background: none; border: none; color: white; opacity: 0.6; cursor: pointer; }
        .close-btn:hover { opacity: 1; }

        .chat-messages {
          flex: 1;
          padding: 1.25rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          background: #f8fafc;
        }

        .message-wrapper { display: flex; gap: 0.75rem; max-width: 85%; }
        .message-wrapper.user { align-self: flex-end; flex-direction: row-reverse; }
        
        .avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .bot .avatar { background: var(--primary); color: white; }
        .user .avatar { background: #e2e8f0; color: var(--text); }

        .message-bubble {
          padding: 0.75rem 1rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          line-height: 1.5;
        }
        .bot .message-bubble { background: white; color: var(--text); border-bottom-left-radius: 0; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .user .message-bubble { background: var(--primary); color: white; border-bottom-right-radius: 0; }
        
        .typing { display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); }

        .chat-input-area {
          padding: 1.25rem;
          background: white;
          border-top: 1px solid var(--border);
          display: flex;
          gap: 0.75rem;
        }
        .chat-input-area input {
          flex: 1;
          padding: 0.625rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid var(--border);
          font-size: 0.875rem;
          outline: none;
        }
        .chat-input-area input:focus { border-color: var(--primary); }
        .send-btn {
          width: 40px;
          height: 40px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.1s;
        }
        .send-btn:hover { background: var(--primary-dark); }
        .send-btn:active { transform: scale(0.95); }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default ChatSidebar;
