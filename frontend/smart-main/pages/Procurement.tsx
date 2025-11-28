
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge, SectionTitle } from '../components/Common';
import { MOCK_PROCUREMENTS } from '../constants';
import { Search, MapPin, Calendar, Clock, DollarSign, PenTool, TrendingUp, Filter, Users, Box } from 'lucide-react';
import { MallTabs } from './Mall';

export const Procurement: React.FC = () => {
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState('全部');
  const [filterLocation, setFilterLocation] = useState('全国');

  return (
    <div className="animate-fade-in pt-[45px] bg-[#F5F5F5] min-h-screen">
       {/* Sub Navigation */}
       <MallTabs />

       <div className="max-w-[1200px] mx-auto px-4 py-6 space-y-6">
          
          {/* [MATCH-01] Header Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex items-center gap-4 border-r border-gray-100 pr-6 flex-1">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                   <PenTool size={24} />
                </div>
                <div>
                   <div className="text-2xl font-bold text-[#212121]">523</div>
                   <div className="text-xs text-gray-500">今日发布需求 (条)</div>
                </div>
             </div>
             <div className="flex items-center gap-4 border-r border-gray-100 pr-6 flex-1">
                <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                   <Box size={24} />
                </div>
                <div>
                   <div className="text-2xl font-bold text-[#212121]">1,200</div>
                   <div className="text-xs text-gray-500">累计成交 (吨)</div>
                </div>
             </div>
             <div className="flex items-center gap-4 flex-1">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                   <Users size={24} />
                </div>
                <div>
                   <div className="text-2xl font-bold text-[#212121]">300+</div>
                   <div className="text-xs text-gray-500">入驻采购商 (家)</div>
                </div>
             </div>
             <div className="flex gap-3">
                <Button size="md" className="bg-[#1976D2] hover:bg-[#1565C0] text-white border-none shadow-md" onClick={() => navigate('/mall/buyer/procurement/post')}>
                   发布采购
                </Button>
                <Button size="md" variant="ghost" className="text-[#1976D2] border-[#1976D2] hover:bg-blue-50">
                   我是供应商
                </Button>
             </div>
          </div>

          {/* [MATCH-01] Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
             <div className="flex items-center gap-4">
                <span className="text-gray-500 font-bold text-sm w-16">分类:</span>
                <div className="flex gap-2 flex-wrap">
                   {['全部', '水果', '蔬菜', '粮油', '畜牧', '茶叶'].map(c => (
                      <button 
                        key={c}
                        onClick={() => setFilterCategory(c)}
                        className={`px-4 py-1 rounded-full text-sm transition-colors ${filterCategory === c ? 'bg-[#1976D2] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                         {c}
                      </button>
                   ))}
                </div>
             </div>
             <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
                <span className="text-gray-500 font-bold text-sm w-16">地区:</span>
                <div className="flex gap-2 flex-wrap">
                   {['全国', '北京', '上海', '广东', '山东', '江苏', '浙江'].map(l => (
                      <button 
                        key={l}
                        onClick={() => setFilterLocation(l)}
                        className={`px-4 py-1 rounded-full text-sm transition-colors ${filterLocation === l ? 'bg-[#1976D2] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                         {l}
                      </button>
                   ))}
                </div>
             </div>
             <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
                <span className="text-gray-500 font-bold text-sm w-16">状态:</span>
                <div className="flex gap-4 text-sm">
                   <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded text-[#1976D2] focus:ring-[#1976D2]" defaultChecked /> 
                      <span className="text-gray-700">正在采购</span>
                   </label>
                   <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded text-[#1976D2] focus:ring-[#1976D2]" /> 
                      <span className="text-gray-700">急需货源</span>
                   </label>
                </div>
                <div className="ml-auto flex items-center gap-2">
                   <div className="relative">
                      <input type="text" placeholder="搜索采购需求..." className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-[#1976D2] w-64" />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                   </div>
                   <Button size="sm" className="bg-[#1976D2] hover:bg-[#1565C0] text-white rounded-full px-6">
                      确认搜索
                   </Button>
                </div>
             </div>
          </div>

          {/* [MATCH-01] Demand List */}
          <div className="space-y-4">
             {MOCK_PROCUREMENTS.map(item => (
                <Card key={item.id} variant="interactive" className="p-0 flex flex-col md:flex-row overflow-hidden group border border-transparent hover:border-[#1976D2]">
                   {/* Left: Icon & Category */}
                   <div className="w-full md:w-32 bg-blue-50 flex flex-col items-center justify-center p-6 text-[#1976D2]">
                      <div className="text-4xl mb-2">
                         {item.category === '水果' ? '🍎' : item.category === '蔬菜' ? '🥦' : item.category === '粮油' ? '🌾' : '📦'}
                      </div>
                      <span className="font-bold text-sm">{item.category}</span>
                   </div>

                   {/* Middle: Info */}
                   <div className="flex-1 p-6 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-2">
                         {item.urgent && <Badge color="red">急购</Badge>}
                         <h3 className="text-xl font-bold text-[#212121] group-hover:text-[#1976D2] transition-colors">{item.title}</h3>
                         <span className="text-gray-400 text-sm">#{item.id}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-2 gap-x-8 text-sm text-gray-600 mb-4">
                         <div className="flex items-center gap-2">
                            <span className="text-gray-400">采购量:</span> 
                            <span className="font-bold text-[#212121]">{item.quantity}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="text-gray-400">规格:</span> 
                            <span>{item.specs || '标准通货'}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="text-gray-400">收货地:</span> 
                            <span className="flex items-center gap-1"><MapPin size={14}/> {item.location}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="text-gray-400">期望产地:</span> 
                            <span>{item.origin || '不限'}</span>
                         </div>
                      </div>

                      <div className="flex gap-2">
                         {item.tags?.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">{tag}</span>
                         ))}
                      </div>
                   </div>

                   {/* Right: Price & Action */}
                   <div className="w-full md:w-64 border-l border-gray-100 p-6 flex flex-col justify-between bg-gray-50/30">
                      <div>
                         <div className="text-xs text-gray-400 mb-1">期望价格</div>
                         <div className="text-2xl font-bold text-[#FF9800]">{item.budget}</div>
                      </div>
                      
                      <div className="mt-4">
                         <div className="flex items-center gap-1 text-xs text-red-500 mb-2">
                            <Clock size={12} />
                            <span>截止: {item.deadline}</span>
                         </div>
                         <Button className="w-full bg-[#4CAF50] hover:bg-[#43A047] text-white border-none shadow-sm">
                            我要供货
                         </Button>
                      </div>
                   </div>
                </Card>
             ))}
          </div>
       </div>
    </div>
  );
};
