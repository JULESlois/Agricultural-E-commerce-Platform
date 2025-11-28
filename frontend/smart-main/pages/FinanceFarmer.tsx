import React, { useState } from 'react';
import { Card, Button, Badge, SectionTitle } from '../components/Common';
import { Landmark, FileText, ChevronRight, Clock, AlertTriangle, CheckCircle2, CreditCard, Calendar } from 'lucide-react';
import { MOCK_APPLICATIONS } from '../constants';

// Mock Repayment Plans
const MOCK_PLANS = [
  { period: 1, date: '2025-10-25', amount: 4235.00, status: 'PENDING' },
  { period: 2, date: '2025-11-25', amount: 4235.00, status: 'PENDING' },
  { period: 3, date: '2025-12-25', amount: 4235.00, status: 'PENDING' },
];

export const FarmerFinance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'LOANS' | 'BILLS'>('LOANS');
  const [showRepayModal, setShowRepayModal] = useState(false);

  // Filter only current user loans (Mock logic)
  const myLoans = MOCK_APPLICATIONS; 

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#212121]">我的借款</h1>
          <div className="flex gap-2">
             <Button 
               variant={activeTab === 'LOANS' ? 'solid-blue' : 'ghost'} 
               onClick={() => setActiveTab('LOANS')}
               size="sm"
             >
               借款记录
             </Button>
             <Button 
               variant={activeTab === 'BILLS' ? 'solid-blue' : 'ghost'} 
               onClick={() => setActiveTab('BILLS')}
               size="sm"
             >
               还款账单
             </Button>
          </div>
       </div>

       {/* Overview Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-[#1976D2] to-[#42A5F5] text-white">
             <p className="text-blue-100 mb-1">当前待还总额 (元)</p>
             <h2 className="text-3xl font-bold">54,235.00</h2>
             <div className="mt-4 flex gap-2">
                <Button size="sm" className="bg-white text-[#1976D2] border-none hover:bg-blue-50" onClick={() => setShowRepayModal(true)}>立即还款</Button>
             </div>
          </Card>
          <Card className="p-6">
             <p className="text-gray-500 mb-1">本月应还</p>
             <h2 className="text-3xl font-bold text-[#212121]">4,235.00</h2>
             <p className="text-xs text-gray-400 mt-2">还款日: 2025-10-25</p>
          </Card>
          <Card className="p-6">
             <p className="text-gray-500 mb-1">可用额度</p>
             <h2 className="text-3xl font-bold text-[#4CAF50]">150,000.00</h2>
             <p className="text-xs text-gray-400 mt-2">总额度: 200,000.00</p>
          </Card>
       </div>

       {/* Main Content */}
       {activeTab === 'LOANS' && (
          <div className="space-y-4">
             {myLoans.map(loan => (
                <Card key={loan.id} className="p-0 border border-gray-200">
                   <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <span className="font-bold text-gray-700">{loan.productName}</span>
                         <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">{loan.bankName}</span>
                         <span className="text-gray-400 text-sm">|</span>
                         <span className="text-gray-500 text-sm">申请时间: {loan.applyDate}</span>
                      </div>
                      <Badge color={
                         loan.status === 'APPROVED' || loan.status === 'REPAYING' ? 'green' : 
                         loan.status === 'AUDITING' ? 'blue' : 'gray'
                      }>
                         {loan.status === 'AUDITING' ? '审核中' : 
                          loan.status === 'REPAYING' ? '还款中' : 
                          loan.status === 'REJECTED' ? '已拒绝' : loan.status}
                      </Badge>
                   </div>
                   <div className="p-6 flex items-center justify-between">
                      <div className="grid grid-cols-3 gap-12 flex-1">
                         <div>
                            <div className="text-xs text-gray-400 mb-1">借款金额</div>
                            <div className="font-bold text-lg">¥{loan.amount.toLocaleString()}</div>
                         </div>
                         <div>
                            <div className="text-xs text-gray-400 mb-1">期限/利率</div>
                            <div className="font-bold text-lg">{loan.period}期 / {loan.rate}%</div>
                         </div>
                         <div>
                            <div className="text-xs text-gray-400 mb-1">借款编号</div>
                            <div className="text-gray-600 font-mono">{loan.id}</div>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         <Button variant="ghost" size="sm">查看合同</Button>
                         {loan.status === 'REPAYING' && (
                            <Button variant="text" size="sm" className="text-blue-600">还款计划</Button>
                         )}
                      </div>
                   </div>
                </Card>
             ))}
          </div>
       )}

       {activeTab === 'BILLS' && (
          <Card className="p-0">
             <div className="px-6 py-4 border-b border-gray-200 font-bold">未来还款计划 (最近3期)</div>
             <div className="divide-y divide-gray-100">
                {MOCK_PLANS.map((plan, i) => (
                   <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1976D2] flex items-center justify-center font-bold">
                            {plan.period}
                         </div>
                         <div>
                            <div className="font-bold text-gray-800">¥{plan.amount.toFixed(2)}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                               <Calendar size={12} /> 应还日期: {plan.date}
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <span className="text-sm text-gray-500">本金: 4000.00 + 利息: 235.00</span>
                         <Badge color="orange">待还款</Badge>
                         <Button size="sm" variant="ghost" onClick={() => setShowRepayModal(true)}>还款</Button>
                      </div>
                   </div>
                ))}
             </div>
          </Card>
       )}

       {/* Simple Repayment Modal (FIN-04) */}
       {showRepayModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 animate-fade-in">
             <Card className="w-[400px] p-6 space-y-6">
                <div className="flex justify-between items-center">
                   <h3 className="font-bold text-lg">确认还款</h3>
                   <button onClick={() => setShowRepayModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                
                <div className="bg-gray-50 p-4 rounded text-center">
                   <p className="text-gray-500 text-sm mb-1">本期应还总额</p>
                   <p className="text-3xl font-bold text-[#1976D2]">¥4,235.00</p>
                </div>

                <div className="space-y-3">
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500">还款账号</span>
                      <span className="font-medium">农业银行 (尾号8899)</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500">还款本金</span>
                      <span>¥4,000.00</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500">还款利息</span>
                      <span>¥235.00</span>
                   </div>
                </div>

                <Button className="w-full bg-[#1976D2] hover:bg-[#1565C0]" onClick={() => {
                   alert("还款成功！");
                   setShowRepayModal(false);
                }}>
                   确认支付
                </Button>
             </Card>
          </div>
       )}
    </div>
  );
};
