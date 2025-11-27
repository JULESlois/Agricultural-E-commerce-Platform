import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/Common';
import { CreditCard, Plus, Trash2, Ticket, Calendar, DollarSign } from 'lucide-react';
import { MOCK_COUPONS } from '../constants';

export const PaymentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cards' | 'coupons'>('cards');
  const [cards, setCards] = useState([
    { id: 1, bank: '中国农业银行', type: '储蓄卡', number: '**** **** **** 8899', color: 'from-[#009174] to-[#006F59]' },
    { id: 2, bank: '中国建设银行', type: '信用卡', number: '**** **** **** 1234', color: 'from-[#003B8F] to-[#002661]' },
  ]);

  const handleDeleteCard = (id: number) => {
    if(confirm('确定要解绑这张银行卡吗？')) {
        setCards(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[#212121]">支付管理</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'cards' ? 'text-[#4CAF50]' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('cards')}
        >
          我的银行卡
          {activeTab === 'cards' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#4CAF50]"></div>}
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'coupons' ? 'text-[#4CAF50]' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('coupons')}
        >
          我的优惠券
          {activeTab === 'coupons' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#4CAF50]"></div>}
        </button>
      </div>

      {activeTab === 'cards' ? (
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map(card => (
                 <div key={card.id} className={`relative rounded-xl p-6 text-white shadow-lg bg-gradient-to-br ${card.color} overflow-hidden group`}>
                    <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleDeleteCard(card.id)} className="p-2 bg-white/20 rounded-full hover:bg-white/30 text-white"><Trash2 size={16}/></button>
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <CreditCard size={20} />
                       </div>
                       <div>
                          <div className="font-bold">{card.bank}</div>
                          <div className="text-xs opacity-80">{card.type}</div>
                       </div>
                    </div>
                    <div className="text-xl font-mono tracking-widest mb-2">
                       {card.number}
                    </div>
                    <div className="flex justify-between items-center text-xs opacity-60">
                        <span>持卡人: 张*</span>
                        <span>快捷支付: 已开通</span>
                    </div>
                    {/* Decor */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                 </div>
              ))}
              
              {/* Add Card Button */}
              <div className="rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 text-gray-400 cursor-pointer hover:border-[#4CAF50] hover:text-[#4CAF50] hover:bg-green-50 transition-all min-h-[180px]">
                 <Plus size={32} className="mb-2" />
                 <span className="font-medium">添加银行卡</span>
              </div>
           </div>
           
           <Card className="p-6">
              <h3 className="font-bold mb-4 text-gray-800">支付设置</h3>
              <div className="space-y-4 text-sm">
                 <div className="flex justify-between items-center">
                    <div>
                       <div className="font-medium text-gray-700">小额免密支付</div>
                       <div className="text-gray-500 text-xs">单笔订单小于 50 元无需输入密码</div>
                    </div>
                    <div className="relative inline-block w-10 h-6 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer left-1 top-1" defaultChecked/>
                        <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-[#4CAF50] cursor-pointer"></label>
                    </div>
                 </div>
                 <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                    <div>
                       <div className="font-medium text-gray-700">支付密码</div>
                       <div className="text-gray-500 text-xs">保障资金安全，建议定期修改</div>
                    </div>
                    <Button variant="ghost" size="sm">修改密码</Button>
                 </div>
              </div>
           </Card>
        </div>
      ) : (
        <div className="space-y-4">
           {/* Coupon List */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_COUPONS.map(coupon => (
                 <div key={coupon.id} className="relative flex bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    {/* Left Part */}
                    <div className={`w-32 flex flex-col items-center justify-center p-4 text-white ${coupon.status === 'AVAILABLE' || coupon.status === 'CLAIMED' ? 'bg-gradient-to-br from-[#FF9800] to-orange-600' : 'bg-gray-400'}`}>
                       <span className="text-xs opacity-80">¥</span>
                       <span className="text-3xl font-bold">{coupon.amount}</span>
                       <span className="text-xs opacity-80 mt-1">满{coupon.minSpend}可用</span>
                    </div>
                    {/* Right Part */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <Badge color={coupon.type === 'PLATFORM' ? 'red' : 'blue'}>{coupon.type === 'PLATFORM' ? '平台券' : '店铺券'}</Badge>
                             <span className="font-bold text-gray-700 text-sm">{coupon.title}</span>
                          </div>
                          <div className="text-xs text-gray-500">{coupon.expiryDate} 前有效</div>
                       </div>
                       <div className="flex justify-between items-center mt-3 pt-3 border-t border-dashed border-gray-100">
                          <span className="text-xs text-gray-400">仅限特定商品使用</span>
                          <Button 
                             size="sm" 
                             variant={coupon.status === 'AVAILABLE' || coupon.status === 'CLAIMED' ? 'solid-green' : 'text'} 
                             className="h-7 px-3 text-xs"
                             disabled={coupon.status !== 'AVAILABLE' && coupon.status !== 'CLAIMED'}
                          >
                             去使用
                          </Button>
                       </div>
                    </div>
                    {/* Holes */}
                    <div className="absolute -top-2 left-[122px] w-4 h-4 bg-[#FAFAFA] rounded-full border border-gray-200 z-10"></div>
                    <div className="absolute -bottom-2 left-[122px] w-4 h-4 bg-[#FAFAFA] rounded-full border border-gray-200 z-10"></div>
                 </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};