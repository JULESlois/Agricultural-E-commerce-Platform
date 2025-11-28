import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, SectionTitle } from '../components/Common';
import { Search, User, ShoppingBag, CreditCard, Truck, RefreshCw, HelpCircle, MessageCircle, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_CATEGORIES = [
  { id: 'account', title: '账户管理', icon: User, desc: '注册登录、实名认证、密码修改' },
  { id: 'shopping', title: '购物指南', icon: ShoppingBag, desc: '下单流程、商品搜索、批发采购' },
  { id: 'payment', title: '支付结算', icon: CreditCard, desc: '在线支付、对公转账、发票开具' },
  { id: 'logistics', title: '物流配送', icon: Truck, desc: '运费标准、物流查询、配送范围' },
  { id: 'aftersales', title: '售后服务', icon: RefreshCw, desc: '退款退货、坏果包赔、投诉建议' },
  { id: 'other', title: '常见问题', icon: HelpCircle, desc: '平台规则、安全保障、其他问题' },
];

const COMMON_FAQS = [
  {
    question: '如何注册智农链账号？',
    answer: '您可以通过点击页面右上角的“登录/注册”按钮，使用手机号码进行注册。注册过程中需要接收短信验证码。如果是农户或企业用户，注册后建议尽快在个人中心完成实名认证，以解锁更多功能。'
  },
  {
    question: '下单后多久发货？',
    answer: '一般情况下，商家会在订单支付后48小时内发货。由于农产品（特别是生鲜）受天气和采摘条件影响，具体发货时间可能会有小幅调整。您可以在“我的订单”中查看物流详情。'
  },
  {
    question: '收到商品有损坏怎么办？',
    answer: '智农链承诺“坏果包赔”。如果您收到的商品有损坏、腐烂或描述不符，请在签收后24小时内拍照（需包含快递单号），并在“我的订单”页面点击“申请售后”或直接联系商家进行理赔。'
  },
  {
    question: '支持哪些支付方式？',
    answer: '我们目前支持支付宝、微信支付以及银联云闪付。对于大额批发订单，平台支持企业网银对公转账，转账时请务必备注订单号以便系统自动核销。'
  },
  {
    question: '如何申请农业贷款？',
    answer: '请前往“助农金融”频道，选择适合您的贷款产品。点击“立即申请”后，系统将引导您填写经营信息并上传相关证件。审批通常在3个工作日内完成，部分信用贷产品支持秒批。'
  }
];

export const HelpCenter: React.FC = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const openChat = () => {
    window.dispatchEvent(new Event('open-chat'));
  };

  return (
    <div className="animate-fade-in pb-12">
      {/* Hero Search Section */}
      <div className="bg-[#1976D2] text-white py-16 px-4 text-center rounded-2xl mb-12 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold">你好，有什么可以帮您？</h1>
          <p className="text-blue-100">搜索您的问题，或浏览下方的帮助主题</p>
          <div className="relative">
             <input 
               type="text" 
               className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-800 focus:outline-none shadow-lg text-lg"
               placeholder="例如：如何申请退款？"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
             <Button className="absolute right-2 top-2 h-10 px-6" variant="solid-green">搜索</Button>
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
         {FAQ_CATEGORIES.map((cat) => (
           <Card key={cat.id} variant="interactive" className="p-6 flex items-start gap-4 hover:border-[#1976D2] group">
              <div className="p-3 bg-blue-50 text-[#1976D2] rounded-lg group-hover:bg-[#1976D2] group-hover:text-white transition-colors">
                 <cat.icon size={28} />
              </div>
              <div>
                 <h3 className="font-bold text-lg text-[#212121] mb-1">{cat.title}</h3>
                 <p className="text-sm text-gray-500">{cat.desc}</p>
              </div>
           </Card>
         ))}
      </div>

      {/* FAQ Accordion & Contact Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2">
            <SectionTitle title="热门问题" subtitle="用户最常咨询的5个问题" />
            <div className="space-y-4">
               {COMMON_FAQS.map((faq, index) => (
                  <Card key={index} className="overflow-hidden border border-gray-100">
                     <button 
                        onClick={() => toggleFaq(index)}
                        className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-gray-50 transition-colors focus:outline-none"
                     >
                        <span className="font-bold text-[#212121] text-lg">{faq.question}</span>
                        {openIndex === index ? <ChevronUp className="text-[#4CAF50]" /> : <ChevronDown className="text-gray-400" />}
                     </button>
                     {openIndex === index && (
                        <div className="p-5 pt-0 text-gray-600 bg-white border-t border-gray-50 leading-relaxed animate-fade-in">
                           <div className="pt-4">{faq.answer}</div>
                        </div>
                     )}
                  </Card>
               ))}
            </div>
         </div>

         <div className="space-y-6">
            <SectionTitle title="联系我们" />
            <Card className="p-6 bg-[#FAFAFA] border border-gray-200">
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-[#4CAF50]">
                        <MessageCircle size={20} />
                     </div>
                     <div>
                        <h4 className="font-bold text-sm">在线客服</h4>
                        <p className="text-xs text-gray-500 mb-1">24小时智能助手，人工 9:00-18:00</p>
                        <button 
                          onClick={openChat}
                          className="text-[#4CAF50] text-sm font-medium hover:underline focus:outline-none"
                        >
                          立即咨询
                        </button>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#1976D2]">
                        <Phone size={20} />
                     </div>
                     <div>
                        <h4 className="font-bold text-sm">电话支持</h4>
                        <p className="text-xs text-gray-500 mb-1">400-123-4567</p>
                        <p className="text-xs text-gray-400">周一至周日 9:00-21:00</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#FF9800]">
                        <Mail size={20} />
                     </div>
                     <div>
                        <h4 className="font-bold text-sm">电子邮件</h4>
                        <p className="text-xs text-gray-500 mb-1">support@smartagro.com</p>
                        <p className="text-xs text-gray-400">通常在1个工作日内回复</p>
                     </div>
                  </div>
               </div>
            </Card>
            
            <div className="bg-gradient-to-br from-[#4CAF50] to-[#43A047] rounded-xl p-6 text-white text-center shadow-md">
               <h3 className="font-bold text-lg mb-2">意见反馈</h3>
               <p className="text-sm opacity-90 mb-4">您的建议是我们进步的动力</p>
               <Button className="w-full bg-white text-[#4CAF50] border-none hover:bg-gray-100" onClick={() => navigate('/help/feedback')}>填写反馈单</Button>
            </div>
         </div>
      </div>
    </div>
  );
};