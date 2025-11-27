import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X, Send, Minimize2, Headset } from 'lucide-react';
import { Button } from './Common';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const ChatWidget: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '您好！我是智农链智能助手。请问有什么可以帮您？',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
      // Optional: highlight or shake animation could be added here
    };
    window.addEventListener('open-chat', handleOpenChat);
    return () => window.removeEventListener('open-chat', handleOpenChat);
  }, []);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      let botText = '收到您的消息，人工客服正在接入中...';
      const q = newUserMsg.text.toLowerCase();
      
      if (q.includes('发货') || q.includes('物流')) {
        botText = '一般订单在48小时内发货。您可以进入“我的订单”点击具体订单查看实时物流详情。';
      } else if (q.includes('退款') || q.includes('售后') || q.includes('赔')) {
        botText = '我们承诺“坏果包赔”。您可以在订单详情页点击“申请售后”上传照片进行理赔，或直接联系商家。';
      } else if (q.includes('贷款') || q.includes('钱') || q.includes('额度')) {
        botText = '申请助农贷款请前往“助农金融”页面，基于您的经营数据，最快3分钟出额度。';
      } else if (q.includes('你好') || q.includes('在吗')) {
        botText = '您好！很高兴为您服务。请问您是想咨询 购物、贷款 还是 技术问题？';
      } else if (q.includes('专家') || q.includes('技术')) {
        botText = '您可以在“专家智库”板块查找相关领域的专家进行一对一在线咨询。';
      }

      const newBotMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newBotMsg]);
    }, 1000);
  };

  // Determine visibility based on route
  const isVisible = 
    location.pathname === '/help' || 
    location.pathname.startsWith('/mall/item/') || 
    location.pathname.startsWith('/mall/shop/') ||
    location.pathname.startsWith('/mall/buyer/order/');

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-[80px] md:bottom-6 right-6 z-[100] flex flex-col items-end print:hidden">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[320px] sm:w-[360px] h-[480px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-slide-up origin-bottom-right">
          {/* Header */}
          <div className="bg-[#4CAF50] p-4 flex justify-between items-center text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
                <Headset size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base">智农客服</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse shadow-[0_0_4px_rgba(134,239,172,0.8)]"></span>
                  <span className="text-xs opacity-90 font-medium">在线为您服务</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"
              aria-label="Minimize chat"
            >
              <Minimize2 size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#F5F7F9] space-y-4 scroll-smooth">
            <div className="text-center text-xs text-gray-400 my-2">
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-[#4CAF50] text-white rounded-tr-sm' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="请输入您的问题..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] transition-all"
            />
            <Button 
              type="submit" 
              size="sm" 
              variant="solid-green" 
              className="w-10 h-10 rounded-full p-0 flex items-center justify-center flex-shrink-0 shadow-sm"
              disabled={!inputValue.trim()}
            >
               <Send size={18} className="ml-0.5" />
            </Button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-[0_4px_12px_rgba(76,175,80,0.4)] flex items-center justify-center text-white transition-all duration-300 transform hover:scale-105 active:scale-95 ${isOpen ? 'bg-gray-500 rotate-90' : 'bg-[#4CAF50] hover:bg-[#43A047]'}`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};