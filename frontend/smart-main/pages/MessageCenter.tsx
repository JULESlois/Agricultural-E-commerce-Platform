import React, { useState } from 'react';
import { Card, Button } from '../components/Common';
import { Bell, Package, MessageSquare, Info, CheckCircle2, Trash2, Check, CreditCard } from 'lucide-react';

const TABS = [
  { id: 'all', label: '全部消息' },
  { id: 'system', label: '系统通知' },
  { id: 'order', label: '交易物流' },
  { id: 'interaction', label: '互动消息' },
];

const MOCK_MESSAGES = [
  { id: 1, type: 'order', title: '订单已发货', content: '您的订单 20250925001 内的商品“有机红富士苹果”已经发货，正在由顺丰速运配送中，单号 SF1234567890。', time: '10分钟前', read: false },
  { id: 2, type: 'system', title: '系统升级维护通知', content: '为了提供更好的服务，平台将于 2025-09-28 凌晨 02:00 - 04:00 进行系统升级维护，期间暂停交易服务，请您提前安排。', time: '2小时前', read: false },
  { id: 3, type: 'interaction', title: '新的专家回复', content: '李田（高级农艺师）回复了您的提问：“秋季果树如何施肥？”，点击查看详情。', time: '昨天 14:30', read: true },
  { id: 4, type: 'payment', title: '支付成功通知', content: '您购买的“东北五常大米 10kg”已支付成功，实付金额 ¥128.00。', time: '2天前', read: true },
  { id: 5, type: 'system', title: '注册成功', content: '恭喜您成为智农链会员！建议您尽快前往个人中心完成实名认证，解锁更多金融与采购权益。', time: '3天前', read: true },
];

export const MessageCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const getFilteredMessages = () => {
     if (activeTab === 'all') return messages;
     if (activeTab === 'order') return messages.filter(m => m.type === 'order' || m.type === 'payment');
     return messages.filter(m => m.type === activeTab);
  };

  const markAllRead = () => {
    setMessages(prev => prev.map(m => ({ ...m, read: true })));
  };

  const markAsRead = (id: number) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };
  
  const deleteMessage = (id: number) => {
     setMessages(prev => prev.filter(m => m.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <Package size={20} className="text-blue-500" />;
      case 'payment': return <CreditCard size={20} className="text-green-500" />;
      case 'interaction': return <MessageSquare size={20} className="text-orange-500" />;
      case 'system': default: return <Info size={20} className="text-gray-500" />;
    }
  };

  const filteredMessages = getFilteredMessages();

  return (
     <div className="animate-fade-in max-w-4xl mx-auto py-8 px-4 sm:px-0">
        <div className="flex justify-between items-center mb-6">
           <h1 className="text-2xl font-bold text-[#212121]">消息中心</h1>
           <Button variant="ghost" size="sm" icon={<Check size={16}/>} onClick={markAllRead}>全部已读</Button>
        </div>
        
        <div className="flex gap-2 mb-6 border-b border-gray-200 pb-1 overflow-x-auto no-scrollbar">
           {TABS.map(tab => (
              <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === tab.id ? 'text-[#4CAF50]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                 {tab.label}
                 {activeTab === tab.id && <div className="absolute bottom-[-5px] left-0 w-full h-0.5 bg-[#4CAF50]"></div>}
              </button>
           ))}
        </div>

        <div className="space-y-4">
           {filteredMessages.length === 0 ? (
               <div className="text-center py-12 text-gray-400">
                   <Bell size={48} className="mx-auto mb-4 opacity-20" />
                   <p>暂无消息</p>
               </div>
           ) : (
               filteredMessages.map(msg => (
                  <Card key={msg.id} className={`p-4 flex gap-4 items-start hover:shadow-md transition-shadow ${!msg.read ? 'bg-green-50/30' : 'bg-white'}`}>
                     <div className={`p-2 rounded-full flex-shrink-0 ${!msg.read ? 'bg-white' : 'bg-gray-100'}`}>
                        {getIcon(msg.type)}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                           <h3 className={`text-base ${!msg.read ? 'font-bold text-[#212121]' : 'text-gray-600'}`}>
                               {msg.title}
                               {!msg.read && <span className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full align-middle"></span>}
                           </h3>
                           <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{msg.time}</span>
                        </div>
                        <p className={`text-sm mb-2 ${!msg.read ? 'text-gray-800' : 'text-gray-500'}`}>{msg.content}</p>
                     </div>
                     <div className="flex flex-col gap-2">
                        {!msg.read && (
                            <button onClick={() => markAsRead(msg.id)} className="p-1.5 text-[#4CAF50] hover:bg-[#4CAF50]/10 rounded transition-colors" title="标记已读">
                                <CheckCircle2 size={18} />
                            </button>
                        )}
                        <button onClick={() => deleteMessage(msg.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="删除">
                           <Trash2 size={18} />
                        </button>
                     </div>
                  </Card>
               ))
           )}
        </div>
     </div>
  );
};
