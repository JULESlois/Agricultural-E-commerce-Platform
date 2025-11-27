import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, SectionTitle, Badge } from '../components/Common';
import { MOCK_LOANS, COLORS } from '../constants';
import { CheckCircle2, ChevronRight, Landmark, PieChart, Shield, CreditCard, FileText, PenTool, AlertCircle, ArrowLeft } from 'lucide-react';

export const FinanceHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in space-y-12">
      {/* Finance Hero */}
      <div className="bg-gradient-to-r from-[#1976D2] to-[#64B5F6] rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-lg">
        <div className="max-w-xl space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">普惠金融，助力农业发展</h1>
          <p className="text-blue-100 text-lg">
            基于农业大数据信用评估，为您提供低利率、放款快的纯信用贷款。
          </p>
          <div className="pt-4 flex gap-4">
            <Button className="bg-white text-[#1976D2] hover:bg-blue-50 border-none" onClick={() => navigate('/finance/apply/1')}>
              立即评估额度
            </Button>
            <Button variant="ghost" className="text-white border-white hover:bg-white/10">
              了解更多
            </Button>
          </div>
        </div>
        <div className="hidden md:block">
           <PieChart size={180} className="opacity-80" />
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="flex gap-4 items-start">
            <div className="p-3 bg-blue-50 rounded-lg text-[#1976D2]">
              <Landmark size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">正规银行放款</h3>
              <p className="text-sm text-gray-500">合作多家国有银行及农信社，资金来源安全可靠。</p>
            </div>
         </div>
         <div className="flex gap-4 items-start">
            <div className="p-3 bg-green-50 rounded-lg text-[#4CAF50]">
              <PieChart size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">大数据风控</h3>
              <p className="text-sm text-gray-500">基于过往交易与种植数据，无需繁琐抵押物。</p>
            </div>
         </div>
         <div className="flex gap-4 items-start">
            <div className="p-3 bg-orange-50 rounded-lg text-[#FF9800]">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">极速审批</h3>
              <p className="text-sm text-gray-500">全流程线上申请，最快3分钟出额度。</p>
            </div>
         </div>
      </div>

      {/* Loan Products List */}
      <section>
        <SectionTitle title="热门贷款产品" subtitle="根据您的经营需求，选择合适的资金方案" />
        <div className="space-y-4">
          {MOCK_LOANS.map((loan, idx) => (
            <Card key={loan.id} variant="interactive" className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100 hover:border-[#1976D2] group">
              <div className="flex-1">
                 <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-[#212121] group-hover:text-[#1976D2] transition-colors">{loan.name}</h3>
                    <Badge color="blue">{loan.bank}</Badge>
                 </div>
                 <div className="flex gap-2">
                   {loan.tags.map(tag => <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{tag}</span>)}
                 </div>
              </div>
              
              <div className="flex gap-8 md:gap-12 text-center">
                 <div>
                   <div className="text-2xl font-bold text-[#FF9800]">{loan.rate}</div>
                   <div className="text-xs text-gray-400">年化利率起</div>
                 </div>
                 <div>
                   <div className="text-2xl font-bold text-[#212121]">{loan.limit}</div>
                   <div className="text-xs text-gray-400">最高额度</div>
                 </div>
              </div>

              <div>
                 <Button variant="solid-blue" size="lg" className="w-full md:w-auto" onClick={() => navigate(`/finance/apply/${idx+1}`)}>立即申请</Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- Application Wizard (Full Flow) ---

export const LoanApplyWizard: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock Form Data
  const [formData, setFormData] = useState({
    amount: '',
    period: '12',
    bankCard: '',
    agreed: false
  });

  const steps = [
    { id: 1, title: '申请信息' },
    { id: 2, title: '账户绑定' }, // FIN-09
    { id: 3, title: '合同签署' }, // FIN-07
    { id: 4, title: '提交审核' },
  ];

  const handleNext = () => {
    if (step === 3 && !formData.agreed) {
      alert("请阅读并同意签署电子合同");
      return;
    }
    if (step === 3) {
      setIsSubmitting(true);
      setTimeout(() => {
         setIsSubmitting(false);
         setStep(4);
      }, 2000);
    } else {
      setStep(s => s + 1);
    }
  };

  if (step === 4) {
    return (
       <div className="max-w-2xl mx-auto py-12 animate-fade-in text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-[#4CAF50] mx-auto mb-6">
             <CheckCircle2 size={48} />
          </div>
          <h2 className="text-2xl font-bold text-[#212121] mb-2">申请提交成功</h2>
          <p className="text-gray-500 mb-8">
             您的贷款申请已提交至银行系统，预计将在 1-3 个工作日内完成审批。
             <br />审批结果将通过短信通知，您也可以在“我的借款”中查看进度。
          </p>
          <div className="flex justify-center gap-4">
             <Button variant="ghost" onClick={() => navigate('/finance')}>返回首页</Button>
             <Button variant="solid-blue" onClick={() => navigate('/finance/farmer')}>查看我的借款</Button>
          </div>
       </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in py-6">
       <div className="mb-6">
         <Button variant="text" size="sm" onClick={() => navigate('/finance')}>
            <ArrowLeft size={16} className="mr-1"/> 退出申请
         </Button>
       </div>

       {/* Progress Bar */}
       <div className="mb-8">
         <div className="flex justify-between items-center relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
            {steps.map((s) => (
              <div key={s.id} className={`flex flex-col items-center bg-white px-2 ${step >= s.id ? 'text-[#1976D2]' : 'text-gray-400'}`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-colors ${
                   step >= s.id ? 'bg-[#1976D2] text-white' : 'bg-gray-200'
                 }`}>
                   {step > s.id ? <CheckCircle2 size={16} /> : s.id}
                 </div>
                 <span className="text-xs font-medium">{s.title}</span>
              </div>
            ))}
         </div>
       </div>

       <Card className="p-8 min-h-[400px] flex flex-col relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
             <Landmark size={200} />
          </div>

          <div className="flex-grow relative z-10">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
               {step === 1 && <FileText size={24} className="text-[#1976D2]" />}
               {step === 2 && <CreditCard size={24} className="text-[#1976D2]" />}
               {step === 3 && <PenTool size={24} className="text-[#1976D2]" />}
               {steps[step-1].title}
            </h2>
            
            {/* Step 1: Info */}
            {step === 1 && (
               <div className="space-y-6 animate-slide-up">
                  <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 text-sm text-blue-800">
                     <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                     <p>您正在申请 <strong>惠农e贷</strong>，该产品为纯信用贷款，最高额度50万，年化利率3.85%起。</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">申请金额 (元)</label>
                    <input 
                      type="number" 
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#1976D2] text-lg font-bold" 
                      placeholder="请输入金额，例如 50000"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    />
                    <p className="text-xs text-gray-400 mt-1">最高可借 500,000 元</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">借款期限</label>
                    <select 
                       className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#1976D2]"
                       value={formData.period}
                       onChange={(e) => setFormData({...formData, period: e.target.value})}
                    >
                       <option value="6">6个月</option>
                       <option value="12">12个月</option>
                       <option value="24">24个月</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">借款用途</label>
                    <select className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#1976D2]">
                       <option>购买种子/种苗</option>
                       <option>购买化肥/农药</option>
                       <option>农机具购置/维修</option>
                       <option>基础设施建设</option>
                    </select>
                  </div>
               </div>
            )}

            {/* Step 2: Bank Bind (FIN-09) */}
            {step === 2 && (
               <div className="space-y-6 animate-slide-up">
                  <p className="text-sm text-gray-500">请绑定一张您本人名下的 I 类储蓄卡，用于贷款发放及后续还款。</p>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">持卡人姓名</label>
                     <input type="text" disabled value="张三" className="w-full p-3 border border-gray-200 bg-gray-50 rounded text-gray-500" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">银行卡号</label>
                     <input 
                        type="text" 
                        placeholder="请输入银行卡号" 
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#1976D2]"
                        value={formData.bankCard}
                        onChange={(e) => setFormData({...formData, bankCard: e.target.value})}
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">预留手机号</label>
                     <div className="flex gap-2">
                        <input type="text" placeholder="银行预留手机号" className="flex-1 p-3 border border-gray-300 rounded focus:outline-none focus:border-[#1976D2]" />
                        <Button variant="ghost" className="whitespace-nowrap">获取验证码</Button>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <input type="text" placeholder="输入验证码" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#1976D2]" />
                  </div>
               </div>
            )}

            {/* Step 3: Contract (FIN-07) */}
            {step === 3 && (
               <div className="space-y-6 animate-slide-up h-full flex flex-col">
                  <div className="flex-1 border border-gray-200 rounded bg-gray-50 p-4 overflow-y-auto max-h-[300px] text-xs leading-relaxed text-gray-600">
                     <h3 className="text-center font-bold text-sm text-black mb-4">个人借款合同</h3>
                     <p className="mb-2">甲方（借款人）：张三</p>
                     <p className="mb-2">乙方（贷款人）：中国农业银行股份有限公司</p>
                     <p className="mb-2">第一条 借款金额及期限...</p>
                     <p className="mb-2">第二条 借款利率...</p>
                     <p className="mb-2">...</p>
                     <p className="mb-2">（此处省略5000字合同条款）</p>
                     <p>第十条 违约责任...</p>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                     <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                           type="checkbox" 
                           className="w-5 h-5 text-[#1976D2] rounded focus:ring-[#1976D2]"
                           checked={formData.agreed}
                           onChange={(e) => setFormData({...formData, agreed: e.target.checked})}
                        />
                        <span className="text-sm">我已阅读并同意签署《个人借款合同》及《征信授权书》</span>
                     </label>
                  </div>
                  {formData.agreed && (
                     <div className="p-4 bg-yellow-50 border border-yellow-100 rounded text-sm text-yellow-800 flex items-center gap-2">
                        <div className="w-16 h-8 bg-white border border-dashed border-gray-300 flex items-center justify-center text-gray-400 font-script text-lg transform -rotate-3">
                           张三
                        </div>
                        <span>已生成电子签名</span>
                     </div>
                  )}
               </div>
            )}
          </div>

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100 relative z-10">
             <Button 
               variant="ghost" 
               disabled={step === 1} 
               onClick={() => setStep(s => s - 1)}
             >
               上一步
             </Button>
             <Button 
               variant="solid-blue" 
               onClick={handleNext}
               isLoading={isSubmitting}
               disabled={step === 3 && !formData.agreed}
               icon={step === 3 ? <PenTool size={16} /> : <ChevronRight size={16} />}
             >
               {step === 3 ? '签署并提交' : '下一步'}
             </Button>
          </div>
       </Card>
    </div>
  );
};