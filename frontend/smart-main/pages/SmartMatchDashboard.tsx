
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Badge, SectionTitle } from '../components/Common';
import { MOCK_PROCUREMENTS, MOCK_PRODUCTS } from '../constants';
import { Zap, CheckCircle2, AlertTriangle, ArrowRight, MessageCircle, MapPin, X } from 'lucide-react';

// Shared component for the Circular Progress Bar
const MatchScoreCircle: React.FC<{ score: number }> = ({ score }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? '#4CAF50' : score >= 75 ? '#1976D2' : '#FF9800';

  return (
    <div className="relative flex items-center justify-center w-20 h-20">
      <svg className="transform -rotate-90 w-full h-full">
        <circle cx="40" cy="40" r={radius} stroke="#E0E0E0" strokeWidth="6" fill="transparent" />
        <circle 
          cx="40" cy="40" r={radius} stroke={color} strokeWidth="6" fill="transparent" 
          strokeDasharray={circumference} 
          strokeDashoffset={strokeDashoffset} 
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
         <span className="text-lg font-bold" style={{ color }}>{score}%</span>
         <span className="text-[10px] text-gray-400">匹配度</span>
      </div>
    </div>
  );
};

export const SmartMatchDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Determine Role based on URL
  const isFarmer = location.pathname.includes('/seller');
  const [activeTab, setActiveTab] = useState('recommended');
  
  // Modal State
  const [quoteModal, setQuoteModal] = useState<{ open: boolean; demandId: string | null }>({ open: false, demandId: null });

  // Filter data based on mock logic (In real app, this comes from backend algo)
  const matches = isFarmer 
    ? MOCK_PROCUREMENTS // Farmer sees Procurement Demands
    : MOCK_PRODUCTS.map(p => ({ ...p, matchScore: Math.floor(Math.random() * 20) + 80 })); // Buyer sees Products

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
       <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#212121] flex items-center gap-2">
             <Zap className={isFarmer ? "text-orange-500" : "text-blue-500"} fill="currentColor" />
             {isFarmer ? '商机智能匹配' : '货源智能推荐'}
          </h1>
          <div className="text-sm text-gray-500">
             根据您的{isFarmer ? '货源库存' : '采购需求'}自动推荐
          </div>
       </div>

       {/* Tabs */}
       <div className="flex border-b border-gray-200">
          <button
             onClick={() => setActiveTab('recommended')}
             className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'recommended' ? 'border-[#4CAF50] text-[#4CAF50]' : 'border-transparent text-gray-500'}`}
          >
             {isFarmer ? '推荐商机' : '推荐货源'}
          </button>
          <button
             onClick={() => setActiveTab('history')}
             className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'history' ? 'border-[#4CAF50] text-[#4CAF50]' : 'border-transparent text-gray-500'}`}
          >
             {isFarmer ? '已报价' : '已询价'}
          </button>
       </div>

       {/* List */}
       <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {matches.map((item: any) => (
             <Card key={item.id} className="p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow border border-gray-100">
                {/* Match Score */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center border-r border-gray-100 pr-6">
                   <MatchScoreCircle score={item.matchScore || 85} />
                </div>

                {/* Info */}
                <div className="flex-1">
                   <div className="flex justify-between items-start mb-2">
                      <div>
                         <h3 className="text-lg font-bold text-[#212121] hover:text-[#4CAF50] cursor-pointer mb-1">
                            {item.title}
                         </h3>
                         <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><MapPin size={14}/> {item.location || item.origin}</span>
                            <span>{isFarmer ? `需求: ${item.quantity}` : `库存: ${item.stock}`}</span>
                            <span className="text-[#FF9800] font-bold">{isFarmer ? item.budget : `¥${item.price}`}</span>
                         </div>
                      </div>
                      <div className="text-right">
                         <Badge color={item.matchScore > 90 ? 'green' : 'blue'}>
                            {item.matchScore > 90 ? '极度匹配' : '高度匹配'}
                         </Badge>
                      </div>
                   </div>

                   {/* Match Details */}
                   <div className="bg-gray-50 rounded-lg p-3 flex gap-4 text-xs mt-3">
                      <div className="flex items-center gap-1 text-green-600">
                         <CheckCircle2 size={12} /> 品类一致
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                         <CheckCircle2 size={12} /> {isFarmer ? '产地符合' : '规格达标'}
                      </div>
                      {item.matchScore < 90 && (
                         <div className="flex items-center gap-1 text-orange-500">
                            <AlertTriangle size={12} /> {isFarmer ? '价格略高' : '距离较远'}
                         </div>
                      )}
                   </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col justify-center gap-2 min-w-[120px]">
                   {isFarmer ? (
                      <Button variant="solid-green" onClick={() => setQuoteModal({ open: true, demandId: item.id })}>
                         立即报价
                      </Button>
                   ) : (
                      <Button variant="solid-blue" onClick={() => navigate(`/mall/item/${item.id}`)}>
                         查看详情
                      </Button>
                   )}
                   <Button variant="ghost" icon={<MessageCircle size={16}/>}>
                      联系对方
                   </Button>
                </div>
             </Card>
          ))}
       </div>

       {/* [MATCH-05] Quote Modal (Farmer Only) */}
       {quoteModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
             <Card className="w-[500px] p-6 space-y-6 relative">
                <button 
                   onClick={() => setQuoteModal({ open: false, demandId: null })}
                   className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                   <X size={20} />
                </button>
                
                <SectionTitle title="发起报价" />
                
                <div className="bg-blue-50 p-3 rounded text-sm text-blue-700">
                   您正在对需求 <span className="font-bold">#{quoteModal.demandId}</span> 进行报价。
                </div>

                <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">供应单价 (元)</label>
                         <input type="number" className="w-full p-2 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none" placeholder="0.00" />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">可供数量</label>
                         <input type="number" className="w-full p-2 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none" placeholder="吨" />
                      </div>
                   </div>
                   
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">货源选择</label>
                      <select className="w-full p-2 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none">
                         <option>选择我的库存货源...</option>
                         <option>有机红富士苹果 (库存 1200箱)</option>
                         <option>普通苹果 (库存 5000斤)</option>
                      </select>
                   </div>

                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">留言备注</label>
                      <textarea className="w-full p-2 border border-gray-300 rounded focus:border-[#4CAF50] focus:outline-none h-20" placeholder="描述货源优势，如：自家果园，现摘现发..." />
                   </div>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                   <Button variant="ghost" onClick={() => setQuoteModal({ open: false, demandId: null })}>取消</Button>
                   <Button variant="solid-green" onClick={() => { alert('报价已发送'); setQuoteModal({ open: false, demandId: null }); }}>确认发送</Button>
                </div>
             </Card>
          </div>
       )}
    </div>
  );
};
